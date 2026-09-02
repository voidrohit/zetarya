import { defineCloudflareConfig } from "@opennextjs/cloudflare";

// Defaults are fine: no ISR on this site, every page is either static or a
// plain dynamic route, so there is no incremental cache to configure.
export default {
  ...defineCloudflareConfig(),
  // Without this, OpenNext builds the Next app by shelling out to the package
  // manager's own `build` script — which is now `opennextjs-cloudflare build`,
  // so it would call itself forever. Naming the Next build directly breaks that
  // loop and lets `yarn build` be the single command CI needs to run.
  buildCommand: "next build",
};
