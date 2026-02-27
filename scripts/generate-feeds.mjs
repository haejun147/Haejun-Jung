import { readdirSync, readFileSync, writeFileSync, existsSync } from 'fs';
import { join, resolve } from 'path';

const SITE_URL = 'https://www.haejunjung.com';
const SITE_TITLE = 'Haejun Jung';
const SITE_DESC = 'Ph.D. Candidate at KAIST — research on entrepreneurship, technology innovation, and AI.';

const root = resolve(import.meta.dirname, '..');
const blogDir = join(root, 'content', 'blog');
const distDir = join(root, 'dist');

function parseFrontmatter(raw) {
  const match = raw.match(/^---\r?\n([\s\S]*?)\r?\n---/);
  if (!match) return {};
  const meta = {};
  for (const line of match[1].split('\n')) {
    const idx = line.indexOf(':');
    if (idx === -1) continue;
    meta[line.slice(0, idx).trim()] = line.slice(idx + 1).trim().replace(/^['"]|['"]$/g, '');
  }
  return meta;
}

function getPosts() {
  if (!existsSync(blogDir)) return [];
  return readdirSync(blogDir)
    .filter((f) => f.endsWith('.md'))
    .map((f) => {
      const raw = readFileSync(join(blogDir, f), 'utf-8');
      const meta = parseFrontmatter(raw);
      if (meta.published === 'false') return null;
      return { slug: f.replace(/\.md$/, ''), ...meta };
    })
    .filter(Boolean)
    .sort((a, b) => (b.date > a.date ? 1 : -1));
}

function generateSitemap(posts) {
  const staticPages = ['/', '/research', '/blog', '/cv'];
  const now = new Date().toISOString();

  const urls = staticPages
    .map(
      (p) => `  <url>
    <loc>${SITE_URL}${p}</loc>
    <lastmod>${now}</lastmod>
  </url>`
    )
    .concat(
      posts.map(
        (p) => `  <url>
    <loc>${SITE_URL}/blog/${p.slug}</loc>
    <lastmod>${p.date || now}</lastmod>
  </url>`
      )
    );

  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls.join('\n')}
</urlset>`;
}

function escapeXml(s) {
  return String(s || '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

function generateRss(posts) {
  const items = posts
    .map(
      (p) => `    <item>
      <title>${escapeXml(p.title)}</title>
      <link>${SITE_URL}/blog/${p.slug}</link>
      <guid>${SITE_URL}/blog/${p.slug}</guid>
      <pubDate>${new Date(p.date).toUTCString()}</pubDate>
      <description>${escapeXml(p.description)}</description>
    </item>`
    )
    .join('\n');

  return `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>${SITE_TITLE}</title>
    <link>${SITE_URL}</link>
    <description>${SITE_DESC}</description>
    <atom:link href="${SITE_URL}/rss.xml" rel="self" type="application/rss+xml"/>
${items}
  </channel>
</rss>`;
}

const posts = getPosts();
writeFileSync(join(distDir, 'sitemap.xml'), generateSitemap(posts));
writeFileSync(join(distDir, 'rss.xml'), generateRss(posts));
console.log(`Generated sitemap.xml and rss.xml (${posts.length} posts)`);
