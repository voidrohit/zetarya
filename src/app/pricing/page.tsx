// app/pricing/page.tsx
export const dynamic = 'force-dynamic';
import React from "react";
import PricingClient from "./PricingClient";
import { createClientForServer } from "@/utils/supabase";

export default async function Page({ searchParams }: { searchParams?: Record<string, string> }) {
    // Server-side: create server supabase client and check user (this runs on the server)
    let user = null;
    try {
        const supabase = await createClientForServer();
        const { data } = await supabase.auth.getUser(); // v2 response: { data, error }
        user = data?.user ?? null;

        console.log(user);
    } catch (err) {
        // ignore errors — client will handle sign-in flow
        console.error("server supabase.getUser error:", err);
    }

    // Render client component, pass minimal server info (optional)
    // Passing `user` here is optional — the client also uses useSession() to track live auth.
    return <PricingClient serverUser={user} />;
}
