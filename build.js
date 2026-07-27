// Build script: converts the legal markdown docs into static, self-contained
// HTML pages for GitHub Pages. No client-side JS, no external assets.
const fs = require('fs');
const path = require('path');
const { marked } = require('marked');

marked.setOptions({ gfm: true, breaks: false });

const CSS = `
:root { --teal:#2F7B7B; --gold:#D9A74A; --ink:#243230; --muted:#5b6b68; --line:#e5e2da; --bg:#fffaf0; }
* { box-sizing: border-box; }
body { margin:0; background:var(--bg); color:var(--ink);
  font-family:-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,Helvetica,Arial,sans-serif;
  line-height:1.65; font-size:17px; }
.wrap { max-width:820px; margin:0 auto; padding:0 20px 64px; }
header.site { border-bottom:1px solid var(--line); background:#fff; }
header.site .wrap { padding-top:16px; padding-bottom:16px; display:flex; align-items:center; gap:12px; flex-wrap:wrap; }
header.site .brand { font-weight:700; color:var(--teal); font-size:20px; text-decoration:none; }
nav.top { margin-left:auto; display:flex; gap:16px; flex-wrap:wrap; }
nav.top a { color:var(--muted); text-decoration:none; font-size:15px; }
nav.top a:hover, nav.top a.active { color:var(--teal); }
main { padding-top:8px; }
h1 { color:var(--teal); font-size:28px; line-height:1.25; margin:28px 0 8px; }
h2 { color:var(--teal); font-size:21px; margin:32px 0 8px; padding-top:6px; }
h3 { font-size:18px; margin:22px 0 6px; }
a { color:var(--teal); }
hr { border:none; border-top:1px solid var(--line); margin:28px 0; }
ul { padding-left:22px; }
li { margin:4px 0; }
table { border-collapse:collapse; width:100%; margin:16px 0; font-size:15px; display:block; overflow-x:auto; }
th, td { border:1px solid var(--line); padding:8px 10px; text-align:left; vertical-align:top; }
th { background:#f3efe6; }
strong { color:var(--ink); }
footer.site { border-top:1px solid var(--line); margin-top:40px; color:var(--muted); font-size:14px; }
footer.site .wrap { padding-top:20px; padding-bottom:40px; }
`;

const NAV = [
  { href: 'index.html', label: 'Home' },
  { href: 'privacy-policy.html', label: 'Privacy' },
  { href: 'terms-of-service.html', label: 'Terms' },
  { href: 'eula.html', label: 'EULA' },
  { href: 'delete-account.html', label: 'Delete account' },
];

function nav(active) {
  return NAV.map(n =>
    `<a href="${n.href}"${n.href === active ? ' class="active"' : ''}>${n.label}</a>`
  ).join('');
}

function page(title, bodyHtml, active) {
  return `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<meta name="robots" content="index,follow">
<title>${title} — WonderVoice</title>
<style>${CSS}</style>
</head>
<body>
<header class="site"><div class="wrap"><a class="brand" href="index.html">WonderVoice</a><nav class="top">${nav(active)}</nav></div></header>
<div class="wrap"><main>${bodyHtml}</main></div>
<footer class="site"><div class="wrap">© 2026 GARGIULO LUIGI — VAT 11111041213 — galusolutions@gmail.com</div></footer>
</body>
</html>
`;
}

const PAGES = [
  { src: 'index.md',                       out: 'index.html',             title: 'Legal & Privacy' },
  { src: '../docs/legal/privacy-policy.md',   out: 'privacy-policy.html',    title: 'Privacy Policy' },
  { src: '../docs/legal/terms-of-service.md', out: 'terms-of-service.html',  title: 'Terms of Service' },
  { src: '../docs/legal/eula.md',             out: 'eula.html',              title: 'EULA' },
  { src: 'delete-account.md',              out: 'delete-account.html',    title: 'Account & Data Deletion' },
];

for (const p of PAGES) {
  const md = fs.readFileSync(path.join(__dirname, p.src), 'utf8');
  const body = marked.parse(md);
  fs.writeFileSync(path.join(__dirname, p.out), page(p.title, body, p.out));
  console.log('built', p.out);
}
