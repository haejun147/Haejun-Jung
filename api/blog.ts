import type { VercelRequest, VercelResponse } from '@vercel/node';
import crypto from 'crypto';

const GITHUB_API = 'https://api.github.com';

function makeToken(password: string): string {
  return crypto.createHash('sha256').update(password + 'blog-admin-salt').digest('hex');
}

function verifyAuth(req: VercelRequest): boolean {
  const auth = req.headers['authorization'];
  if (!auth || !auth.startsWith('Bearer ')) return false;
  const token = auth.slice(7);
  const expected = makeToken(process.env.ADMIN_PASSWORD || '');
  return token === expected;
}

async function githubRequest(
  path: string,
  method: string = 'GET',
  body?: object
): Promise<{ ok: boolean; status: number; data: unknown }> {
  const token = process.env.GITHUB_TOKEN;
  const repo = process.env.GITHUB_REPO;
  const url = `${GITHUB_API}/repos/${repo}${path}`;

  const res = await fetch(url, {
    method,
    headers: {
      Authorization: `Bearer ${token}`,
      Accept: 'application/vnd.github+json',
      'Content-Type': 'application/json',
      'X-GitHub-Api-Version': '2022-11-28',
    },
    ...(body ? { body: JSON.stringify(body) } : {}),
  });

  let data: unknown;
  try {
    data = await res.json();
  } catch {
    data = null;
  }

  return { ok: res.ok, status: res.status, data };
}

function slugify(title: string): string {
  return title
    .trim()
    .replace(/\s+/g, '-')
    .replace(/[^\w\u3131-\uD79D-]/g, '')
    .toLowerCase();
}

