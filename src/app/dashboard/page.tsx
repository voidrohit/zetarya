// app/dashboard/page.tsx
export const dynamic = "force-dynamic";

import { createClientForServer } from "@/utils/supabase";
import { redirect } from "next/navigation";
import { headers } from "next/headers";
import DashboardClient from "./DashboardClient";

function detectOsFromUA(ua: string | null): string {
    if (!ua) return "web";
    const s = ua.toLowerCase();
    if (s.includes("windows")) return "windows";
    if (s.includes("mac os") || s.includes("macintosh")) return "mac";
    if (s.includes("linux")) return "linux";
    if (s.includes("android")) return "android";
    if (s.includes("iphone") || s.includes("ipad") || s.includes("ios")) return "ios";
    return "web";
}

export default async function Page() {
    const supabase = await createClientForServer();
    const session = await supabase.auth.getUser();
    if (!session.data.user) redirect("/signin");

    const {
        data: {
            user: { user_metadata, app_metadata, id },
        },
    } = session;

    const { name, email, user_name, avatar_url } = user_metadata ?? {};
    if (!email) redirect("/signin");

    const userName = user_name ? `@${user_name}` : "User Name Not Set";
    const provider = app_metadata?.provider ?? "—";

    // ✅ Await headers() here
    const headersList = await headers();
    const osType = detectOsFromUA(headersList.get("user-agent"));

    return (
        <DashboardClient
            initialUser={{ id, name, email, userName, provider, avatar_url }}
        />
    );
}
