export const SPECS = {
  freeVolume: "30 GB",
  freeSpeed: "40 Mbps",
  plusVolume: "2 TB",
  plusSpeed: "200 Mbps",
  proVolume: "10 TB",
  proSpeed: "1 Gbps",
  recordVolume: "2 TB",
  recordRoute: "Mumbai → N. Virginia",
  recordTime: "4 h 27 m",
  recordSpeed: "1 Gbps",
  cipher: "AES-256 inside TLS 1.3",
  transport: "our own protocol over UDP",
  cloud: "AWS",
} as const;

export const NAV_LINKS = [
  { label: "Features", href: "/features" },
  { label: "Pricing", href: "/pricing" },
  { label: "Changelog", href: "/changelog" },
  { label: "Blog", href: "/blog" },
];

export const FOOTER_COLUMNS = [
  {
    heading: "Product",
    links: [
      { label: "Features", href: "/features" },
      { label: "Pricing", href: "/pricing" },
      { label: "Changelog", href: "/changelog" },
    ],
  },
  {
    heading: "Resources",
    links: [
      { label: "Blog", href: "/blog" },
      { label: "Protocol paper", href: "/blog/one-gbps-long-haul" },
      { label: "Contact", href: "/contact" },
    ],
  },
  {
    heading: "Company",
    links: [
      { label: "About", href: "/about" },
      { label: "zero2", href: "https://www.zero2.in" },
    ],
  },
  {
    heading: "Legal",
    links: [
      { label: "Privacy Policy", href: "/privacy" },
      { label: "Terms of Service", href: "/terms" },
      { label: "Security", href: "/privacy#security" },
    ],
  },
];

export const HOME_FEATURES = [
  {
    icon: "bolt" as const,
    title: "Paired in six digits",
    body: "Type a code on both ends. No account, no upload queue, no waiting room.",
  },
  {
    icon: "shield" as const,
    title: "AES-256 inside TLS 1.3",
    body: "Encrypted on your device, decrypted on theirs. We hold no keys and keep no copy.",
  },
  {
    icon: "devices" as const,
    title: "Desktop and mobile",
    body: "macOS, Windows, Linux, iOS, Android. Start on the laptop, land on the phone.",
  },
];

export const FEATURE_GROUPS = [
  {
    label: "CONNECT",
    heading: "Getting two devices talking",
    items: [
      {
        icon: "link" as const,
        title: "Six-digit pairing",
        body: "A code, a QR scan, or a saved peer. Nothing to install on the far end.",
      },
      {
        icon: "globe" as const,
        title: "Punches through anything",
        body: "A UDP hole-punch on every candidate path at once. 97% of networks connect direct on the first try.",
      },
      {
        icon: "users" as const,
        title: "Saved peers",
        body: "Keep a roster of your own machines. Trusted devices reconnect with no code at all.",
      },
    ],
  },
  {
    label: "TRANSFER",
    heading: "Moving the bytes",
    items: [
      {
        icon: "gauge" as const,
        title: "Up to 1 Gbps",
        body: "Pro saturates a full gigabit. Our record run held 1 Gbps from Mumbai to N. Virginia.",
      },
      {
        icon: "resume" as const,
        title: "Byte-exact resume",
        body: "Shut the lid, swap networks, lose the tunnel. It restarts on the byte, not the file.",
      },
      {
        icon: "folder" as const,
        title: "Folders and whole drives",
        body: "Nested projects or an entire external disk. Structure and timestamps survive.",
      },
    ],
  },
  {
    label: "CONTROL",
    heading: "Staying in charge of it",
    items: [
      {
        icon: "shield" as const,
        title: "Keys never leave you",
        body: "Session keys are born and die on your two devices. We could not decrypt if ordered to.",
      },
      {
        icon: "audit" as const,
        title: "History without exposure",
        body: "Your history shows where and when. File names never leave your device.",
      },
    ],
  },
];

export const METRICS = [
  { value: 1, suffix: " Gbps", label: "peak on our Mumbai → US run", decimals: 0 },
  { value: 0, suffix: " bytes", label: "of your data stored by us", decimals: 0 },
  { value: 4.45, prefix: "", suffix: " hrs", label: "to move 2 TB, Mumbai → N. Virginia", decimals: 2 },
  { value: 3, suffix: "", label: "AWS regions on the fast path", decimals: 0 },
];

