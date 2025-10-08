// app/api/phonepe/create-order/route.ts (App Router)
import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const { email } = body;

        if (!email) {
            return NextResponse.json(
                { error: 'Email is required' },
                { status: 400 }
            );
        }

        const orderRes = await fetch("https://login.zetarya.com/phonepe/oauth/token", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ email }),
        });

        if (!orderRes.ok) {
            const errorText = await orderRes.text();
            console.error('PhonePe API Error:', errorText);
            return NextResponse.json(
                { error: `Order creation failed: ${orderRes.status}` },
                { status: orderRes.status }
            );
        }

        const orderData = await orderRes.json();
        return NextResponse.json(orderData);

    } catch (err) {
        console.error('API Error:', err);
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        );
    }
}