import type { Metadata } from "next";
import React from "react";
import SiteShell from "@/components/site/site-shell";
import { Reveal } from "@/components/site/reveal";
import { CtaBanner } from "@/components/site/primitives";
import JsonLd from "@/components/site/json-ld";
import { breadcrumbs, graph, softwareApplication, webPage } from "@/lib/schema";

const DESCRIPTION =
  "Moving terabytes directly between two machines at the speed of the link, with transfers that survive interruption and data that is never legible to anything in between.";

export const metadata: Metadata = {
  title: "White paper - Zetarya",
  description: DESCRIPTION,
  alternates: { canonical: "/whitepaper" },
  openGraph: {
    type: "article",
    title: "Line Rate, End to End - Zetarya white paper",
    description: DESCRIPTION,
    url: "/whitepaper",
  },
};

/* ------------------------------------------------------------------ layout */

function Chapter({
  num,
  title,
  children,
}: {
  num: string;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section className="mt-16 sm:mt-20">
      <Reveal>
        <div className="mx-auto flex max-w-prose items-baseline gap-3 border-b border-line pb-3">
          <span className="font-mono text-[13px] font-medium text-accent">{num}</span>
          <h2 className="text-[23px] font-semibold tracking-[-0.02em] sm:text-[26px]">{title}</h2>
        </div>
      </Reveal>
      <div className="mx-auto mt-7 max-w-prose space-y-5 text-[16.5px] leading-[1.75] text-ink/85 sm:text-[17px]">
        {children}
      </div>
    </section>
  );
}

function Sub({ children }: { children: React.ReactNode }) {
  return <h3 className="!mt-9 text-[16px] font-semibold text-ink">{children}</h3>;
}

function Figure({
  label,
  caption,
  children,
}: {
  label: string;
  caption: string;
  children: React.ReactNode;
}) {
  return (
    <Reveal>
      <figure className="mx-auto mt-10 max-w-[880px] rounded border border-line bg-card p-5 sm:p-7">
        <div className="overflow-x-auto">{children}</div>
        <figcaption className="mt-5 border-t border-line pt-4 text-[13.5px] leading-relaxed text-muted">
          <span className="mr-2 font-mono text-[11px] font-medium uppercase tracking-[0.09em] text-faint">
            {label}
          </span>
          {caption}
        </figcaption>
      </figure>
    </Reveal>
  );
}

/* ----------------------------------------------------------------- figures */

