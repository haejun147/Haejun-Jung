import React, { useState, useEffect, useRef, useCallback, DragEvent } from 'react';
import Markdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import rehypeHighlight from 'rehype-highlight';
import {
  Lock, ArrowRight, ShieldCheck, Plus, Trash2, Save, LogOut,
  Eye, Edit3, Upload, X, FileText, Image as ImageIcon, Tag,
  Calendar, AlignLeft, ToggleLeft, ToggleRight, RefreshCw, ChevronRight,
} from 'lucide-react';

// ── Types ────────────────────────────────────────────────────────────────────

interface BlogFile {
  name: string;
  path: string;
  sha: string;
  download_url: string;
}

interface PostFields {
  title: string;
  date: string;
  description: string;
  tags: string; // raw comma-separated
  published: boolean;
  image: string;
  content: string;
}

const API_URL = '/api/blog';
const TOKEN_KEY = 'blog_admin_token';

function today(): string {
  return new Date().toISOString().split('T')[0];
}

function apiFetch(action: string, extra: Record<string, unknown> = {}, token?: string) {
  const headers: Record<string, string> = { 'Content-Type': 'application/json' };
  if (token) headers['Authorization'] = `Bearer ${token}`;
  return fetch(API_URL, {
    method: 'POST',
    headers,
    body: JSON.stringify({ action, ...extra }),
  }).then((r) => r.json());
}

// ── Frontmatter parser ───────────────────────────────────────────────────────

function parsePost(raw: string): PostFields {
  const match = raw.match(/^---\n([\s\S]*?)\n---\n?([\s\S]*)$/);
  if (!match) return { title: '', date: today(), description: '', tags: '', published: false, image: '', content: raw };

  const fm = match[1];
  const content = match[2].trim();

  function fmGet(key: string): string {
    const m = fm.match(new RegExp(`^${key}:\\s*"?([^"\\n]*)"?`, 'm'));
    return m ? m[1].trim() : '';
  }

  return {
    title: fmGet('title'),
    date: fmGet('date') || today(),
    description: fmGet('description'),
    tags: fmGet('tags').replace(/^\[|\]$/g, ''),
    published: fmGet('published') === 'true',
    image: fmGet('image'),
    content,
  };
}

// ── Login ────────────────────────────────────────────────────────────────────

function LoginForm({ onLogin }: { onLogin: (token: string) => void }) {
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const data = await apiFetch('login', { password });
      if (data.token) {
        localStorage.setItem(TOKEN_KEY, data.token);
        onLogin(data.token);
      } else {
        setError(data.error || 'Invalid password');
      }
    } catch {
      setError('Connection error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4">
      <div className="w-full max-w-md welcome-fade">
        <div className="bg-zinc-900/50 backdrop-blur-xl border border-white/10 p-10 rounded-2xl shadow-2xl relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-emerald-500 to-transparent opacity-50" />

          <div className="flex flex-col items-center mb-8">
            <div className="w-16 h-16 bg-emerald-500/10 rounded-full flex items-center justify-center mb-4 border border-emerald-500/20">
              <Lock className="text-emerald-500" size={28} />
            </div>
            <h2 className="text-2xl font-display font-bold text-white mb-2">Blog Admin</h2>
            <p className="text-zinc-500 text-[10px] uppercase tracking-widest font-bold text-center">Admin credentials required</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter Passcode"
                className={`w-full bg-black border ${error ? 'border-red-500/50' : 'border-white/10'} rounded-lg p-4 text-center text-sm outline-none focus:border-emerald-500 transition-all tracking-[0.3em] font-medium text-white placeholder:tracking-normal placeholder:font-normal`}
                autoFocus
              />
              {error && (
                <p className="text-red-500 text-[10px] mt-4 text-center uppercase font-bold tracking-widest animate-pulse">{error}</p>
              )}
            </div>
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-white text-black font-bold py-4 rounded-lg flex items-center justify-center group hover:bg-emerald-500 hover:text-white transition-all text-xs uppercase tracking-[0.2em] disabled:opacity-50"
            >
              {loading ? 'Verifying...' : 'Verify Identity'}
              <ArrowRight size={16} className="ml-2 group-hover:translate-x-1 transition-transform" />
            </button>
          </form>

          <div className="mt-8 pt-6 border-t border-white/5 flex items-center justify-center text-zinc-600">
            <ShieldCheck size={14} className="mr-2" />
            <span className="text-[10px] uppercase font-bold tracking-widest">Blog Administrative Gateway</span>
          </div>
        </div>
      </div>
    </div>
  );
}

