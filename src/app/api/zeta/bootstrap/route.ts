// app/api/zeta/bootstrap/route.ts
import { NextResponse } from "next/server";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const ZETA_API_BASE = process.env.ZETA_API_BASE ?? "https://login.zetarya.com";

type UpstreamNorm = {
    ok: boolean;
    status: number;
    success?: boolean;
    message?: string;
    data?: any;
    statusCode?: number; // inner API's statusCode (200/404/409 etc.)
    raw?: any;           // for debugging
};

const baseHeaders = {
    "Content-Type": "application/json",
    Accept: "application/json",
    "User-Agent": "Zetarya-Dashboard/1.0 (+https://zetarya.com)",
};

// Unwrap API-GW envelope whether body is a string or an object
function normalizeEnvelope(j: any): { success?: boolean; message?: string; data?: any; statusCode?: number } {
    if (j && typeof j === "object" && "body" in j) {
        const inner =
            typeof j.body === "string"
                ? safeParse(j.body) ?? {}
                : j.body ?? {};
        return { ...inner, statusCode: j.statusCode };
    }
    return j ?? {};
}

function safeParse(s: string) {
    try {
        return JSON.parse(s);
    } catch {
        return null;
    }
}

// Coerce numeric strings coming from DynamoDB into numbers for your UI
function coerceNumbers(d: any) {
    if (!d || typeof d !== "object") return d;
    const keys = [
        "data_send_mb",
        "data_received_mb",
        "allowed_speed_mbps",
        "allowed_data_mb",
        "license_expiry_date",
    ];
    const out: any = { ...d };
    for (const k of keys) {
        if (k in out && typeof out[k] === "string" && out[k].trim() !== "") {
            const n = Number(out[k]);
            if (Number.isFinite(n)) out[k] = n;
        }
    }
    return out;
}

async function fetchJson(url: string, body: any, ms = 12000): Promise<UpstreamNorm> {
    const controller = new AbortController();
    const t = setTimeout(() => controller.abort(), ms);
    try {
        const res = await fetch(url, {
            method: "POST",
            headers: baseHeaders,
            body: JSON.stringify(body),
            cache: "no-store",
            signal: controller.signal,
        });

        const clone = res.clone();

        // Try JSON first
        try {
            const j = await res.json();
            const norm = normalizeEnvelope(j);
            return {
                ok: res.ok,
                status: res.status,
                success: norm.success,
                message: norm.message,
                data: norm.data,
                statusCode: norm.statusCode,
                raw: j,
            };
        } catch {
            // Fallback to text (useful if upstream sends HTML/WAF)
            const text = await clone.text();
            return { ok: res.ok, status: res.status, message: `Non-JSON upstream: ${text.slice(0, 200)}`, raw: text };
        }
    } finally {
        clearTimeout(t);
    }
}

export async function POST(req: Request) {
    try {
        const { email, id, os_type } = (await req.json()) as {
            email?: string;
            id?: string;
            os_type?: string;
        };

        if (!email || !id || !os_type) {
            return NextResponse.json(
                { success: false, message: "email, id, os_type are required" },
                { status: 400 }
            );
        }

        // 1) userinfo
        const info = await fetchJson(`${ZETA_API_BASE}/userinfo`, { email });

        if (info.success === true && info.data) {
            return NextResponse.json({
                success: true,
                created: false,
                data: coerceNumbers(info.data),
                message: info.message,
            });
        }

        // If API-GW embedded statusCode says 404 -> create; otherwise surface failure
        if (info.statusCode && info.statusCode !== 404 && info.success !== true) {
            return NextResponse.json(
                { success: false, message: `userinfo failed (${info.statusCode})`, debug: info },
                { status: 502 }
            );
        }

        // 2) createuser (handles first-time user OR returns 409 "exists")
        const created = await fetchJson(`${ZETA_API_BASE}/createuser`, { email, id, os_type });

        if (created.success === true && created.data) {
            return NextResponse.json({
                success: true,
                created: created.statusCode === 201, // best-effort
                data: coerceNumbers(created.data),
                message: created.message,
            });
        }

        // 3) retry userinfo in case of 409 exists w/o data echo
        const retry = await fetchJson(`${ZETA_API_BASE}/userinfo`, { email });
        if (retry.success === true && retry.data) {
            return NextResponse.json({
                success: true,
                created: false,
                data: coerceNumbers(retry.data),
                message: retry.message,
            });
        }

        return NextResponse.json(
            { success: false, message: "Unable to bootstrap user", debug: { info, created, retry } },
            { status: 502 }
        );
    } catch (e: any) {
        return NextResponse.json(
            { success: false, message: "Server error in bootstrap route", error: String(e?.message || e) },
            { status: 500 }
        );
    }
}