function PathDiagram() {
  return (
    <svg
      viewBox="0 0 760 280"
      role="img"
      className="w-full min-w-[600px]"
      aria-label="A laptop and a phone joined by a direct path secured with TLS 1.3, each behind its own network address translator. Below them, a relay shown as the fallback used only when a direct path cannot be opened, forwarding encrypted bytes."
    >
      <defs>
        <marker
          id="wpArrowDirect"
          viewBox="0 0 10 10"
          refX="8"
          refY="5"
          markerWidth="6.5"
          markerHeight="6.5"
          orient="auto-start-reverse"
        >
          <path d="M0,0 L10,5 L0,10 z" className="fill-accent" />
        </marker>
      </defs>

      {/* Peers are drawn as the two machines a reader actually owns rather than
          as labelled rectangles. A box joined to a box is a network diagram and
          asks to be decoded; a laptop joined to a phone is the thing itself.
          Both are centred on y=66 so the direct path runs level between them. */}

      {/* Laptop — lid, screen, and a base wider than the lid. */}
      <rect x="58" y="35" width="84" height="52" rx="3" className="fill-none stroke-line" strokeWidth="1.5" />
      <rect x="62" y="39" width="76" height="40" rx="2" className="fill-surface stroke-none" />
      <path d="M50,87 H150 L156,95 H44 Z" className="fill-none stroke-line" strokeWidth="1.5" strokeLinejoin="round" />

      <text x="100" y="122" textAnchor="middle" className="fill-ink font-mono text-[13px] font-semibold">PEER A</text>
      <text x="100" y="138" textAnchor="middle" className="fill-faint font-mono text-[9.5px]">pk:7f3c…a91</text>

      {/* Phone — body, screen, camera island and home indicator. */}
      <rect x="639" y="30" width="42" height="72" rx="7" className="fill-none stroke-line" strokeWidth="1.5" />
      <rect x="643" y="36" width="34" height="58" rx="4" className="fill-surface stroke-none" />
      <rect x="653" y="39" width="14" height="4" rx="2" className="fill-line stroke-none" />
      <line x1="652" y1="98" x2="668" y2="98" className="stroke-line" strokeWidth="1.5" strokeLinecap="round" />

      <text x="660" y="122" textAnchor="middle" className="fill-ink font-mono text-[13px] font-semibold">PEER B</text>
      <text x="660" y="138" textAnchor="middle" className="fill-faint font-mono text-[9.5px]">pk:0d61…2e4</text>

      <rect x="200" y="30" width="12" height="72" strokeDasharray="3,3" className="fill-none stroke-muted" />
      <text x="206" y="118" textAnchor="middle" className="fill-faint font-mono text-[9px]">NAT</text>

      <rect x="583" y="30" width="12" height="72" strokeDasharray="3,3" className="fill-none stroke-muted" />
      <text x="589" y="118" textAnchor="middle" className="fill-faint font-mono text-[9px]">NAT</text>

      <line
        x1="170"
        y1="66"
        x2="630"
        y2="66"
        className="stroke-accent"
        strokeWidth="2.25"
        markerStart="url(#wpArrowDirect)"
        markerEnd="url(#wpArrowDirect)"
      />
      <text x="400" y="53" textAnchor="middle" className="fill-accent text-[11.5px] font-medium">
        direct path, TLS 1.3 · simultaneous outbound UDP
      </text>

      <rect x="346" y="178" width="108" height="52" rx="4" className="fill-none stroke-line" strokeWidth="1.5" />
      <text x="400" y="200" textAnchor="middle" className="fill-ink font-mono text-[11px] font-semibold">RELAY</text>
      <text x="400" y="215" textAnchor="middle" className="fill-muted text-[9px]">forwards ciphertext</text>

      {/* Leaving from below the labels, not from the device edge: an arc off the
          machine itself would run straight through "PEER A". */}
      <path d="M100,150 Q220,190 346,205" className="fill-none stroke-muted" strokeWidth="1.2" strokeDasharray="4,4" />
      <path d="M454,205 Q560,190 660,150" className="fill-none stroke-muted" strokeWidth="1.2" strokeDasharray="4,4" />
      <text x="400" y="256" textAnchor="middle" className="fill-muted text-[10px]">
        fallback path, used only when direct establishment fails
      </text>
    </svg>
  );
}

function RateDiagram() {
  return (
    <svg
      viewBox="0 0 760 320"
      role="img"
      className="w-full min-w-[600px]"
      aria-label="Throughput over time on a gigabit path with 150 millisecond latency. A standard TCP flow oscillates near 9 Mbps, a small fraction of link capacity. The paced transport in this design rises to just below link capacity and holds there, dipping only briefly at each loss event."
    >
      <line x1="95" y1="40" x2="95" y2="260" className="stroke-line" strokeWidth="1" />
      <line x1="95" y1="260" x2="712" y2="260" className="stroke-line" strokeWidth="1" />
      <text x="60" y="150" textAnchor="middle" transform="rotate(-90 60 150)" className="fill-muted text-[10px]">throughput</text>
      <text x="404" y="284" textAnchor="middle" className="fill-muted text-[10px]">time</text>

      <line x1="95" y1="58" x2="712" y2="58" className="stroke-muted" strokeWidth="1" strokeDasharray="5,4" opacity="0.55" />
      <text x="99" y="50" className="fill-muted text-[10px]">link capacity, 1 Gbps</text>

      <line x1="290" y1="40" x2="290" y2="260" className="stroke-muted" strokeWidth="1" strokeDasharray="3,3" opacity="0.35" />
      <line x1="500" y1="40" x2="500" y2="260" className="stroke-muted" strokeWidth="1" strokeDasharray="3,3" opacity="0.35" />
      <text x="290" y="32" textAnchor="middle" className="fill-faint text-[9.5px]">loss event</text>
      <text x="500" y="32" textAnchor="middle" className="fill-faint text-[9.5px]">loss event</text>

      <polyline
        points="95,240 140,165 185,118 230,100 280,97 292,110 308,110 322,97 488,95 500,108 516,108 530,96 712,94"
        className="fill-none stroke-accent"
        strokeWidth="2.5"
      />
      <text x="706" y="80" textAnchor="end" className="fill-accent text-[11px] font-medium">this design</text>

      <polyline points="95,252 290,236 290,247 500,235 500,246 712,236" className="fill-none stroke-ink" strokeWidth="1.8" opacity="0.75" />
      <circle cx="290" cy="236" r="3" className="fill-accent" />
      <circle cx="500" cy="235" r="3" className="fill-accent" />
      <text x="706" y="224" textAnchor="end" className="fill-ink text-[11px] font-medium">standard TCP</text>
      <text x="706" y="254" textAnchor="end" className="fill-faint text-[9.5px]">≈ 9 Mbps at 150 ms RTT, 0.01% loss</text>
    </svg>
  );
}