function buildFrontmatter(fields: {
  title: string;
  date: string;
  description: string;
  tags: string;
  published: string;
  image?: string;
}): string {
  const lines = [
    '---',
    `title: "${fields.title.replace(/"/g, '\\"')}"`,
    `date: "${fields.date}"`,
    `description: "${fields.description.replace(/"/g, '\\"')}"`,
    `tags: "${fields.tags}"`,
    `published: "${fields.published}"`,
  ];
  if (fields.image) lines.push(`image: "${fields.image}"`);
  lines.push('---');
  return lines.join('\n');
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  const body = req.body as Record<string, unknown>;
  const action = body?.action as string;

  if (!action) return res.status(400).json({ error: 'Missing action' });

  // ── Login ───────────────────────────────────────────────────────────────────
  if (action === 'login') {
    const password = body.password as string;
    if (!password) return res.status(400).json({ error: 'Missing password' });

    const adminPassword = process.env.ADMIN_PASSWORD;
    if (!adminPassword) return res.status(500).json({ error: 'ADMIN_PASSWORD not configured' });

    if (password !== adminPassword) return res.status(401).json({ error: 'Invalid password' });

    return res.status(200).json({ token: makeToken(password) });
  }

  // All other actions require auth
  if (!verifyAuth(req)) return res.status(401).json({ error: 'Unauthorized' });

  const branch = process.env.GITHUB_BRANCH || 'main';

  // ── List ────────────────────────────────────────────────────────────────────
  if (action === 'list') {
    const result = await githubRequest('/contents/content/blog');
    if (!result.ok) return res.status(result.status).json({ error: 'Failed to list files', detail: result.data });

    const files = (result.data as Array<{ name: string; path: string; sha: string; download_url: string }>)
      .filter((f) => f.name.endsWith('.md'))
      .map((f) => ({ name: f.name, path: f.path, sha: f.sha, download_url: f.download_url }));

    return res.status(200).json({ files });
  }

  // ── Get ─────────────────────────────────────────────────────────────────────
  if (action === 'get') {
    const path = body.path as string;
    if (!path) return res.status(400).json({ error: 'Missing path' });

    const result = await githubRequest(`/contents/${path}`);
    if (!result.ok) return res.status(result.status).json({ error: 'Failed to get file', detail: result.data });

    const file = result.data as { content: string; sha: string; name: string; path: string };
    const content = Buffer.from(file.content.replace(/\n/g, ''), 'base64').toString('utf-8');

    return res.status(200).json({ content, sha: file.sha, name: file.name, path: file.path });
  }

  // ── Create ──────────────────────────────────────────────────────────────────
  if (action === 'create') {
    const { title, date, description, tags, published, image, content } = body as Record<string, string>;
    if (!title || !content) return res.status(400).json({ error: 'Missing title or content' });

    const slug = slugify(title);
    const filePath = `content/blog/${slug}.md`;
    const frontmatter = buildFrontmatter({ title, date: date || new Date().toISOString().split('T')[0], description: description || '', tags: tags || '', published: published || 'false', image });
    const fullContent = `${frontmatter}\n${content}`;
    const encoded = Buffer.from(fullContent, 'utf-8').toString('base64');

    const result = await githubRequest(`/contents/${filePath}`, 'PUT', {
      message: `Add blog post: ${title}`,
      content: encoded,
      branch,
    });

    if (!result.ok) return res.status(result.status).json({ error: 'Failed to create file', detail: result.data });

    return res.status(200).json({ slug, path: filePath });
  }

  // ── Update ──────────────────────────────────────────────────────────────────
  if (action === 'update') {
    const { path, sha, title, date, description, tags, published, image, content } = body as Record<string, string>;
    if (!path || !sha || !content) return res.status(400).json({ error: 'Missing path, sha, or content' });

    const frontmatter = buildFrontmatter({ title: title || '', date: date || '', description: description || '', tags: tags || '', published: published || 'false', image });
    const fullContent = `${frontmatter}\n${content}`;
    const encoded = Buffer.from(fullContent, 'utf-8').toString('base64');

    const result = await githubRequest(`/contents/${path}`, 'PUT', {
      message: `Update blog post: ${title || path}`,
      content: encoded,
      sha,
      branch,
    });

    if (!result.ok) return res.status(result.status).json({ error: 'Failed to update file', detail: result.data });

    return res.status(200).json({ path });
  }

  // ── Delete ──────────────────────────────────────────────────────────────────
  if (action === 'delete') {
    const { path, sha } = body as Record<string, string>;
    if (!path || !sha) return res.status(400).json({ error: 'Missing path or sha' });

    const fileName = path.split('/').pop() || path;
    const result = await githubRequest(`/contents/${path}`, 'DELETE', {
      message: `Delete blog post: ${fileName}`,
      sha,
      branch,
    });

    if (!result.ok) return res.status(result.status).json({ error: 'Failed to delete file', detail: result.data });

    return res.status(200).json({ deleted: path });
  }

  // ── Upload Image ─────────────────────────────────────────────────────────────
  if (action === 'upload-image') {
    const { filename, base64, mimeType } = body as Record<string, string>;
    if (!filename || !base64) return res.status(400).json({ error: 'Missing filename or base64' });

    const safeName = filename.replace(/[^a-zA-Z0-9._-]/g, '_');
    const filePath = `public/blog-images/${safeName}`;

    // Check if file exists (to get sha for update)
    let existingSha: string | undefined;
    const checkResult = await githubRequest(`/contents/${filePath}`);
    if (checkResult.ok) {
      existingSha = (checkResult.data as { sha: string }).sha;
    }

    // Strip data URL prefix if present
    const rawBase64 = base64.replace(/^data:[^;]+;base64,/, '');

    const putBody: Record<string, string> = {
      message: `Upload image: ${safeName}`,
      content: rawBase64,
      branch,
    };
    if (existingSha) putBody.sha = existingSha;

    const result = await githubRequest(`/contents/${filePath}`, 'PUT', putBody);
    if (!result.ok) return res.status(result.status).json({ error: 'Failed to upload image', detail: result.data });

    const publicPath = `/blog-images/${safeName}`;
    return res.status(200).json({ path: publicPath, filePath });
  }

  return res.status(400).json({ error: `Unknown action: ${action}` });
}