// ── Tag pills editor ──────────────────────────────────────────────────────────

function TagEditor({ value, onChange }: { value: string; onChange: (v: string) => void }) {
  const [input, setInput] = useState('');
  const tags = value.split(',').map((t) => t.trim()).filter(Boolean);

  const addTag = () => {
    const trimmed = input.trim();
    if (!trimmed) return;
    const next = [...new Set([...tags, trimmed])].join(', ');
    onChange(next);
    setInput('');
  };

  const removeTag = (tag: string) => {
    onChange(tags.filter((t) => t !== tag).join(', '));
  };

  return (
    <div className="space-y-2">
      <div className="flex flex-wrap gap-2 min-h-[32px]">
        {tags.map((tag) => (
          <span key={tag} className="flex items-center gap-1 text-[11px] px-2.5 py-1 bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 rounded-full font-medium">
            {tag}
            <button type="button" onClick={() => removeTag(tag)} className="hover:text-red-400 transition-colors">
              <X size={10} />
            </button>
          </span>
        ))}
      </div>
      <div className="flex gap-2">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ',') { e.preventDefault(); addTag(); } }}
          placeholder="Add tag, press Enter"
          className="flex-1 bg-black/50 border border-white/10 rounded-lg px-3 py-2 text-sm text-white outline-none focus:border-emerald-500 transition-all"
        />
        <button type="button" onClick={addTag} className="px-3 py-2 bg-emerald-500/10 text-emerald-500 border border-emerald-500/20 rounded-lg text-xs hover:bg-emerald-500 hover:text-white transition-all">
          <Plus size={14} />
        </button>
      </div>
    </div>
  );
}

// ── Image upload zone ─────────────────────────────────────────────────────────