function ResumeDiagram() {
  const chunks = Array.from({ length: 16 }, (_, i) => 48 + i * 42);
  return (
    <svg
      viewBox="0 0 760 300"
      role="img"
      className="w-full min-w-[600px]"
      aria-label="A transfer represented as a sequence of chunks. Seven are verified and committed to disk, one was in flight when both peers lost power, and the remainder are unsent. On restart the transfer resumes at the first unverified chunk rather than at the beginning."
    >
      <defs>
        <marker
          id="wpArrowResume"
          viewBox="0 0 10 10"
          refX="8"
          refY="5"
          markerWidth="6.5"
          markerHeight="6.5"
          orient="auto-start-reverse"
        >
          <path d="M0,0 L10,5 L0,10 z" className="fill-accent" />
        </marker>
      </defs>

      <text x="48" y="34" className="fill-muted font-mono text-[11px]">
        2 TB TRANSFER · 16 MiB CHUNKS · 119,210 TOTAL, 16 SHOWN
      </text>

      {chunks.map((x, i) => (
        <rect
          key={x}
          x={x}
          y={50}
          width={34}
          height={34}
          rx={2}
          className={
            i < 7
              ? "fill-accent stroke-none"
              : i === 7
                ? "fill-accent-soft stroke-accent"
                : "fill-none stroke-line"
          }
          strokeWidth={i === 7 ? 2 : 1.3}
        />
      ))}

      <line x1="359" y1="84" x2="359" y2="112" className="stroke-muted" strokeWidth="1.2" strokeDasharray="3,3" />
      <polyline
        points="349,112 369,112 353,128 373,128 359,144"
        className="fill-none stroke-accent"
        strokeWidth="2.25"
        strokeLinejoin="round"
        strokeLinecap="round"
      />
      <text x="359" y="166" textAnchor="middle" className="fill-ink text-[10.5px]">
        interruption: connection lost or power removed
      </text>
      <text x="359" y="181" textAnchor="middle" className="fill-muted text-[10.5px]">
        both peers restart, at any later time
      </text>

      <path
        d="M359,193 L359,214 L640,214 L640,44 L380,44 L380,50"
        className="fill-none stroke-accent"
        strokeWidth="2"
        markerEnd="url(#wpArrowResume)"
      />
      <text
        x="652"
        y="130"
        textAnchor="middle"
        transform="rotate(-90 652 130)"
        className="fill-accent font-mono text-[10.5px]"
      >
        RESUME AT FIRST UNVERIFIED CHUNK
      </text>

      <rect x="48" y="252" width="16" height="16" rx="2" className="fill-accent" />
      <text x="70" y="264" className="fill-muted text-[10.5px]">verified and committed to disk</text>

      <rect x="290" y="252" width="16" height="16" rx="2" className="fill-accent-soft stroke-accent" strokeWidth="1.5" />
      <text x="312" y="264" className="fill-muted text-[10.5px]">in flight at interruption</text>

      <rect x="480" y="252" width="16" height="16" rx="2" className="fill-none stroke-line" strokeWidth="1.3" />
      <text x="502" y="264" className="fill-muted text-[10.5px]">not yet sent</text>
    </svg>
  );
}

