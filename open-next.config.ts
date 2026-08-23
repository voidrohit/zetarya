import { defineCloudflareConfig } from "@opennextjs/cloudflare";

// Defaults are fine: no ISR on this site, every page is either static or a
// plain dynamic route, so there is no incremental cache to configure.
export default defineCloudflareConfig();
