import { useEffect, useRef, useState, type CSSProperties, type MouseEvent as ReactMouseEvent } from 'react';
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import { ArrowDown, ArrowLeft, ArrowRight, ArrowUpRight } from 'lucide-react';
import { Link } from 'wouter';
import { spices } from '../data/spices';
import { origins } from '../data/origins';
import { recipes } from '../data/recipes';
import { journal } from '../data/journal';
import { PageMeta } from './seo';
import { PageEndCta, SectionLabel, TextLink } from './ui';

const heroSlides = ['turmeric', 'red-chilli', 'black-pepper', 'cardamom']
  .map((slug) => spices.find((item) => item.slug === slug))
  .filter((item): item is (typeof spices)[number] => Boolean(item));

export function Hero() {
  const [active, setActive] = useState(0);
  const hero = useRef<HTMLElement>(null);
  const reduceMotion = useReducedMotion();

  useEffect(() => {
    if (reduceMotion) return;
    const timer = window.setInterval(() => setActive((current) => (current + 1) % heroSlides.length), 6400);
    return () => window.clearInterval(timer);
  }, [reduceMotion]);

  const moveParallax = (event: ReactMouseEvent<HTMLElement>) => {
    if (reduceMotion || !hero.current || !window.matchMedia('(pointer: fine)').matches) return;
    const rect = event.currentTarget.getBoundingClientRect();
    const x = ((event.clientX - rect.left) / rect.width - 0.5) * 2;
    const y = ((event.clientY - rect.top) / rect.height - 0.5) * 2;
    hero.current.style.setProperty('--hero-x', `${x * -9}px`);
    hero.current.style.setProperty('--hero-y', `${y * -6}px`);
  };

  return (
    <section className="v-hero" ref={hero} onMouseMove={moveParallax} onMouseLeave={() => hero.current?.style.setProperty('--hero-x', '0px')}>
      <div className="v-hero-media" aria-hidden="true">
        <AnimatePresence mode="wait">
          <motion.img
            key={heroSlides[active].slug}
            src={heroSlides[active].image}
            alt=""
            width="1800"
            height="1200"
            fetchPriority="high"
            initial={reduceMotion ? { opacity: 1 } : { opacity: 0, scale: 1.08 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 1.025 }}
            transition={{ duration: reduceMotion ? 0.15 : 1.2, ease: [0.2, 0.7, 0.2, 1] }}
            style={{ objectPosition: 'center 50%', transform: 'translate3d(var(--hero-x, 0px), var(--hero-y, 0px), 0)' }}
          />
        </AnimatePresence>
      </div>
      <div className="v-hero-shade" aria-hidden="true" />
      <div className="v-particles" aria-hidden="true">
        {Array.from({ length: 7 }, (_, index) => <i key={index} style={{ '--particle-index': index } as CSSProperties} />)}
      </div>
      <div className="v-hero-content">
        <motion.div className="v-hero-est" initial={reduceMotion ? false : { opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.65 }}>
          {'EST. INDIA'.split('').map((char, index) => <span key={`${char}-${index}`} style={{ transitionDelay: `${index * 32}ms` }}>{char === ' ' ? '\u00a0' : char}</span>)}
        </motion.div>
        <h1>
          <span className="v-title-mask"><motion.span initial={reduceMotion ? false : { y: '110%' }} animate={{ y: 0 }} transition={{ duration: 0.85, delay: 0.22, ease: [0.2, 0.7, 0.2, 1] }}>THE ESSENCE</motion.span></span>
          <span className="v-title-mask"><motion.span className="v-title-second" initial={reduceMotion ? false : { y: '115%' }} animate={{ y: 0 }} transition={{ duration: 0.9, delay: 0.38, ease: [0.2, 0.7, 0.2, 1] }}>OF INDIA.</motion.span></span>
        </h1>
        <p>VANAM — a heritage of Indian flavour. A considered collection shaped by spice, place and the rituals of the table.</p>
        <div className="v-actions">
          <Link className="v-button v-button-gold" href="/spices" data-cursor="button">Explore the collection <ArrowRight size={15} /></Link>
          <Link className="v-button v-button-outline" href="/our-story" data-cursor="button">Discover VANAM <ArrowUpRight size={14} /></Link>
        </div>
      </div>
      <div className="v-hero-foot">
        <span>01 — THE HOUSE</span>
        <a href="#vanam-statement"><span className="v-scroll-line" /> Scroll to discover <ArrowDown size={13} /></a>
        <span className="v-hero-counter">{String(active + 1).padStart(2, '0')} <i /> {String(heroSlides.length).padStart(2, '0')}</span>
      </div>
    </section>
  );
}

