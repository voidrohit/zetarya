import fs from "fs"; import path from "path";
const root = ".next/server/app";
const files = [];
// _not-found is noindex by design; it needs no markup.
(function walk(d){for(const e of fs.readdirSync(d,{withFileTypes:true})){const p=path.join(d,e.name);
 if(e.isDirectory())walk(p); else if(e.name.endsWith(".html") && !e.name.startsWith("_not-found"))files.push(p);}})(root);
let fail = 0;
for (const f of files.sort()) {
  const html = fs.readFileSync(f,"utf8");
  const blocks = [...html.matchAll(/<script type="application\/ld\+json">(.*?)<\/script>/gs)].map(m=>m[1]);
  if (!blocks.length) { console.log(`✗ ${f}  NO JSON-LD`); fail++; continue; }
  if (blocks.length > 1) { console.log(`! ${f}  ${blocks.length} blocks (should be 1)`); }
  let g;
  try { g = JSON.parse(blocks[0].replace(/\\u003c/g,"<")); }
  catch(e){ console.log(`✗ ${f}  INVALID JSON: ${e.message}`); fail++; continue; }
  const nodes = g["@graph"] ?? [g];
  const ids = new Set();
  (function defs(o){ if(Array.isArray(o))return o.forEach(defs);
    if(o&&typeof o==="object"){ const k=Object.keys(o);
      if(o["@id"] && k.length>1) ids.add(o["@id"]);
      Object.values(o).forEach(defs);}})(nodes);
  const refs = [];
  (function scan(o){ if(Array.isArray(o))return o.forEach(scan);
    if(o&&typeof o==="object"){ const k=Object.keys(o);
      if(k.length===1&&k[0]==="@id")refs.push(o["@id"]); else Object.values(o).forEach(scan);}})(nodes);
  const dangling = [...new Set(refs)].filter(r=>!ids.has(r));
  const types = nodes.map(n=>n["@type"]).join(", ");
  console.log(`${dangling.length?"✗":"✓"} ${f.replace(root,"")||"/"}\n    ${types}` +
    (dangling.length?`\n    DANGLING: ${dangling.join(", ")}`:""));
  if(dangling.length) fail++;
}
console.log(fail? `\n${fail} FAILURES` : `\nAll ${files.length} pages OK`);
process.exit(fail ? 1 : 0);
