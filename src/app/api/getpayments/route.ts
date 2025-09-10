// app/api/getpayments/route.ts
import { NextResponse } from "next/server";

export async function POST(req: Request) {
    try {
        const body = await req.json();

        const EXTERNAL_URL =
            process.env.EXTERNAL_GETPAYMENTS_URL ?? "https://login.zetarya.com/getpayments";

        const headers: Record<string, string> = {
            "Content-Type": "application/json",
        };

        if (process.env.INTERNAL_API_KEY) {
            headers["x-internal-api-key"] = process.env.INTERNAL_API_KEY;
        }

        const forwardRes = await fetch(EXTERNAL_URL, {
            method: "POST",
            headers,
            body: JSON.stringify(body),
        });

        const text = await forwardRes.text();
        let parsed: unknown;
        try {
            parsed = JSON.parse(text);
        } catch {
            parsed = text;
        }

        if (!forwardRes.ok) {
            return NextResponse.json(
                { error: "External API error", status: forwardRes.status, details: parsed },
                { status: 502 }
            );
        }

        return NextResponse.json(parsed);
    } catch (err) {
        console.error("getpayments route error:", err);
        return NextResponse.json({ error: "Internal server error" }, { status: 500 });
    }
}