function BrandStatement() {
  return (
    <section className="v-statement" id="vanam-statement">
      <SectionLabel number="01">The house</SectionLabel>
      <motion.div className="v-statement-copy" initial={{ opacity: 0.55 }} whileInView={{ opacity: 1 }} viewport={{ once: true, amount: 0.55 }} transition={{ duration: 0.8 }}>
        <h2><span>MORE THAN A SPICE.</span><em>A STORY OF INDIA.</em></h2>
        <p>From a seed in the earth to a story told around the table, India’s flavours carry place, memory and possibility.</p>
      </motion.div>
      <div className="v-statement-mark" aria-hidden="true">VANAM</div>
    </section>
  );
}

export function SpiceShowcase({ compact = false }: { compact?: boolean }) {
  const [active, setActive] = useState(0);
  const startX = useRef<number | null>(null);
  const lastWheel = useRef(0);
  const reduceMotion = useReducedMotion();
  const item = spices[active];
  const goTo = (index: number) => setActive((index + spices.length) % spices.length);

  return (
    <section className={`v-collection ${compact ? 'is-compact' : ''}`} aria-label="Explore the VANAM spice collection">
      <div className="v-collection-head">
        <div><SectionLabel number="02">The collection</SectionLabel><h2>Flavour with <em>an origin.</em></h2></div>
        <p>Fifteen spices and blends. Each with a character of its own.</p>
      </div>
      <div
        className="v-collection-stage"
        onWheel={(event) => {
          if (Math.abs(event.deltaY) < 20 && Math.abs(event.deltaX) < 20) return;
          event.preventDefault();
          if (Date.now() - lastWheel.current < 580) return;
          lastWheel.current = Date.now();
          goTo(active + (event.deltaY + event.deltaX > 0 ? 1 : -1));
        }}
        onPointerDown={(event) => { startX.current = event.clientX; }}
        onPointerUp={(event) => {
          if (startX.current === null) return;
          const delta = event.clientX - startX.current;
          startX.current = null;
          if (Math.abs(delta) > 58) goTo(active + (delta < 0 ? 1 : -1));
        }}
        onPointerCancel={() => { startX.current = null; }}
      >
        <AnimatePresence mode="wait" initial={false}>
          <motion.article key={item.slug} className="v-collection-panel" initial={reduceMotion ? false : { opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -12 }} transition={{ duration: reduceMotion ? 0.12 : 0.48 }}>
            <Link className="v-collection-image" href={`/spices/${item.slug}`} data-cursor="discover" aria-label={`Discover ${item.name}`}>
              <motion.img layoutId={`spice-${item.slug}`} src={item.image} alt={item.imageAlt} width="900" height="1050" loading={active === 0 ? 'eager' : 'lazy'} />
              <span className="v-image-index">{String(active + 1).padStart(2, '0')} <i /> {String(spices.length).padStart(2, '0')}</span>
            </Link>
            <div className="v-collection-copy">
              <span className="v-kicker">{item.category}</span>
              <span className="v-collection-overline">{item.title}</span>
              <h3>{item.name}</h3>
              <p>{item.description}</p>
              <div className="v-flavour-tags">{item.character.split(' · ').map((tag) => <span key={tag}>{tag}</span>)}</div>
              <div className="v-collection-controls">
                <button type="button" onClick={() => goTo(active - 1)} aria-label="Previous spice"><ArrowLeft size={18} /></button>
                <div className="v-collection-progress" aria-hidden="true"><i style={{ transform: `scaleX(${(active + 1) / spices.length})` }} /></div>
                <button type="button" onClick={() => goTo(active + 1)} aria-label="Next spice"><ArrowRight size={18} /></button>
              </div>
              <TextLink href={`/spices/${item.slug}`}>Discover {item.name}</TextLink>
            </div>
          </motion.article>
        </AnimatePresence>
      </div>
      <div className="v-collection-index" role="group" aria-label="Choose a spice">
        {spices.map((spice, index) => (
          <button key={spice.slug} type="button" aria-label={`Show ${spice.name}`} aria-current={active === index ? 'true' : undefined} className={active === index ? 'is-active' : ''} onClick={() => goTo(index)}>
            <span>{String(index + 1).padStart(2, '0')}</span>
          </button>
        ))}
      </div>
      <Link className="v-view-all" href="/spices">View all fifteen spices <ArrowRight size={15} /></Link>
    </section>
  );
}

