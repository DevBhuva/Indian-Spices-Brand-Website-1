import type { ReactNode } from 'react';
import { ArrowRight } from 'lucide-react';
import { Link } from 'wouter';

export function SectionLabel({ number, children }: { number: string; children: ReactNode }) {
  return (
    <div className="v-section-label">
      <span>{number}</span>
      <i aria-hidden="true" />
      <span>{children}</span>
    </div>
  );
}

export function TextLink({ href, children, className = '' }: { href: string; children: ReactNode; className?: string }) {
  return (
    <Link className={`v-text-link ${className}`} href={href} data-cursor="button">
      {children}<ArrowRight size={15} aria-hidden="true" />
    </Link>
  );
}

export function PageIntro({ number, label, title, description, image }: {
  number: string;
  label: string;
  title: ReactNode;
  description: string;
  image?: string;
}) {
  return (
    <section className={`v-page-intro ${image ? 'has-image' : ''}`} style={image ? { backgroundImage: `linear-gradient(90deg, rgba(23,19,17,.88), rgba(23,19,17,.38)), url("${image}")` } : undefined}>
      <div className="v-wrap">
        <SectionLabel number={number}>{label}</SectionLabel>
        <h1>{title}</h1>
        <p>{description}</p>
      </div>
    </section>
  );
}

export function PageEndCta({ title = 'Bring India to the table.', href = '/spices', label = 'Explore VANAM' }: {
  title?: string;
  href?: string;
  label?: string;
}) {
  return (
    <section className="v-page-cta">
      <div className="v-cta-ornament" aria-hidden="true" />
      <SectionLabel number="08">The next chapter</SectionLabel>
      <h2>{title}</h2>
      <TextLink href={href}>{label}</TextLink>
    </section>
  );
}