export const COMPARISON = {
  columns: ["Zetarya", "Cloud storage", "Link services"],
  rows: [
    ["Maximum file size", "Unlimited", "Plan cap, typically 2 TB", "2–5 GB"],
    ["Typical throughput", "Up to 1 Gbps", "80–150 Mb/s", "20–60 Mb/s"],
    ["Copy held by the provider", "None", "Full copy", "Full copy"],
    ["Encryption", "AES-256 inside TLS 1.3", "At rest, provider holds keys", "In transit only"],
    ["Resume after a dropped link", "Byte-exact", "Restarts the chunk", "Restarts the upload"],
    ["Recipient needs an account", "No", "Usually", "No"],
    ["Retention you have to manage", "None — nothing is stored", "Quotas and lifecycle rules", "Link expiry dates"],
  ],
};

export type Tier = {
  name: string;
  price: string;
  unit: string;
  desc: string;
  cta: string;
  highlight: boolean;
  features: string[];
};

export const TIERS: Tier[] = [
  {
    name: "Free",
    price: "₹0",
    unit: "/mo",
    desc: "For testing & personal use.",
    cta: "Get free",
    highlight: false,
    features: [
      "Up to 40 Mbps transfer speed",
      "30 GB/month data transfer",
      "TLS encryption",
      "Peer to Peer data transfer",
    ],
  },
  {
    name: "Plus",
    price: "₹1,499",
    unit: "/mo",
    desc: "Best for growing workloads.",
    cta: "Get Plus",
    highlight: true,
    features: [
      "Up to 200 Mbps transfer speed",
      "2 TB/month included",
      "AES-256 + TLS encryption",
      "Priority email & chat support",
      "Peer to Peer data transfer",
    ],
  },
  {
    name: "Pro",
    price: "Custom",
    unit: "",
    desc: "For high-volume transfer.",
    cta: "Talk to Sales",
    highlight: false,
    features: [
      "Up to 1 Gbps transfer speed",
      "10 TB/month included",
      "AES-256 + TLS encryption",
      "Advanced routing & P2P acceleration",
      "On-prem data transfer under the VPN",
      "API access",
      "Dedicated onboarding",
    ],
  },
];

export const PLAN_MATRIX = {
  columns: ["Free", "Plus", "Pro"],
  rows: [
    ["Monthly data transfer", "30 GB", "2 TB", "10 TB"],
    ["Transfer speed", "Up to 40 Mbps", "Up to 200 Mbps", "Up to 1 Gbps"],
    ["Peer to peer data transfer", "yes", "yes", "yes"],
    ["TLS encryption", "yes", "yes", "yes"],
    ["AES-256 encryption", "no", "yes", "yes"],
    ["Byte-exact resume", "yes", "yes", "yes"],
    ["Advanced routing & P2P acceleration", "no", "no", "yes"],
    ["On-prem transfer under the VPN", "no", "no", "yes"],
    ["API access", "no", "no", "yes"],
    ["Transfer history", "7 days", "12 months", "Configurable"],
    ["Support", "Community", "Priority email & chat", "Priority + dedicated onboarding"],
  ],
};

export const FAQS = [
  {
    q: "Can I change plans later?",
    a: "Yes, at any time. Upgrades take effect immediately and we prorate the difference. Downgrades apply from the start of your next billing period, and nothing is lost in between.",
  },
  {
    q: "Does the receiver need a plan?",
    a: "Your plan covers the devices signed in to your account. The person you send to is a guest — guests are free, and there is no limit on them.",
  },
  {
    q: "Do you offer student or open-source discounts?",
    a: "Yes. Plus is free for registered students and for maintainers of open-source projects with a public repository. Write to admin@zetarya.com with a link.",
  },
  {
    q: "What happens when my trial ends?",
    a: "Your account moves to the Free plan. Nothing is deleted, because nothing was ever stored on our side — your paired devices simply return to 30 GB a month at up to 40 Mbps.",
  },
  {
    q: "Is it really peer to peer?",
    a: "Yes. Devices talk directly over UDP using our own protocol. When a firewall refuses a direct path we fall back to an encrypted AWS relay that carries ciphertext it cannot read.",
  },
];