function OriginInvitation() {
  return (
    <section className="v-origins-invite">
      <div className="v-origins-text">
        <SectionLabel number="03">The origins</SectionLabel>
        <h2>A country of<br /><em>many flavours.</em></h2>
        <p>Each spice carries the character of a growing landscape. Begin with a region, then follow its relationship with the spice.</p>
        <TextLink href="/origins">Discover the origins</TextLink>
      </div>
      <div className="v-origin-rail">
        {origins.slice(0, 4).map((origin, index) => {
          const spice = spices.find((item) => item.name.toLowerCase().replaceAll(' ', '-') === origin.spices[0].toLowerCase().replaceAll(' ', '-')) ?? spices.find((item) => item.origin.includes(origin.name)) ?? spices[index];
          return (
            <Link key={origin.slug} href={`/origins/${origin.slug}`} className={`v-origin-pick v-origin-pick-${index + 1}`} data-cursor="image">
              <img src={spice?.image} alt="" loading="lazy" width="520" height="690" />
              <span>{String(index + 1).padStart(2, '0')} — {origin.name}</span>
              <i>{origin.spices.slice(0, 2).join(' · ')}</i>
            </Link>
          );
        })}
      </div>
    </section>
  );
}

const journey = [
  { title: 'The land', text: 'India’s growing regions are diverse. Climate, soil and local practice help shape the character of the spices raised there.', image: '/images/farm-harvest.png' },
  { title: 'The harvest', text: 'Harvest and season influence each ingredient. The story begins with what the land can grow, not a claim about any one supplier.', image: spices[4].image },
  { title: 'The selection', text: 'A thoughtful selection starts with the ingredient’s own colour, form and aroma.', image: spices[0].image },
  { title: 'The craft', text: 'Cleaning, handling and processing are choices that deserve care and clear documentation.', image: spices[2].image },
  { title: 'The pack', text: 'A considered package protects the spice and keeps its identity easy to recognise.', image: spices[12].image },
  { title: 'Your kitchen', text: 'The journey finds its purpose when a fragrance lifts from the pan and a meal is ready to share.', image: spices[7].image },
];

function FarmJourney() {
  const [active, setActive] = useState(0);
  const steps = useRef<Array<HTMLElement | null>>([]);
  useEffect(() => {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) setActive(Number((entry.target as HTMLElement).dataset.journeyIndex));
      });
    }, { rootMargin: '-37% 0px -45% 0px', threshold: 0 });
    steps.current.forEach((step) => step && observer.observe(step));
    return () => observer.disconnect();
  }, []);
  const current = journey[active];

  return (
    <section className="v-journey" id="farm-to-table">
      <div className="v-journey-sticky">
        <div className="v-journey-image">
          <AnimatePresence mode="wait">
            <motion.img key={current.image} src={current.image} alt="" width="1100" height="900" loading="lazy" initial={{ opacity: 0, scale: 1.03 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.6 }} />
          </AnimatePresence>
          <div className="v-journey-overlay" />
          <span className="v-journey-count">{String(active + 1).padStart(2, '0')} <i /> 06</span>
          <div className="v-journey-progress"><i style={{ transform: `scaleY(${(active + 1) / journey.length})` }} /></div>
          <div className="v-journey-image-copy"><span>THE JOURNEY</span><b>{current.title}</b></div>
        </div>
        <p className="v-journey-disclaimer">Regional imagery and process narrative are illustrative; confirmed supplier and process details are not provided.</p>
      </div>
      <div className="v-journey-copy">
        <SectionLabel number="04">The journey</SectionLabel>
        <h2>From the land<br /><em>to the table.</em></h2>
        <p className="v-journey-intro">A spice moves through a series of places and decisions before it reaches the kitchen.</p>
        {journey.map((step, index) => (
          <article className={`v-journey-step ${active === index ? 'is-current' : ''}`} key={step.title} ref={(node) => { steps.current[index] = node; }} data-journey-index={index}>
            <span>0{index + 1}</span><h3>{step.title}</h3><p>{step.text}</p>
          </article>
        ))}
        <TextLink href="/farm-sourcing">About origins and sourcing</TextLink>
      </div>
    </section>
  );
}