function ImageUploader({
  value,
  onChange,
  token,
}: {
  value: string;
  onChange: (path: string) => void;
  token: string;
}) {
  const [dragging, setDragging] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);

  const uploadFile = useCallback(async (file: File) => {
    if (!file.type.startsWith('image/')) { setError('Not an image file'); return; }
    setUploading(true);
    setError('');
    const reader = new FileReader();
    reader.onloadend = async () => {
      try {
        const base64 = reader.result as string;
        const data = await apiFetch('upload-image', { filename: file.name, base64, mimeType: file.type }, token);
        if (data.path) onChange(data.path);
        else setError(data.error || 'Upload failed');
      } catch {
        setError('Upload error');
      } finally {
        setUploading(false);
      }
    };
    reader.readAsDataURL(file);
  }, [token, onChange]);

  const handleDrop = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setDragging(false);
    const file = e.dataTransfer.files[0];
    if (file) uploadFile(file);
  };

  return (
    <div className="space-y-2">
      <div
        onDragOver={(e) => { e.preventDefault(); setDragging(true); }}
        onDragLeave={() => setDragging(false)}
        onDrop={handleDrop}
        onClick={() => inputRef.current?.click()}
        className={`relative cursor-pointer rounded-xl border-2 border-dashed transition-all flex items-center justify-center ${dragging ? 'border-emerald-500 bg-emerald-500/10' : 'border-white/10 hover:border-emerald-500/40 bg-black/30'} ${value ? 'h-40' : 'h-28'}`}
      >
        {value ? (
          <img src={value} alt="cover" className="w-full h-full object-cover rounded-xl opacity-70" />
        ) : (
          <div className="flex flex-col items-center gap-2 text-zinc-500">
            <ImageIcon size={24} />
            <span className="text-xs">{uploading ? 'Uploading...' : 'Drop image or click to upload'}</span>
          </div>
        )}
        {uploading && (
          <div className="absolute inset-0 flex items-center justify-center bg-black/60 rounded-xl">
            <RefreshCw size={20} className="text-emerald-500 animate-spin" />
          </div>
        )}
        <input ref={inputRef} type="file" accept="image/*" className="hidden" onChange={(e) => { const f = e.target.files?.[0]; if (f) uploadFile(f); }} />
      </div>
      {value && (
        <div className="flex items-center gap-2">
          <input
            type="text"
            value={value}
            onChange={(e) => onChange(e.target.value)}
            className="flex-1 bg-black/50 border border-white/10 rounded-lg px-3 py-2 text-xs text-zinc-400 font-mono outline-none focus:border-emerald-500"
            placeholder="/path-to-image.png"
          />
          <button type="button" onClick={() => onChange('')} className="p-2 text-zinc-500 hover:text-red-400 transition-colors">
            <X size={14} />
          </button>
        </div>
      )}
      {!value && (
        <input
          type="text"
          onChange={(e) => onChange(e.target.value)}
          className="w-full bg-black/50 border border-white/10 rounded-lg px-3 py-2 text-xs text-zinc-400 font-mono outline-none focus:border-emerald-500"
          placeholder="Or paste image path: /images/cover.png"
        />
      )}
      {error && <p className="text-red-400 text-xs">{error}</p>}
    </div>
  );
}

// ── Main editor ───────────────────────────────────────────────────────────────

const EMPTY_POST: PostFields = {
  title: '',
  date: today(),
  description: '',
  tags: '',
  published: false,
  image: '',
  content: '',
};

