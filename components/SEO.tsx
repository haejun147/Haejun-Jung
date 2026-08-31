import { useEffect } from 'react';

interface SEOProps {
  title?: string;
  description?: string;
  type?: string;
  url?: string;
  publishedTime?: string;
  tags?: string[];
}

const SITE_NAME = 'Haejun Jung';
const BASE_URL = 'https://www.haejunjung.com';
const DEFAULT_DESC = 'Personal website of Haejun Jung, Ph.D. Candidate at KAIST.';

function setMeta(property: string, content: string) {
  let el = document.querySelector(`meta[property="${property}"]`) || document.querySelector(`meta[name="${property}"]`);
  if (!el) {
    el = document.createElement('meta');
    if (property.startsWith('og:') || property.startsWith('article:')) {
      el.setAttribute('property', property);
    } else {
      el.setAttribute('name', property);
    }
    document.head.appendChild(el);
  }
  el.setAttribute('content', content);
}

export default function SEO({ title, description, type = 'website', url, publishedTime, tags }: SEOProps) {
  useEffect(() => {
    const fullTitle = title ? `${title} — ${SITE_NAME}` : SITE_NAME;
    const desc = description || DEFAULT_DESC;
    const pageUrl = url ? `${BASE_URL}${url}` : BASE_URL;

    document.title = fullTitle;

    setMeta('description', desc);
    setMeta('og:title', fullTitle);
    setMeta('og:description', desc);
    setMeta('og:type', type);
    setMeta('og:url', pageUrl);
    setMeta('og:site_name', SITE_NAME);
    setMeta('twitter:card', 'summary');
    setMeta('twitter:title', fullTitle);
    setMeta('twitter:description', desc);

    if (type === 'article' && publishedTime) {
      setMeta('article:published_time', publishedTime);
    }
    if (tags) {
      tags.forEach((tag) => setMeta('article:tag', tag));
    }

    return () => {
      document.title = SITE_NAME;
    };
  }, [title, description, type, url, publishedTime, tags]);

  return null;
}