/* -------------------------------------------------------------------- page */

const SPEC_ROWS: [string, string][] = [
  ["Peer addressing", "Long‑lived public key, independent of network address"],
  ["Path selection", "Direct where establishable; relayed fallback otherwise"],
  ["Transport security", "TLS 1.3, established before transfer metadata"],
  ["Payload encryption", "AES‑256, applied per chunk"],
  ["Integrity", "Per‑chunk cryptographic hash, verified before commit"],
  ["Congestion control", "Paced to measured bandwidth and round‑trip time"],
  ["Resume granularity", "One chunk, 16 MiB in the reference configuration"],
  ["Progress durability", "Committed to disk on both peers as the transfer proceeds"],
  [
    "Third‑party data access",
    "None; relay and rendezvous see ciphertext and connection metadata only",
  ],
];

export default function WhitePaperPage() {
  return (
    <SiteShell>
      <JsonLd
        data={graph(
          breadcrumbs("https://zetarya.com/whitepaper", [
            { name: "White paper", path: "/whitepaper" },
          ]),
          webPage({
            path: "/whitepaper",
            name: "Line Rate, End to End - Zetarya white paper",
            description: DESCRIPTION,
            trail: [],
            extra: { mainEntity: { "@id": "https://zetarya.com/#software" } },
          }),
          softwareApplication(),
        )}
      />

      <article className="measure pb-6 pt-14 sm:pt-20">
        {/* ---------------------------------------------------------- masthead */}
        <div className="mx-auto max-w-prose">
          <Reveal>
            <div className="flex justify-between border-b border-line pb-3 font-mono text-[11px] uppercase tracking-[0.08em] text-faint">
              <span>Technical White Paper</span>
              <span>TN‑014</span>
            </div>
          </Reveal>

          <Reveal delay={70}>
            <p className="mt-8 font-mono text-[11px] font-medium tracking-[0.09em] text-accent">
              PEER‑TO‑PEER DATA TRANSFER
            </p>
          </Reveal>
          <Reveal delay={110}>
            <h1 className="h-display mt-4 text-[38px] sm:text-[48px] lg:text-[54px]">
              Line Rate, End to End
            </h1>
          </Reveal>
          <Reveal delay={170}>
            <p className="mt-5 text-[17px] leading-relaxed text-muted sm:text-[19px]">
              Moving terabytes directly between two machines at the speed of the link, with
              transfers that survive interruption and data that is never legible to anything in
              between.
            </p>
          </Reveal>
          <Reveal delay={230}>
            <div className="mt-8 flex flex-wrap gap-x-8 gap-y-2 border-y border-line py-3 font-mono text-[11.5px] text-faint">
              <span>
                <span className="text-muted">VERSION</span> 0.1
              </span>
              <span>
                <span className="text-muted">DATE</span> September 2026
              </span>
              <span>
                <span className="text-muted">CLASSIFICATION</span> Public
              </span>
            </div>
          </Reveal>

          <Reveal delay={290}>
            <div className="mt-10 rounded border border-line border-l-2 border-l-accent bg-surface p-6">
              <p className="font-mono text-[11px] font-medium tracking-[0.09em] text-accent">
                ABSTRACT
              </p>
              <p className="mt-3 text-[15.5px] leading-[1.7] text-muted">
                This paper describes the design of a peer‑to‑peer transfer system for datasets
                ranging from tens of gigabytes to tens of terabytes. It addresses three distinct
                problems that keep large transfers slow in practice: establishing a direct path
                between two machines that both sit behind network address translation; sustaining
                throughput near the capacity of that path rather than the conservative rate a single
                TCP flow settles at; and surviving interruption without discarding completed work.
                The design combines identity‑based peer addressing and TLS 1.3 transport security
                with a bandwidth‑paced congestion controller and a chunked payload format in which
                every unit is independently encrypted, independently verified, and durably recorded
                on both peers.
              </p>
            </div>
          </Reveal>
        </div>

        {/* ------------------------------------------------------------- 01 */}
        <Chapter num="01" title="The gap between capacity and throughput">
          <p>
            Connectivity has improved faster than the software that consumes it. A symmetric gigabit
            link is now unremarkable in offices and common in homes. At that capacity, two terabytes
            should move in roughly four and a half hours. In practice, transfers of that size
            routinely take a day or more, and a meaningful share of them fail partway through and
            are restarted from zero.
          </p>
          <p>
            The shortfall is not in the link. It is the sum of three independent failures, each of
            which has to be addressed on its own terms.
          </p>

          <ol className="!mt-6 list-none space-y-3 p-0">
            {[
              [
                "Reachability.",
                "Two machines behind network address translation cannot open a connection to each other unassisted, and the conventional assistance is a server in the middle, which then becomes the ceiling on throughput and a third party to the data.",
              ],
              [
                "Throughput.",
                "A single TCP flow on a long‑distance path settles at a small fraction of the capacity available to it, and the shortfall widens as capacity and latency increase.",
              ],
              [
                "Durability.",
                "A transfer interrupted at 94 percent has, in most implementations, completed nothing. Progress is held in the memory of a process that no longer exists.",
              ],
            ].map(([lead, rest], i) => (
              <li key={lead} className="flex gap-3.5">
                <span className="mt-1 h-fit rounded bg-accent-soft px-[7px] py-[2px] font-mono text-[11.5px] text-accent">
                  {i + 1}
                </span>
                <span>
                  <b className="font-semibold text-ink">{lead}</b> {rest}
                </span>
              </li>
            ))}
          </ol>

          <p>
            Each is treated separately below, followed by the security properties that result and
            the limitations that remain.
          </p>
        </Chapter>

        {/* ------------------------------------------------------------- 02 */}
        <Chapter num="02" title="Establishing a direct path">
          <p>
            Few endpoints on the internet are directly addressable. A laptop sits behind a home
            router performing address translation, a phone moves between carrier networks and
            changes address as it does, and an office network sits behind a firewall configured to
            drop unsolicited inbound traffic. Two peers that want to exchange data are, by default,
            mutually unreachable.
          </p>
          <p>
            Relaying the data through a central server resolves reachability at the cost of
            everything else. The server’s egress capacity becomes the ceiling on transfer speed, its
            storage becomes a liability, and its operator becomes a party to every transfer that
            passes through it.
          </p>
          <p>
            The design separates reachability from data flow. Each device holds a long‑lived
            cryptographic keypair and is addressed by its public key rather than by an address,
            which allows a peer to remain identifiable as its network location changes. A stateless
            rendezvous service accepts the set of candidate paths on which a peer can currently be
            reached and forwards that set to a peer attempting to reach it. It holds no data and
            retains no transfer state.
          </p>
          <p>
            Both sides then transmit outbound UDP traffic to each other’s observed public address at
            the same time. Because each side’s translation table now holds a record of an outbound
            flow, the corresponding inbound packet is accepted rather than discarded, and a direct
            path opens. For the majority of home and office pairings this is the path used for the
            entire transfer, and no third party carries any payload.
          </p>
          <p>
            Where the network does not permit it, typically under symmetric or carrier‑grade
            translation or a restrictive corporate firewall, the connection falls back to a relay
            that forwards ciphertext. This preserves availability at some cost to throughput. It is
            the exception path, not the design.
          </p>
          <p>
            The session is secured with TLS 1.3 at establishment, before any transfer metadata is
            exchanged, on the direct and relayed path alike. Neither the relay operator nor the
            rendezvous service has access to plaintext at any point.
          </p>
        </Chapter>

        <Figure
          label="Figure 1"
          caption="The two routes a transfer can take. Peers open a direct path by transmitting outbound simultaneously, so that each side's translation table admits the other's reply; for most pairings this carries the entire transfer and no third party sees a byte. Only where it cannot be opened does the relay carry the session, and it carries ciphertext either way. The address exchange that precedes all of this moves no payload and is not a hop on either route."
        >
          <PathDiagram />
        </Figure>

        {/* ------------------------------------------------------------- 03 */}
        <Chapter num="03" title="Sustaining throughput">
          <p>
            A direct path is not necessarily a fast one. On a long transfer the limiting factor is
            rarely the capacity of the link; it is the behaviour of the congestion controller
            carrying the data across it.
          </p>
          <p>
            Classical TCP congestion control was designed for links that were scarce and shared, and
            it treats packet loss as evidence of congestion. On detecting a loss it halves its
            sending rate, then recovers by roughly one segment per round trip. On a high‑capacity,
            high‑latency path the consequences are severe. The Mathis model estimates the
            steady‑state rate of a standard TCP flow at approximately <i>MSS</i> × 1.22 ÷ (
            <i>RTT</i> × √<i>p</i>). For a 1500‑byte MTU, a 150 ms round trip and a loss rate of
            0.01 percent, that is about 9 Mbps, which is under one percent of a gigabit link. That
            loss rate is not pathological. It is ordinary for an intercontinental path.
          </p>

          <blockquote className="!my-8 border-l-2 border-accent pl-5 text-[20px] font-semibold leading-[1.45] tracking-[-0.015em] text-ink sm:text-[22px]">
            Two terabytes at 9 Mbps is nineteen days. The same two terabytes at the capacity of the
            same link is four and a half hours.
          </blockquote>

          <p>
            Two further properties of such a path compound the problem. The bandwidth‑delay product
            of a gigabit link at 150 ms is 18.75 MB, which is the volume that must be in flight at
            all times to keep the link full, and many systems will not open a window of that size
            without explicit configuration. Loss on these paths is also frequently caused by
            transient queueing rather than sustained congestion, so halving the sending rate
            relieves nothing that was actually constrained.
          </p>

          <Sub>Congestion behaviour</Sub>
          <p>
            Our transport does not use loss as its primary congestion signal. It maintains a running
            estimate of the path’s delivery rate and of its minimum round‑trip time, paces
            transmission to that estimated available bandwidth, and probes periodically to detect a
            change in capacity. This is the same class of behaviour as BBR: the controller converges
            on a measured rate rather than oscillating between an aggressive probe and a
            conservative retreat.
          </p>
          <p>
            A single lost packet is retransmitted without a change in sending rate. The signal that
            does reduce the rate is sustained growth in queueing delay, which is a more reliable
            indicator that the path is genuinely saturated. The practical effect over a multi‑hour
            transfer is that the connection holds a rate near the measured capacity of the path for
            its duration, instead of spending most of that duration recovering from individual loss
            events.
          </p>
        </Chapter>

        <Figure
          label="Figure 2"
          caption="Throughput against time on the same path and the same two loss events. The standard flow halves its rate at each loss and recovers linearly, holding an average near one percent of capacity. The paced controller treats an isolated loss as a retransmission rather than a congestion signal. Vertical scale is compressed for legibility."
        >
          <RateDiagram />
        </Figure>

        {/* ------------------------------------------------------------- 04 */}
        <Chapter num="04" title="Surviving interruption">
          <p>
            A transfer measured in terabytes runs for hours. Across that window the probability of
            an uninterrupted run is not high. Laptops suspend, mobile connections drop between
            cells, sessions are killed by idle timeouts, and machines lose power. A transfer
            implemented as one continuous stream has no useful representation of partial completion:
            if it terminates at 94 percent, that 94 percent cannot be reclaimed, and the work is
            repeated in full.
          </p>
          <p>
            The design treats a transfer as a set of independently verifiable units rather than as a
            stream.
          </p>
          <p>
            Before transmission begins, the sender constructs a manifest: an ordered list of
            fixed‑size chunks recording, for each, its offset and a cryptographic hash of its
            contents. The manifest is exchanged and stored by both peers. For a two‑terabyte
            transfer at a 16 MiB chunk size this is approximately 119,000 chunks and a manifest of
            under 4 MB.
          </p>
          <p>
            Each chunk is encrypted with AES‑256 and transmitted independently. On arrival it is
            decrypted, hashed, and compared against the manifest. Only then is it written and
            recorded as committed. That commitment record is durable by design: it is held on disk
            on both ends and updated as the transfer proceeds, rather than kept in the memory of the
            process performing the transfer.
          </p>
          <p>
            Recovery follows directly. When a peer restarts, for any reason and after any interval,
            it reads the manifest and its own commitment record, determines the first chunk not yet
            verified, and resumes there. No committed chunk is retransmitted. The maximum work lost
            to an interruption is one chunk, and that bound holds regardless of the size of the
            transfer or how far it had progressed. Both peers may lose power simultaneously without
            changing the outcome.
          </p>
          <p>
            The per‑chunk hash serves a second purpose. It establishes not only what has been
            received but that what was received is correct. A chunk failing verification is
            discarded and requested again rather than written, so corruption in transit cannot
            produce a damaged file that reports success.
          </p>
        </Chapter>

        <Figure
          label="Figure 3"
          caption="Each chunk is decrypted, verified against the manifest, and only then committed. Because the commitment record is on disk rather than in process memory, both peers can restart and resume at the first unverified chunk. The work lost is bounded by one chunk irrespective of transfer size."
        >
          <ResumeDiagram />
        </Figure>

        {/* ------------------------------------------------------------- 05 */}
        <Chapter num="05" title="Security properties">
          <p>
            Encryption here is not a wrapper applied around a finished transfer path. It is a
            property of each component described above, and it is applied at two levels.
          </p>
          <p>
            At the transport level, the connection runs over TLS 1.3 and is established before any
            transfer metadata is exchanged. This holds whether the session is direct or relayed. At
            the payload level, each chunk is separately encrypted with AES‑256 under keys derived
            from the peers’ own identities, before it leaves the sending machine. A chunk in
            transit, or briefly resident on a relay, is therefore not interpretable by anything
            other than the receiving peer.
          </p>
          <p>
            Integrity is enforced by the same per‑chunk hash that makes resumption possible.
            Verification is a precondition of commitment rather than an audit performed afterwards,
            so a modified or truncated chunk is rejected before it reaches disk.
          </p>
          <p>
            Infrastructure exposure is correspondingly narrow. The rendezvous service observes
            public keys and candidate addresses. It does not observe filenames, transfer sizes,
            manifests or content. A relay, in the cases where one is required, observes ciphertext
            and the fact that two peers are exchanging it.
          </p>

          <div className="!mt-9 overflow-x-auto rounded border border-line bg-card">
            <table className="w-full min-w-[520px] border-collapse text-left text-[14px]">
              <thead>
                <tr className="bg-surface">
                  <th className="px-5 py-3 font-mono text-[10.5px] font-medium uppercase tracking-[0.09em] text-faint">
                    Property
                  </th>
                  <th className="px-5 py-3 font-mono text-[10.5px] font-medium uppercase tracking-[0.09em] text-faint">
                    Design
                  </th>
                </tr>
              </thead>
              <tbody>
                {SPEC_ROWS.map(([k, v]) => (
                  <tr key={k} className="border-t border-line align-top">
                    <td className="whitespace-nowrap px-5 py-3 font-medium text-ink">{k}</td>
                    <td className="px-5 py-3 text-muted">{v}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Chapter>



        {/* -------------------------------------------------------- colophon */}
        <Reveal>
          <div className="mx-auto mt-20 max-w-prose border-t border-line pt-5 font-mono text-[11px] leading-[1.8] text-faint">
            Technical white paper TN‑014 · Version 0.1 · September 2026
            <br />
            Figures 2 and 3 use modelled values for illustration. Throughput estimates follow the
            Mathis model for a 1500‑byte MTU at 150 ms round‑trip time.
          </div>
        </Reveal>
      </article>

      <CtaBanner
        title="Move something big."
        sub="The fastest way to understand the protocol is to watch it saturate your own link."
      />
    </SiteShell>
  );
}