export default function BlogAdmin() {
  const [token, setToken] = useState<string>(() => localStorage.getItem(TOKEN_KEY) || '');
  const [posts, setPosts] = useState<BlogFile[]>([]);
  const [selectedFile, setSelectedFile] = useState<BlogFile | null>(null);
  const [fields, setFields] = useState<PostFields>(EMPTY_POST);
  const [isNew, setIsNew] = useState(false);
  const [previewMode, setPreviewMode] = useState(false);
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [loadingPost, setLoadingPost] = useState(false);
  const [status, setStatus] = useState<{ type: 'success' | 'error'; msg: string } | null>(null);

  const setField = <K extends keyof PostFields>(k: K, v: PostFields[K]) =>
    setFields((prev) => ({ ...prev, [k]: v }));

  // Load post list
  const loadList = useCallback(async (t: string) => {
    const data = await apiFetch('list', {}, t);
    if (data.files) {
      const sorted = [...data.files].sort((a: BlogFile, b: BlogFile) => a.name.localeCompare(b.name));
      setPosts(sorted);
    }
  }, []);

  useEffect(() => {
    if (token) loadList(token);
  }, [token, loadList]);

  const handleLogin = (t: string) => setToken(t);

  const handleLogout = () => {
    localStorage.removeItem(TOKEN_KEY);
    setToken('');
    setPosts([]);
    setSelectedFile(null);
    setFields(EMPTY_POST);
  };

  const handleSelectPost = async (file: BlogFile) => {
    setLoadingPost(true);
    setPreviewMode(false);
    setIsNew(false);
    try {
      const data = await apiFetch('get', { path: file.path }, token);
      if (data.content) {
        setFields(parsePost(data.content));
        setSelectedFile({ ...file, sha: data.sha });
      }
    } finally {
      setLoadingPost(false);
    }
  };

  const handleNewPost = () => {
    setSelectedFile(null);
    setFields({ ...EMPTY_POST, date: today() });
    setIsNew(true);
    setPreviewMode(false);
  };

  const showStatus = (type: 'success' | 'error', msg: string) => {
    setStatus({ type, msg });
    setTimeout(() => setStatus(null), 4000);
  };

  const handleSave = async (publishOverride?: boolean) => {
    if (!fields.title.trim()) { showStatus('error', 'Title is required'); return; }
    setSaving(true);
    try {
      const tagsFormatted = `[${fields.tags.split(',').map((t) => t.trim()).filter(Boolean).join(', ')}]`;
      const publishedVal = publishOverride !== undefined ? String(publishOverride) : String(fields.published);

      if (isNew) {
        const data = await apiFetch('create', {
          title: fields.title,
          date: fields.date,
          description: fields.description,
          tags: tagsFormatted,
          published: publishedVal,
          image: fields.image,
          content: fields.content,
        }, token);

        if (data.error) { showStatus('error', data.error); return; }
        showStatus('success', `Created: ${data.path}`);
        setIsNew(false);
        await loadList(token);
      } else if (selectedFile) {
        const data = await apiFetch('update', {
          path: selectedFile.path,
          sha: selectedFile.sha,
          title: fields.title,
          date: fields.date,
          description: fields.description,
          tags: tagsFormatted,
          published: publishedVal,
          image: fields.image,
          content: fields.content,
        }, token);

        if (data.error) { showStatus('error', data.error); return; }
        showStatus('success', 'Saved successfully');
        await loadList(token);
      }
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!selectedFile) return;
    if (!confirm(`Delete "${selectedFile.name}"? This cannot be undone.`)) return;
    setDeleting(true);
    try {
      const data = await apiFetch('delete', { path: selectedFile.path, sha: selectedFile.sha }, token);
      if (data.error) { showStatus('error', data.error); return; }
      showStatus('success', 'Post deleted');
      setSelectedFile(null);
      setFields(EMPTY_POST);
      setIsNew(false);
      await loadList(token);
    } finally {
      setDeleting(false);
    }
  };

  if (!token) return <LoginForm onLogin={handleLogin} />;

  const hasPost = isNew || selectedFile !== null;

  return (
    <div className="min-h-screen bg-zinc-950 text-white">
      {/* Top bar */}
      <div className="sticky top-0 z-30 bg-zinc-900/80 backdrop-blur border-b border-white/10 px-6 py-3 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <FileText size={18} className="text-emerald-500" />
          <span className="font-display font-bold text-sm uppercase tracking-widest">Blog Admin</span>
          {hasPost && (
            <>
              <ChevronRight size={14} className="text-zinc-600" />
              <span className="text-xs text-zinc-400 truncate max-w-[200px]">{fields.title || 'Untitled'}</span>
            </>
          )}
        </div>

        <div className="flex items-center gap-3">
          {status && (
            <span className={`text-xs font-bold px-3 py-1 rounded-full ${status.type === 'success' ? 'bg-emerald-500/10 text-emerald-400' : 'bg-red-500/10 text-red-400'}`}>
              {status.msg}
            </span>
          )}

          {hasPost && (
            <>
              <button
                onClick={() => setPreviewMode((p) => !p)}
                className="flex items-center gap-1.5 px-3 py-1.5 border border-white/10 rounded-lg text-xs text-zinc-400 hover:text-white hover:border-white/30 transition-all"
              >
                {previewMode ? <Edit3 size={13} /> : <Eye size={13} />}
                {previewMode ? 'Edit' : 'Preview'}
              </button>

              <button
                onClick={() => handleSave(false)}
                disabled={saving}
                className="flex items-center gap-1.5 px-4 py-1.5 border border-white/10 rounded-lg text-xs text-zinc-400 hover:text-white hover:border-white/30 transition-all disabled:opacity-40"
              >
                <Save size={13} />
                Save Draft
              </button>

              <button
                onClick={() => handleSave(true)}
                disabled={saving}
                className="flex items-center gap-1.5 px-4 py-1.5 bg-emerald-600 text-white rounded-lg text-xs font-bold uppercase tracking-wider hover:bg-emerald-500 transition-all disabled:opacity-40 shadow-[0_0_15px_rgba(16,185,129,0.3)]"
              >
                <Upload size={13} />
                Publish
              </button>

              {selectedFile && (
                <button
                  onClick={handleDelete}
                  disabled={deleting}
                  className="flex items-center gap-1.5 px-3 py-1.5 border border-red-500/20 rounded-lg text-xs text-red-500 hover:bg-red-500/10 transition-all disabled:opacity-40"
                >
                  <Trash2 size={13} />
                </button>
              )}
            </>
          )}

          <button onClick={handleLogout} className="flex items-center gap-1.5 px-3 py-1.5 text-zinc-500 hover:text-white transition-all text-xs">
            <LogOut size={13} />
            Logout
          </button>
        </div>
      </div>

      <div className="flex h-[calc(100vh-53px)]">
        {/* Sidebar */}
        <div className="w-64 flex-shrink-0 border-r border-white/10 flex flex-col bg-zinc-900/30">
          <div className="p-4 border-b border-white/10">
            <button
              onClick={handleNewPost}
              className="w-full flex items-center justify-center gap-2 py-2.5 bg-emerald-600/10 text-emerald-400 border border-emerald-500/20 rounded-lg text-xs font-bold uppercase tracking-widest hover:bg-emerald-600 hover:text-white transition-all"
            >
              <Plus size={14} />
              New Post
            </button>
          </div>

          <div className="flex-1 overflow-y-auto">
            {posts.length === 0 ? (
              <p className="text-zinc-600 text-xs text-center py-8 px-4">No posts yet</p>
            ) : (
              posts.map((file) => {
                const name = file.name.replace(/\.md$/, '');
                const isActive = selectedFile?.path === file.path;
                return (
                  <button
                    key={file.path}
                    onClick={() => handleSelectPost(file)}
                    className={`w-full text-left px-4 py-3 border-b border-white/5 transition-all text-xs ${isActive ? 'bg-emerald-500/10 text-emerald-400 border-l-2 border-l-emerald-500' : 'text-zinc-400 hover:bg-white/5 hover:text-white'}`}
                  >
                    <span className="block truncate font-medium">{name}</span>
                  </button>
                );
              })
            )}
          </div>
        </div>

        {/* Main content */}
        <div className="flex-1 overflow-y-auto">
          {!hasPost ? (
            <div className="flex items-center justify-center h-full text-zinc-600">
              <div className="text-center">
                <FileText size={40} className="mx-auto mb-4 opacity-30" />
                <p className="text-sm">Select a post or create a new one</p>
              </div>
            </div>
          ) : loadingPost ? (
            <div className="flex items-center justify-center h-full text-zinc-600">
              <RefreshCw size={24} className="animate-spin" />
            </div>
          ) : (
            <div className="max-w-4xl mx-auto px-8 py-8 space-y-6">
              {/* Title */}
              <input
                type="text"
                value={fields.title}
                onChange={(e) => setField('title', e.target.value)}
                placeholder="Post title..."
                className="w-full bg-transparent text-3xl font-display font-bold text-white placeholder:text-zinc-700 outline-none border-b border-white/10 pb-4 focus:border-emerald-500 transition-all"
              />

              {/* Meta row */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-[10px] font-bold text-zinc-500 uppercase tracking-widest mb-2 flex items-center gap-1.5">
                    <Calendar size={11} /> Date
                  </label>
                  <input
                    type="date"
                    value={fields.date}
                    onChange={(e) => setField('date', e.target.value)}
                    className="w-full bg-black/50 border border-white/10 rounded-lg px-3 py-2 text-sm text-white outline-none focus:border-emerald-500 transition-all"
                  />
                </div>

                <div>
                  <label className="block text-[10px] font-bold text-zinc-500 uppercase tracking-widest mb-2 flex items-center gap-1.5">
                    <AlignLeft size={11} /> Description
                  </label>
                  <input
                    type="text"
                    value={fields.description}
                    onChange={(e) => setField('description', e.target.value)}
                    placeholder="Short description..."
                    className="w-full bg-black/50 border border-white/10 rounded-lg px-3 py-2 text-sm text-white outline-none focus:border-emerald-500 transition-all"
                  />
                </div>
              </div>

              {/* Tags */}
              <div>
                <label className="block text-[10px] font-bold text-zinc-500 uppercase tracking-widest mb-2 flex items-center gap-1.5">
                  <Tag size={11} /> Tags
                </label>
                <TagEditor value={fields.tags} onChange={(v) => setField('tags', v)} />
              </div>

              {/* Cover image */}
              <div>
                <label className="block text-[10px] font-bold text-zinc-500 uppercase tracking-widest mb-2 flex items-center gap-1.5">
                  <ImageIcon size={11} /> Cover Image
                </label>
                <ImageUploader value={fields.image} onChange={(v) => setField('image', v)} token={token} />
              </div>

              {/* Published toggle */}
              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={() => setField('published', !fields.published)}
                  className="flex items-center gap-2 text-sm transition-all"
                >
                  {fields.published ? (
                    <ToggleRight size={24} className="text-emerald-500" />
                  ) : (
                    <ToggleLeft size={24} className="text-zinc-600" />
                  )}
                  <span className={`text-xs font-bold uppercase tracking-widest ${fields.published ? 'text-emerald-400' : 'text-zinc-500'}`}>
                    {fields.published ? 'Published' : 'Draft'}
                  </span>
                </button>
              </div>

              {/* Content area */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest flex items-center gap-1.5">
                    <Edit3 size={11} /> Content
                  </label>
                  <button
                    type="button"
                    onClick={() => setPreviewMode((p) => !p)}
                    className="flex items-center gap-1.5 text-[10px] text-zinc-500 hover:text-white uppercase tracking-widest transition-all"
                  >
                    {previewMode ? <Edit3 size={11} /> : <Eye size={11} />}
                    {previewMode ? 'Edit' : 'Preview'}
                  </button>
                </div>

                {previewMode ? (
                  <div className="min-h-[500px] bg-black/20 border border-white/10 rounded-xl p-8">
                    <article className="prose prose-lg prose-slate dark:prose-invert prose-headings:font-display prose-a:text-teal-400 prose-a:no-underline hover:prose-a:underline prose-code:before:content-none prose-code:after:content-none prose-blockquote:border-l-4 prose-blockquote:border-teal-500 prose-blockquote:bg-teal-950/20 prose-blockquote:rounded-r-lg prose-blockquote:py-1 prose-blockquote:px-5 prose-blockquote:not-italic prose-hr:hidden prose-h2:text-[1.65rem] prose-h2:font-bold prose-h2:mt-16 prose-h2:mb-8 prose-h2:text-gray-50 prose-h2:tracking-tight prose-h3:text-xl prose-h3:font-bold prose-h3:mt-12 prose-h3:mb-5 prose-p:text-[19px] prose-p:leading-[2.1] prose-p:mb-8 prose-p:text-gray-300 prose-strong:text-gray-100 prose-strong:font-bold max-w-none">
                      <Markdown remarkPlugins={[remarkGfm]} rehypePlugins={[rehypeHighlight]}>
                        {fields.content || '*Start writing to see a preview...*'}
                      </Markdown>
                    </article>
                  </div>
                ) : (
                  <textarea
                    value={fields.content}
                    onChange={(e) => setField('content', e.target.value)}
                    placeholder="Write your post in Markdown..."
                    className="w-full bg-black/30 border border-white/10 rounded-xl px-6 py-5 text-sm text-zinc-200 font-mono leading-relaxed outline-none focus:border-emerald-500 transition-all resize-y"
                    style={{ minHeight: '500px' }}
                    spellCheck={false}
                  />
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
