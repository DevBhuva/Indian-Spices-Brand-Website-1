import { useEffect, useRef, useState, type FormEvent } from 'react';
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import { ArrowRight, ChevronDown, Menu, X } from 'lucide-react';
import { Link, useLocation } from 'wouter';
import { navigation, spiceGroups } from '../data/navigation';
import { spices } from '../data/spices';

const CONTACT_EMAIL = 'replace-with-your-company-email@example.com';

function openEmailDraft(subject: string, body: string) {
  window.location.href = `mailto:${CONTACT_EMAIL}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
}

export function Preloader() {
  const [visible, setVisible] = useState(false);
  const reduceMotion = useReducedMotion();

  useEffect(() => {
    try {
      if (sessionStorage.getItem('vanam-seen') === '1') return;
      sessionStorage.setItem('vanam-seen', '1');
    } catch {
      // Storage can be unavailable in strict privacy modes; this only affects the intro animation.
    }
    setVisible(true);
    const timer = window.setTimeout(() => setVisible(false), reduceMotion ? 120 : 1450);
    return () => window.clearTimeout(timer);
  }, [reduceMotion]);

  return (
    <AnimatePresence>
      {visible && (
        <motion.div className="v-preloader" initial={{ opacity: 1 }} exit={{ opacity: 0, transition: { duration: 0.42 } }} aria-hidden="true">
          <motion.div className="v-preloader-inner" initial={{ y: 14, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ duration: 0.55 }}>
            <span className="v-preloader-wordmark">VANAM</span>
            <span className="v-preloader-rule" />
            <span className="v-preloader-tagline">A heritage of Indian flavour</span>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

export function CustomCursor() {
  const node = useRef<HTMLDivElement>(null);
  const labelRef = useRef<HTMLSpanElement>(null);
  const reduceMotion = useReducedMotion();

  useEffect(() => {
    if (reduceMotion || !window.matchMedia('(pointer: fine)').matches) return;
    let frame = 0;
    let x = -100;
    let y = -100;
    const move = (event: PointerEvent) => {
      x = event.clientX;
      y = event.clientY;
      if (frame) return;
      frame = requestAnimationFrame(() => {
        if (node.current) node.current.style.transform = `translate3d(${x}px, ${y}px, 0)`;
        frame = 0;
      });
    };
    const over = (event: PointerEvent) => {
      const target = event.target instanceof Element ? event.target.closest<HTMLElement>('[data-cursor]') : null;
      const kind = target?.dataset.cursor ?? '';
      node.current?.classList.toggle('is-active', Boolean(kind));
      node.current?.classList.toggle('is-button', kind === 'button');
      if (labelRef.current) labelRef.current.textContent = kind === 'image' ? 'VIEW' : kind === 'discover' ? 'DISCOVER' : '';
    };
    window.addEventListener('pointermove', move, { passive: true });
    document.addEventListener('pointerover', over);
    return () => {
      window.removeEventListener('pointermove', move);
      document.removeEventListener('pointerover', over);
      if (frame) cancelAnimationFrame(frame);
    };
  }, [reduceMotion]);

  return <div ref={node} className="v-cursor" aria-hidden="true"><span ref={labelRef} /></div>;
}

export function ScrollProgress() {
  const [path] = useLocation();
  const [progress, setProgress] = useState(0);
  useEffect(() => {
    const update = () => {
      const available = document.documentElement.scrollHeight - window.innerHeight;
      setProgress(available > 0 ? Math.min(1, Math.max(0, window.scrollY / available)) : 0);
    };
    update();
    window.addEventListener('scroll', update, { passive: true });
    window.addEventListener('resize', update);
    return () => {
      window.removeEventListener('scroll', update);
      window.removeEventListener('resize', update);
    };
  }, [path]);
  const chapter = Math.min(8, Math.max(1, Math.floor(progress * 8) + 1)).toString().padStart(2, '0');
  return (
    <div className="v-progress" aria-label={`Story progress: ${chapter} of 08`}>
      <div className="v-progress-fill" style={{ transform: `scaleX(${progress})` }} />
      {path === '/' && <span className="v-progress-count">{chapter}<i />08</span>}
    </div>
  );
}

export function SiteHeader() {
  const [path] = useLocation();
  const [solid, setSolid] = useState(path !== '/');
  const [menuOpen, setMenuOpen] = useState(false);
  const [selectedSlug, setSelectedSlug] = useState('turmeric');
  const selected = spices.find((spice) => spice.slug === selectedSlug) ?? spices[0];

  useEffect(() => {
    const update = () => setSolid(path !== '/' || window.scrollY > 36);
    update();
    window.addEventListener('scroll', update, { passive: true });
    return () => window.removeEventListener('scroll', update);
  }, [path]);

  useEffect(() => {
    setMenuOpen(false);
    const hash = window.location.hash;
    if (hash) {
      window.setTimeout(() => document.querySelector(hash)?.scrollIntoView({ behavior: 'smooth' }), 80);
    }
  }, [path]);

  useEffect(() => {
    const onKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setMenuOpen(false);
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, []);

  const openMenu = () => {
    setMenuOpen((current) => !current);
  };

  return (
    <header className={`v-header ${solid ? 'is-solid' : ''}`}>
      <Link href="/" className="v-brand" aria-label="VANAM home" data-cursor="button">
        <span>VANAM</span><small>A HERITAGE OF INDIAN FLAVOUR</small>
      </Link>
      <nav className="v-desktop-nav" aria-label="Main navigation">
        {navigation.map((item) => item.label === 'Spices' ? (
          <button key={item.href} className={`v-nav-button ${menuOpen ? 'is-active' : ''}`} type="button" onClick={openMenu} aria-expanded={menuOpen} aria-controls="vanam-mega-menu">
            Spices <ChevronDown size={12} aria-hidden="true" />
          </button>
        ) : (
          <Link key={item.href} href={item.href} data-cursor="button">{item.label}</Link>
        ))}
      </nav>
      <Link className="v-distributor-link" href="/distributors" data-cursor="button">Become a distributor <ArrowRight size={14} aria-hidden="true" /></Link>
      <button className="v-menu-toggle" onClick={() => setMenuOpen((current) => !current)} aria-label={menuOpen ? 'Close navigation' : 'Open navigation'} aria-expanded={menuOpen} type="button">
        {menuOpen ? <X size={21} /> : <Menu size={21} />}
      </button>
      <AnimatePresence>
        {menuOpen && (
          <motion.div id="vanam-mega-menu" className="v-mega-menu" initial={{ opacity: 0, y: -12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }} transition={{ duration: 0.35 }}>
            <div className="v-mega-groups">
              <Link href="/spices" className="v-mega-all" onClick={() => setMenuOpen(false)}>The collection <ArrowRight size={14} /></Link>
              {spiceGroups.map((group) => (
                <div key={group.title} className="v-mega-group">
                  <span>{group.title}</span>
                  {group.slugs.map((slug) => {
                    const spice = spices.find((item) => item.slug === slug);
                    return spice ? <Link key={slug} href={`/spices/${slug}`} onMouseEnter={() => setSelectedSlug(slug)} onFocus={() => setSelectedSlug(slug)} onClick={() => setMenuOpen(false)}>{spice.name}</Link> : null;
                  })}
                </div>
              ))}
            </div>
            <div className="v-mega-feature">
              <img src={selected.image} alt={selected.imageAlt} width="460" height="300" />
              <div><span>{selected.title}</span><b>{selected.name}</b><Link href={`/spices/${selected.slug}`} onClick={() => setMenuOpen(false)}>Discover <ArrowRight size={13} /></Link></div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
      <AnimatePresence>
        {menuOpen && (
          <motion.nav className="v-mobile-menu" aria-label="Mobile navigation" initial={{ opacity: 0, x: '100%' }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: '100%' }} transition={{ duration: 0.35 }}>
            {navigation.map((item) => <Link key={item.href} href={item.href} onClick={() => setMenuOpen(false)}>{item.label}</Link>)}
            <div className="v-mobile-spices"><span>THE COLLECTION</span>{spices.map((item) => <Link key={item.slug} href={`/spices/${item.slug}`} onClick={() => setMenuOpen(false)}>{item.name}</Link>)}</div>
            <Link className="v-mobile-distributor" href="/distributors" onClick={() => setMenuOpen(false)}>Become a distributor <ArrowRight size={14} /></Link>
          </motion.nav>
        )}
      </AnimatePresence>
    </header>
  );
}

export function SiteFooter() {
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState('');
  const onSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!email.includes('@')) {
      setStatus('Enter a valid email address to prepare a request.');
      return;
    }
    openEmailDraft('VANAM newsletter request', `Please add this address to VANAM updates: ${email}`);
    setStatus('An email draft will open. The mailing list is not connected yet.');
  };

  return (
    <footer className="v-footer">
      <div className="v-footer-top">
        <div className="v-footer-callout">
          <span className="v-footer-kicker">VANAM · A HERITAGE OF INDIAN FLAVOUR</span>
          <h2>BRING INDIA<br /><em>TO THE TABLE.</em></h2>
          <Link href="/spices" className="v-footer-cta">Explore VANAM <ArrowRight size={15} /></Link>
        </div>
        <div className="v-footer-links">
          <div><span>Explore</span>{navigation.map((item) => <Link key={item.href} href={item.href}>{item.label}</Link>)}</div>
          <div><span>Discover</span><Link href="/farm-sourcing">Farm & sourcing</Link><Link href="/gallery">Gallery</Link><Link href="/distributors">For distributors</Link><Link href="/contact">Contact</Link></div>
          <div className="v-social-note"><span>Follow VANAM</span><p>Official social links will appear here when the brand handles are confirmed.</p></div>
        </div>
      </div>
      <div className="v-newsletter">
        <div><span className="v-kicker">NOTES FROM THE SPICE HOUSE</span><h3>A little flavour in your inbox.</h3><p>Newsletter delivery is not connected yet. This form prepares an email draft; it does not store or send your address.</p></div>
        <form onSubmit={onSubmit}>
          <label className="sr-only" htmlFor="vanam-newsletter-email">Email address</label>
          <input id="vanam-newsletter-email" type="email" required placeholder="Your email address" value={email} onChange={(event) => setEmail(event.target.value)} />
          <button type="submit">Request updates <ArrowRight size={14} /></button>
          {status && <span className="v-form-status" role="status">{status}</span>}
        </form>
      </div>
      <div className="v-footer-bottom"><span>© {new Date().getFullYear()} VANAM</span><span>India, in every flavour.</span><Link href="/contact">Contact the house</Link></div>
    </footer>
  );
}

export function MobileExplore() {
  const [path] = useLocation();
  if (path === '/spices' || path.startsWith('/spices/')) return null;
  return <Link className="v-mobile-explore" href="/spices">Explore spices <ArrowRight size={16} /></Link>;
}

export function ScrollToTop() {
  const [path] = useLocation();
  useEffect(() => {
    if (window.location.hash) return;
    window.scrollTo({ top: 0, behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth' });
  }, [path]);
  return null;
}
