import { useEffect } from 'react';
import { useLocation } from 'wouter';

type PageMetaProps = {
  title: string;
  description: string;
  image?: string;
  schema?: Record<string, unknown>;
};

function upsertMeta(key: string, value: string, property = 'name') {
  let element = document.head.querySelector<HTMLMetaElement>(`meta[${property}="${key}"]`);
  if (!element) {
    element = document.createElement('meta');
    element.setAttribute(property, key);
    document.head.appendChild(element);
  }
  element.content = value;
}

export function PageMeta({ title, description, image = '/images/vanam/spices/turmeric.jpg', schema }: PageMetaProps) {
  const [location] = useLocation();

  useEffect(() => {
    const path = window.location.pathname.replace(/\/+$/, '') || '/';
    const canonical = new URL(path, window.location.origin).href;
    const imageUrl = /^https?:\/\//.test(image) ? image : new URL(image, window.location.origin).href;

    document.title = title;
    upsertMeta('description', description);
    upsertMeta('og:title', title, 'property');
    upsertMeta('og:description', description, 'property');
    upsertMeta('og:type', 'website', 'property');
    upsertMeta('og:url', canonical, 'property');
    upsertMeta('og:image', imageUrl, 'property');
    upsertMeta('twitter:card', 'summary_large_image');
    upsertMeta('twitter:title', title);
    upsertMeta('twitter:description', description);
    upsertMeta('twitter:image', imageUrl);

    let canonicalLink = document.head.querySelector<HTMLLinkElement>('link[rel="canonical"]');
    if (!canonicalLink) {
      canonicalLink = document.createElement('link');
      canonicalLink.rel = 'canonical';
      document.head.appendChild(canonicalLink);
    }
    canonicalLink.href = canonical;

    const structuredData = schema ?? {
      '@context': 'https://schema.org',
      '@type': 'WebPage',
      name: title,
      description,
      url: canonical,
      isPartOf: { '@type': 'WebSite', name: 'VANAM', url: window.location.origin },
    };
    let script = document.getElementById('vanam-jsonld') as HTMLScriptElement | null;
    if (!script) {
      script = document.createElement('script');
      script.id = 'vanam-jsonld';
      script.type = 'application/ld+json';
      document.head.appendChild(script);
    }
    script.textContent = JSON.stringify(structuredData);
  }, [description, image, location, schema, title]);

  return null;
}
