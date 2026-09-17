import React from "react";
import { Icon, IconName } from "./icons";

/**
 * The shape of a transfer, drawn.
 *
 * Zetarya has two routes with genuinely different speed, and the page kept
 * implying there was one: the hero, the demo panel and "we use the whole pipe"
 * all describe the direct path, and the browser-link section then inherited
 * that expectation without ever claiming it.
 *
 * Rather than argue the point in prose, each section shows its own route. One
 * unbroken line between two machines reads as fast; a line with our relay
 * sitting in the middle of it reads as the slower thing it is, and needs no
 * number to land. Numbers would also go stale — the browser rate is a server
 * constant the team tunes, and the upload page reports the live value at the
 * moment it actually matters.
 */

type Node = { icon: IconName; label: string };

const ROUTES: Record<"direct" | "relay", { nodes: Node[]; caption: string }> = {
  direct: {
    nodes: [
      { icon: "laptop", label: "your device" },
      { icon: "devices", label: "their device" },
    ],
    caption: "Straight across. Nothing in the middle to slow it down or pay for.",
  },
  relay: {
    nodes: [
      { icon: "globe", label: "any browser" },
      { icon: "shield", label: "our relay" },
      { icon: "laptop", label: "your device" },
    ],
    caption: "A browser cannot reach your machine directly, so this one comes through us - steady rather than fast and all encrypted.",
  },
};

/**
 * `direct` draws a solid accent line; `relay` breaks it over a middle node and
 * dashes the segments. The contrast between the two is the whole point, so
 * they are one component and never drift apart.
 */
export function RoutePath({
  variant,
  className = "",
}: {
  variant: "direct" | "relay";
  className?: string;
}) {
  const { nodes, caption } = ROUTES[variant];
  const direct = variant === "direct";

  return (
    <figure className={className}>
      <div className="flex items-center">
        {nodes.map((node, i) => (
          <React.Fragment key={node.label}>
            {i > 0 && (
              <span
                aria-hidden
                className={`mx-2 mb-5 flex-1 sm:mx-3 ${
                  direct ? "h-px bg-accent" : "border-t border-dashed border-faint/60"
                }`}
              />
            )}
            <span className="flex w-[74px] shrink-0 flex-col items-center gap-2 sm:w-[86px]">
              <span
                className={`grid h-9 w-9 place-items-center rounded ${
                  // The relay is ours, not the visitor's, so it is drawn as a
                  // waypoint rather than as another endpoint.
                  !direct && i === 1
                    ? "border border-dashed border-line bg-surface text-faint"
                    : "bg-accent-soft text-accent"
                }`}
              >
                <Icon name={node.icon} className="h-[17px] w-[17px]" />
              </span>
              <span className="text-center font-mono text-[10.5px] leading-tight tracking-[0.06em] text-faint">
                {node.label}
              </span>
            </span>
          </React.Fragment>
        ))}
      </div>
      <figcaption className="mt-4 max-w-[420px] text-[13.5px] leading-relaxed text-muted">
        {caption}
      </figcaption>
    </figure>
  );
}
