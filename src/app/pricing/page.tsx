export const dynamic = 'force-dynamic';
import React from "react";
import PricingClient from "./PricingClient";
import { createClientForServer } from "@/utils/supabase";

export default async function Page({ searchParams }: { searchParams?: Record<string, string> }) {
    let user = null;
    try {
        const supabase = await createClientForServer();
        const { data } = await supabase.auth.getUser();
        user = data?.user ?? null;

        console.log(user);
    } catch (err) {
        console.error("server supabase.getUser error:", err);
    }

    return <PricingClient serverUser={user} />;
}