export const CHANGELOG = [
  {
    version: "v2.4.0",
    date: "12 Aug 2026",
    tags: [
      { kind: "New", label: "Mumbai ⇄ US fast path" },
      { kind: "Improved", label: "Chunk scheduler" },
    ],
    title: "A dedicated Mumbai ⇄ Virginia route",
    bullets: [
      "A dedicated AWS route between Mumbai and N. Virginia. Our first 2 TB run across it landed in 4 hours 27 minutes at a sustained 1 Gbps.",
      "The scheduler keeps 64 chunks in flight by default, up from 32. On the long-haul path that lifted sustained throughput from 870 Mb/s to 1.02 Gb/s.",
      "Fixed a case where a resumed transfer re-verified chunks it had already committed.",
    ],
  },
  {
    version: "v2.3.2",
    date: "29 Jul 2026",
    tags: [{ kind: "Fixed", label: "UDP path" }],
    title: "UDP probe no longer stalls on IPv6-only networks",
    bullets: [
      "Peers on IPv6-only mobile carriers occasionally hung for 30 seconds before falling back. The probe now runs both stacks in parallel.",
      "Reduced idle battery use on iOS by 40% while a transfer is queued.",
    ],
  },
  {
    version: "v2.3.0",
    date: "15 Jul 2026",
    tags: [
      { kind: "New", label: "Saved peers" },
      { kind: "New", label: "History" },
    ],
    title: "Saved peers and transfer history",
    bullets: [
      "You can group saved peers into a roster and revoke a device without touching the others.",
      "History records where a transfer went and when. File names and contents are never written to it.",
      "Added API access on Pro.",
    ],
  },
  {
    version: "v2.2.1",
    date: "30 Jun 2026",
    tags: [
      { kind: "Improved", label: "CLI" },
      { kind: "Fixed", label: "Windows" },
    ],
    title: "CLI output you can pipe",
    bullets: [
      "zetarya send now emits newline-delimited JSON with --json, so CI jobs can parse progress without scraping the progress bar.",
      "Fixed a path-length failure when sending deeply nested folders on Windows.",
    ],
  },
  {
    version: "v2.2.0",
    date: "4 Jul 2026",
    tags: [{ kind: "New", label: "Public beta" }],
    title: "Zetarya is open to everyone",
    bullets: [
      "Desktop, mobile and CLI clients are out of the waitlist. Free stays free: 30 GB a month at up to 40 Mbps.",
    ],
  },
];

export type Post = {
  slug: string;
  category: string;
  title: string;
  excerpt: string;
  author: string;
  initials: string;
  role: string;
  bio: string;
  date: string;
  read: string;
  featured?: boolean;
  /** Body blocks. A line starting with "## " renders as a section heading. */
  body: string[];
};

