// app/api/phonepe/create-payment/route.ts
import { NextRequest, NextResponse } from "next/server";

function generateOrderId() {
    return `ZT-${Date.now()}-${Math.floor(Math.random() * 9000 + 1000)}`;
}

export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const { email } = body;

        if (!email) {
            return NextResponse.json({ success: false, message: "Email is required" }, { status: 400 });
        }

        const phonepeOauthUrl =
            process.env.PHONEPE_OAUTH_URL ??
            "https://api.phonepe.com/apis/identity-manager/v1/oauth/token";
        const clientId = process.env.PHONEPE_CLIENT_ID;
        const clientVersion = process.env.PHONEPE_CLIENT_VERSION ?? "1";
        const clientSecret = process.env.PHONEPE_CLIENT_SECRET;
        const grantType = "client_credentials";

        if (!clientId || !clientSecret) {
            return NextResponse.json(
                { success: false, message: "Server misconfiguration: missing PhonePe credentials" },
                { status: 500 }
            );
        }

        // 1) Get OAuth token
        const formData = new URLSearchParams();
        formData.append("client_id", clientId);
        formData.append("client_version", clientVersion);
        formData.append("client_secret", clientSecret);
        formData.append("grant_type", grantType);

        const oauthResp = await fetch(phonepeOauthUrl, {
            method: "POST",
            headers: { "Content-Type": "application/x-www-form-urlencoded" },
            body: formData.toString(),
        });

        if (!oauthResp.ok) {
            const text = await oauthResp.text().catch(() => "");
            return NextResponse.json(
                { success: false, message: "Failed to get OAuth token", error: text },
                { status: oauthResp.status || 502 }
            );
        }

        const oauthData = await oauthResp.json();
        const accessToken = oauthData?.access_token;
        if (!accessToken) {
            return NextResponse.json(
                { success: false, message: "No access_token in PhonePe response", fullResponse: oauthData },
                { status: 500 }
            );
        }

        // 2) Create payment payload
        const merchantOrderId = generateOrderId();
        const paymentPayload = {
            merchantOrderId,
            amount: 10000, // paise (₹1499.00)
            expireAfter: 600,
            metaInfo: {
                email: email,
                merchantOrderId: merchantOrderId,
                testing: "testing",
            },
            paymentFlow: {
                type: "PG_CHECKOUT",
                message: "Payment message used for collect requests",
                merchantUrls: {
                    redirectUrl: process.env.PHONEPE_REDIRECT_URL ?? "https://www.zetarya.com/dashboard",
                },
            },
        };

        // 3) Call PhonePe Checkout create API
        const createResp = await fetch("https://api.phonepe.com/apis/pg/checkout/v2/pay", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Authorization: `O-Bearer ${accessToken}`,
            },
            body: JSON.stringify(paymentPayload),
        });

        const createText = await createResp.text().catch(() => "");
        let paymentData: any = {};
        try {
            paymentData = createText ? JSON.parse(createText) : {};
        } catch {
            paymentData = { raw: createText };
        }

        if (createResp.ok) {
            const redirectionUrl =
                paymentData.redirectionUrl || (paymentData.data && paymentData.data.redirectionUrl) || null;

            return NextResponse.json(
                {
                    success: true,
                    paymentLink: redirectionUrl,
                    merchantOrderId,
                    amount: paymentPayload.amount,
                    fullResponse: paymentData,
                },
                { status: 200 }
            );
        } else {
            return NextResponse.json(
                { success: false, message: "Failed to create payment link", error: paymentData },
                { status: createResp.status || 502 }
            );
        }
    } catch (err: any) {
        console.error("API Error:", err);
        return NextResponse.json({ success: false, message: "Internal server error", error: String(err) }, { status: 500 });
    }
}