function PackagingReveal() {
  return (
    <section className="v-packaging" id="packaging">
      <div className="v-packaging-copy">
        <SectionLabel number="05">The craft</SectionLabel>
        <span className="v-kicker">A PACKAGING STUDY</span>
        <h2>Made to honour<br /><em>what’s within.</em></h2>
        <p>VANAM’s digital packaging study keeps the spice in focus: a clear name, generous negative space and a palette drawn from the ingredients themselves.</p>
        <span className="v-concept-note">Illustrative concept — final pack design and product details to be confirmed.</span>
        <TextLink href="/spices">Discover the collection</TextLink>
      </div>
      <motion.div className="v-packaging-visual" initial={{ opacity: 0, y: 34 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, amount: 0.3 }} transition={{ duration: 0.9 }}>
        <div className="v-pack-glow" />
        <div className="v-pack v-pack-back" aria-hidden="true" />
        <div className="v-pack" data-cursor="image">
          <span className="v-pack-brand">VANAM</span>
          <span className="v-pack-rule" />
          <span className="v-pack-product">GOLDEN<br />TURMERIC</span>
          <span className="v-pack-bottom">A HERITAGE OF INDIAN FLAVOUR</span>
          <span className="v-pack-weight">100 g</span>
        </div>
        <span className="v-pack-caption">THE VANAM STUDY · TURMERIC</span>
      </motion.div>
    </section>
  );
}

function NotesPreview() {
  return (
    <section className="v-notes">
      <div className="v-notes-head"><div><SectionLabel number="06">The table</SectionLabel><h2>Stories worth <em>passing on.</em></h2></div><TextLink href="/recipes">Visit the recipe journal</TextLink></div>
      <div className="v-notes-grid">
        {recipes.slice(0, 3).map((recipe, index) => (
          <Link className={`v-note-card v-note-card-${index + 1}`} href={`/recipes/${recipe.slug}`} key={recipe.slug} data-cursor="discover">
            <div className="v-note-image"><img src={recipe.image} alt="" width="720" height="550" loading="lazy" /></div>
            <div className="v-note-copy"><span>{recipe.category} · {recipe.time}</span><h3>{recipe.name}</h3><p>{recipe.description}</p><b>Read the recipe <ArrowRight size={14} /></b></div>
          </Link>
        ))}
      </div>
      <div className="v-journal-teaser">
        <div><SectionLabel number="07">The journey</SectionLabel><h2>Words from <em>the spice house.</em></h2></div>
        <Link href={`/journal/${journal[0].slug}`} className="v-journal-feature" data-cursor="discover">
          <img src={journal[0].image} alt="" width="1100" height="620" loading="lazy" />
          <div><span>THE JOURNAL · {journal[0].readingTime}</span><h3>{journal[0].title}</h3><p>{journal[0].excerpt}</p><b>Read the story <ArrowRight size={14} /></b></div>
        </Link>
        <TextLink href="/journal">Explore the journal</TextLink>
      </div>
    </section>
  );
}

export default function HomePage() {
  return (
    <>
      <PageMeta title="VANAM — A Heritage of Indian Flavour" description="Discover VANAM, a premium Indian spice house. Explore distinctive spices, their growing regions, culinary stories and considered ways to cook." image={heroSlides[0].image} />
      <main className="v-home">
        <Hero />
        <BrandStatement />
        <SpiceShowcase />
        <OriginInvitation />
        <FarmJourney />
        <PackagingReveal />
        <NotesPreview />
        <section className="v-home-close">
          <div className="v-home-close-image" />
          <div className="v-home-close-shade" />
          <div className="v-home-close-copy">
            <span className="v-kicker">THE STORY DOESN’T END AT THE SPICE</span>
            <h2>Discover the flavours, places and traditions behind VANAM.</h2>
            <TextLink href="/our-story">Explore VANAM</TextLink>
          </div>
        </section>
        <PageEndCta title="A heritage of Indian flavour." href="/our-story" label="Meet the house" />
      </main>
    </>
  );
}