export const POSTS: Post[] = [
  {
    slug: "one-gbps-long-haul",
    category: "Engineering",
    title: "How we hold 1 Gbps on a link that keeps moving",
    excerpt:
      "Congestion control tuned for two known endpoints behaves nothing like the general internet case. Here is the scheduler we ended up with, and the three ideas we threw away first.",
    author: "Rohit Kumar Singh",
    initials: "RS",
    role: "Founder",
    bio: "Founder of Zetarya. Works on the protocol, the clients, and whatever else is on fire that week.",
    date: "14 August 2026",
    read: "9 min read",
    featured: true,
    body: [
      "The first version of Zetarya used TCP, like almost everything else does. Laptop to laptop across an office, it was fine. On the Mumbai to Northern Virginia run it settled at around 640 Mb/s and stayed there no matter what we did to the machines at either end. The bottleneck was not the link, and it was not the disks. It was an assumption.",
      "TCP’s congestion control is written for a stranger’s internet. It assumes it is sharing the path with thousands of flows it cannot see, so it reads a lost packet as a warning from a crowd and backs off hard. For the general case that is exactly right. But a Zetarya transfer is two machines that have already agreed to talk to each other. They know each other’s addresses, they measure the round trip continuously, and they have a decent estimate of what the path will take. On a very long path, one dropped packet is far more often a fluke than a crowd.",
      "## Writing our own",
      "So we stopped arguing with TCP and wrote our own protocol on top of UDP. That sentence gets more nervous reactions in a design review than anything else we do, and the nervousness is earned. UDP gives you nothing. No ordering, no retransmission, no acknowledgement that anything arrived at all. Everything you took for granted is now yours to build and yours to get wrong.",
      "That is also the entire point. Because you own it, you get to decide what it does when the path turns strange, instead of inheriting a decision made in the 1980s for a network that no longer exists.",
      "What we do with that ownership is, honestly, boring. Measure the path constantly. Send at a rate the current measurements support rather than a rate a rule of thumb suggests. Treat a small amount of loss on a long path as information rather than as an emergency. That is most of the trick. It is less clever than people expect it to be, and it took roughly four times longer than we estimated to get right.",
      "## A file is not a stream",
      "The second change was to stop treating a transfer as one long stream. Files go out as fixed-size chunks, each carrying its own hash. The receiver commits them as they land, in whatever order they land, and can verify the finished file without reading the whole thing back off the disk a second time.",
      "This bought us more than throughput. Resume came almost free, and an entire family of “we were at 94% and then something moved” failures stopped existing.",
      "## Three things we threw away",
      "Compression on the wire. Most of what people send us is already compressed — camera footage, disk images, archives. On the small fraction that isn’t, the CPU cost showed up as a throughput dip on thin laptops and lost more than it ever returned.",
      "An adaptive chunk size. On a whiteboard this is obviously correct. Two weeks of measurement put the gain inside the noise, and it made every bug report harder to reproduce, because no two runs were shaped the same.",
      "A third loss-recovery mode, for the awkward case in the middle. We could never write down the situation it was for without hand-waving. If you cannot describe when a heuristic fires, it will fire when you least want it to.",
      "## Where it actually sits",
      "On our own instrumented run we hold a gigabit for 2 TB from Mumbai to Northern Virginia, which finishes in about four and a half hours. That number is the easy one to quote and the easy one to achieve.",
      "The number we actually tune for now is different: how often a transfer holds its rate for hours with nobody watching it. Peak throughput is a demo. Not dropping to a crawl at 3am on someone else’s network is a product.",
    ],
  },
  {
    slug: "why-we-never-hold-your-keys",
    category: "Security",
    title: "Why we never hold your keys",
    excerpt:
      "Session keys live and die on your two devices. A walk through the handshake, and what an attacker actually sees on the wire.",
    author: "Rohit Kumar Singh",
    initials: "RS",
    role: "Founder",
    bio: "Founder of Zetarya. Works on the protocol, the clients, and whatever else is on fire that week.",
    date: "2 August 2026",
    read: "6 min",
    body: [
      "“We never hold your keys” is the sort of sentence every product says, so it is worth spelling out what it means here — and, more usefully, what it does not mean.",
      "## What happens when you read out six digits",
      "The six digits are not a password, and they are not the encryption key. The keys for a transfer are generated fresh on your two devices, used for that session, and thrown away. Neither of them is ever sent anywhere, to us or to anyone else. The content itself is encrypted with AES-256 inside TLS 1.3, which is deliberately the least surprising choice available.",
      "The code is doing one specific job. Two machines can agree on a shared secret across an open network without an eavesdropper learning it — that part is old, settled mathematics. What that alone cannot tell you is whether you agreed with the right machine. The digits close that gap, because they are derived from the exchange the two devices just performed. If somebody sat in the middle and ran their own exchange with each side, the digits on the two screens would not match. That is the whole reason we ask you to compare them out loud rather than just tapping Accept.",
      "## What we can see",
      "Our servers help two devices find each other, and when a network refuses to allow a direct path, traffic can be relayed through us. Relayed or not, what passes through is ciphertext we hold no key for.",
      "We can see that a device with a short-lived identifier is sending to another one, roughly how much, and for how long. We cannot see file names, file contents, or folder structure. Those never leave your device in a readable form.",
      "That is not a claim about our intentions, which you have no reason to trust. It is a statement about our position. A subpoena served on us produces connection metadata and a large quantity of bytes nobody at this company can read. That is the honest scope of it, and we would rather say it plainly than imply something more magical.",
      "## What this does not protect you from",
      "Worth being direct, because the phrase “end-to-end encrypted” is doing a lot of load-bearing work in this industry. It protects the bytes in transit. It does nothing at all about the laptop at the far end.",
      "If you send a file to the wrong person, encryption will deliver it to them flawlessly. If their machine is already compromised, the file arrives on a compromised machine. If somebody is standing behind you reading the digits off your screen, none of the mathematics helps.",
      "Everything we ship uses published, well-understood cryptography with no in-house variations on it. This is one of the few areas of the product where we have no ambition to be interesting.",
    ],
  },
  {
    slug: "resume-to-the-byte",
    category: "Product",
    title: "Resume, to the byte",
    excerpt:
      "Losing a connection at 94% used to mean starting again. Here is the chunk map that made that a five-second problem.",
    author: "Rohit Kumar Singh",
    initials: "RS",
    role: "Founder",
    bio: "Founder of Zetarya. Works on the protocol, the clients, and whatever else is on fire that week.",
    date: "28 July 2026",
    read: "5 min",
    body: [
      "The bug report that started this was two lines long. “94%, train went into a tunnel, started again from zero. Please fix.”",
      "The old behaviour was defensible in the way that a lot of bad behaviour is defensible. The connection dropped, we could not prove which bytes had genuinely landed on the far disk, so we did the safe thing and sent all of them again. Safe, correct, and infuriating.",
      "## Keeping a map",
      "A transfer does not go out as one long stream. The file is cut into fixed-size chunks, each with its own hash, and the receiver keeps a small map of which chunks it has committed and verified. That map lives on the receiver’s disk, so it survives a crash, a closed lid, a network change, and someone tripping over a power cable.",
      "When the two devices reconnect, they compare maps before a single byte of content moves. Whatever the receiver already holds is skipped; whatever it is missing gets queued. On a 2 TB transfer that conversation takes a couple of seconds.",
      "## The part that was actually hard",
      "Deciding what “committed” means. A chunk sitting in the operating system’s write cache is not the same thing as a chunk on the disk, and being wrong in the optimistic direction is the worst possible failure here: you resume into a file that is quietly corrupt and verifies as fine.",
      "So the receiver only records a chunk in the map once it is genuinely durable. That costs a little throughput and buys the guarantee that the map never lies. At the end, hashes are checked against the file that exists on the disk — not against the version we hoped we had written.",
      "The other hard part was networks that change identity underneath you. Moving from Wi-Fi to mobile mid-transfer should not be a reconnection at all; the session simply carries on over a new path. Getting that to be true rather than nearly true took two rewrites.",
      "## What it feels like now",
      "Close the lid at 94%, open it in the morning, and the bar picks up roughly where it was after a short pause while both ends agree on the map. A transfer cancelled and resumed a week later behaves the same way, as long as neither the source file nor the partial file has been touched since.",
      "If either has changed, we say so and stop. Quietly stitching two different versions of a file together is a much worse outcome than an error message, and it is the kind of bug you discover six months later.",
    ],
  },
  {
    slug: "nat-traversal-real-world",
    category: "Engineering",
    title: "NAT traversal in the real world",
    excerpt:
      "We instrumented 1.4 million connection attempts across home, office and mobile networks. The failure modes were not the ones we expected.",
    author: "Rohit Kumar Singh",
    initials: "RS",
    role: "Founder",
    bio: "Founder of Zetarya. Works on the protocol, the clients, and whatever else is on fire that week.",
    date: "19 July 2026",
    read: "11 min",
    body: [
      "Getting two ordinary consumer machines to talk directly to each other is the least glamorous problem at this company and the one that generates the most support tickets. So we instrumented it properly: 1.4 million connection attempts across home broadband, office networks, campus Wi-Fi and mobile, each tagged with what it tried, what worked, and how long it took to work.",
      "## Why this is hard at all",
      "Almost nothing on the internet has an address another device can simply dial. Your laptop sits behind a router doing network address translation — a private address indoors, a shared public one outdoors. NAT was designed so that many devices could reach out to servers. It was never designed so that two of them could find each other.",
      "The standard way through is hole punching. Both devices ask a server we run how they appear from the outside, then start sending to each other at the same moment. Each side’s outgoing packet opens a temporary path through its own router, and the other side’s packet arrives just in time to look like the reply that path was expecting. It works far more often than it sounds like it should.",
      "## What the numbers said",
      "97% of attempts get a direct path, most on the first try, most in well under a second. The interesting part was the shape of the remaining 3%.",
      "We expected exotic router firmware. It is mostly three very ordinary things.",
      "Carrier-grade NAT. Your mobile provider is doing its own translation on top of your router’s, and the outside address it hands you can differ from one packet to the next. There is no stable hole to punch.",
      "Corporate networks that block outbound UDP wholesale. There is no clever trick for this one. It is a policy decision made by somebody who is not in the room.",
      "Mobile networks that move you between towers mid-transfer. The path you established is simply no longer the path, and the whole introduction has to happen again while a transfer is already running.",
      "## The relay you hope not to need",
      "When no direct path can be built, the transfer falls back to a relay and our servers pass the encrypted bytes through. We run them in three regions so the detour is usually short. It is slower than direct, sometimes considerably, and we label it in the client rather than hiding it — a user who can see the word “relayed” has a chance of moving to a different network.",
      "The relays cannot read anything they carry; keys never reach them. But a relayed transfer costs us money and costs you speed, so nearly all the effort here went into shrinking the 3% rather than making the fallback more comfortable.",
      "## The thing we got wrong for a year",
      "For a long time we tried the direct path, waited for it to fail, and then fell back. The waiting was the whole problem: a network that will never work takes exactly as long to time out as one that is merely being slow, so the worst experience was reserved for the users with the worst networks.",
      "Now the fallback is set up alongside the attempt and dropped the instant a direct path comes up. Median connect time fell by more than half, and the tickets that said “it hangs for ten seconds and then works fine” stopped arriving.",
    ],
  },
  {
    slug: "public-beta",
    category: "Company",
    title: "Zetarya is now in public beta",
    excerpt: "Desktop, mobile and CLI are open to everyone today, and the free tier is staying free.",
    author: "Rohit Kumar Singh",
    initials: "RS",
    role: "Founder",
    bio: "Founder of Zetarya. Works on the protocol, the clients, and whatever else is on fire that week.",
    date: "4 July 2026",
    read: "3 min",
    body: [
      "Zetarya is out of the waitlist. Desktop, mobile and the CLI are open to everyone from today, and you do not need an invite from anybody.",
      "We built this because the honest way to move a terabyte in 2026 was still to put it on a disk and hand the disk to a human being. Everything else asked you to upload the file into somebody’s cloud, wait, and then ask the other person to download it back out — two copies, two waits, and a stranger holding your footage in the middle.",
      "## What is open today",
      "Desktop apps for macOS, Windows and Linux, clients for iOS and Android, and a CLI for the people who would rather script it. Pairing is six digits typed at both ends. There is no upload queue, because there is no upload.",
      "## The free tier is staying free",
      "30 GB a month at up to 40 Mbps. No expiry on transfers, no ads, no inviting three friends to unlock anything. We have all watched enough products use a free tier as a countdown timer, and we would rather not run that play. If we ever have to change it, we will say so in advance and in plain language, not in a changelog line.",
      "Paid plans exist for people who need real volume and real speed, and they are what funds the relays and the people who maintain them.",
      "## What is not finished",
      "A beta label should mean something, so: Windows has more rough edges than macOS. Very large folder trees take longer to enumerate than they should. Team features are early and will change. Backgrounding is handled well on Android and merely acceptably on iOS.",
      "All of that is written down publicly, and we would much rather you read it here than discover it in the middle of a deadline. Tell us what breaks.",
    ],
  },
  {
    slug: "post-production-pipeline",
    category: "Guides",
    title: "Moving a post-production pipeline",
    excerpt: "How Northwind Studios replaced overnight drive couriers with a six-digit code.",
    author: "Rohit Kumar Singh",
    initials: "RS",
    role: "Founder",
    bio: "Founder of Zetarya. Works on the protocol, the clients, and whatever else is on fire that week.",
    date: "21 June 2026",
    read: "8 min",
    body: [
      "Northwind Studios finishes around forty commercial spots a year. Their colourist works in Lisbon, their edit suite is in London, and until last year the reliable way to get a day’s rushes between the two was a courier with a hard drive on an evening flight.",
      "This is not really a story about a feature. It is a story about what a working day looks like once a nine-hour dependency is removed from the middle of it.",
      "## What the old day looked like",
      "The shoot wraps around 7pm. An assistant copies the day’s cards to two drives — one for the shelf, one for the courier. The courier collects at 9pm, the drive flies overnight, and Lisbon has the material by about 10am. Which means notes come back the following afternoon: two days of latency wrapped around a creative decision that takes twenty minutes to make.",
      "The cloud version they had tried before was worse in an interesting way. The upload out of London ran overnight anyway, and then Lisbon still had to pull it all down before anyone could look at anything. They had turned one nine-hour wait into two five-hour ones, and paid for storage in between.",
      "## What they do now",
      "The assistant starts the transfer from the machine that already holds the rushes, reads six digits down the phone to Lisbon, and goes home. The bytes travel from the London box to the Lisbon box. Nothing is uploaded anywhere first, which is why the wait is about the size of the file and the link, rather than the size of the file twice over.",
      "A 900 GB day lands in a little under three hours on their connection. It starts when the copy finishes rather than when somebody is free to supervise it, and both machines are allowed to lose the connection overnight, because it picks up where it stopped.",
      "## The parts that do not make it into case studies",
      "Their edit suite’s firewall blocked outbound UDP, so the first week ran over a relay and was, on a good night, slower than the courier had been. That turned out to be a twenty-minute conversation with their IT contractor and one firewall rule.",
      "They also had to change a habit. The old workflow quietly encouraged sending a curated selection, because sending everything was expensive. Now they send everything, which is better creatively and considerably worse for anyone who had grown fond of the excuse.",
      "## Would this have worked five years ago",
      "Honestly, no. It works because both ends now have a genuinely fast connection and machines that can keep up with it. The technology arriving is not the interesting part. The interesting part is how many years the courier habit outlived the reason for it.",
    ],
  },
  {
    slug: "audit-log-should-not-contain",
    category: "Security",
    title: "What an audit log should not contain",
    excerpt: "Admins need accountability. They do not need your file names. How we drew that line.",
    author: "Rohit Kumar Singh",
    initials: "RS",
    role: "Founder",
    bio: "Founder of Zetarya. Works on the protocol, the clients, and whatever else is on fire that week.",
    date: "9 June 2026",
    read: "7 min",
    body: [
      "Every organisation that buys software for a team eventually asks for an audit log, and they are right to. Somebody has to be able to answer “who moved what, and when” after an incident. We spent an uncomfortable number of meetings on what the second word in that sentence is allowed to mean.",
      "## The easy version, and why we did not ship it",
      "The obvious audit log records file names. It is trivial to build, since the client already knows the name, and it is what every admin is picturing when they ask.",
      "But the file name is frequently the most sensitive part of the entire transfer. Redundancies_Final_March.xlsx. patient_1993_scan.dcm. AcquisitionTarget_DD.zip. A log full of names is a searchable index of everything an organisation is currently thinking about — and it would live on our servers, which is precisely where the file contents deliberately never go. We would have built the exact thing our architecture exists to avoid, and then parked it somewhere easier to reach than any of the files it describes.",
      "## What the log actually holds",
      "Who sent, who received, when, how much, from which device, over what kind of path, and whether it completed. That answers the questions that genuinely get asked during an incident: did data leave, to whom, how much of it, and when. It answers them without our servers ever learning the name of anything.",
      "## Where names do live",
      "On your own devices. The sender’s client keeps a full local history with names in it, and so does the receiver’s. If an admin needs a name, it comes from an endpoint that legitimately held the file, and asking for it leaves its own trace.",
      "Making that path slightly inconvenient is deliberate. Retrieval that requires one person to ask another person is retrieval that gets thought about first.",
      "## The objection we get most",
      "“Our compliance framework requires filename-level logging.” Occasionally that is true, and in those cases we are the wrong tool and will say so. More often, reading the actual clause alongside the customer turns up a requirement for evidence of what data left the organisation, with no mention of names anywhere. The assumption of names had come from every other product they had used.",
      "The rule we apply now: if a piece of data would be valuable to an attacker and merely convenient for you, it does not go in the log. Convenience loses that argument every time, and it should.",
    ],
  },
];

export const VALUES = [
  {
    icon: "minimize" as const,
    title: "Nothing in the middle",
    body: "If a feature needs us to hold your data, it does not ship. That constraint has killed good ideas and we do not regret it.",
  },
  {
    icon: "gauge" as const,
    title: "Speed is a feature",
    body: "A regression in megabits per second blocks a release the same way a failing test does.",
  },
  {
    icon: "shield" as const,
    title: "Boring on purpose",
    body: "Well-understood cryptography, published audits, and a preference for predictable over clever.",
  },
];
