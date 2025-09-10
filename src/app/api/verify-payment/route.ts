// minimal forwarder — no verification logic, just forwards body to external API
import { NextResponse } from "next/server";

export async function POST(req: Request) {
    try {
        const body = await req.json();

        const forwardRes = await fetch("https://login.zetarya.com/verify-payment", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(body), // forward exactly what client sent
        });

        const text = await forwardRes.text();
        if (!forwardRes.ok) {
            return NextResponse.json({ error: "External verify failed", details: text }, { status: 502 });
        }

        return NextResponse.json({ success: true, externalResponse: text });
    } catch (err) {
        console.error("forwarder error", err);
        return NextResponse.json({ error: "Internal error" }, { status: 500 });
    }
}
