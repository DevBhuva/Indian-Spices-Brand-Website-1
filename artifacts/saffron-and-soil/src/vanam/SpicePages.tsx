import { useState } from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, ArrowUpRight } from 'lucide-react';
import { Link } from 'wouter';
import { origins } from '../data/origins';
import { spices } from '../data/spices';
import { PageEndCta, PageIntro, SectionLabel, TextLink } from './ui';
import { PageMeta } from './seo';

const filters = ['All', 'Whole spice', 'Ground spice', 'Blended masala'];

export function SpicesIndex() {
  const [filter, setFilter] = useState('All');
  const visible = filter === 'All' ? spices : spices.filter((spice) => spice.category === filter);
  return (
    <>
      <PageMeta title="Indian Spices & Masalas | VANAM Collection" description="Explore the VANAM collection of Indian whole spices, ground spices and blended masalas. Discover each spice’s flavour, uses, origins and available sizes." image={spices[0].image} />
      <main className="v-page">
        <PageIntro number="02" label="The collection" title={<>Spices with<br /><em>something to say.</em></>} description="Whole spices, fragrant powders and considered blends. Meet each one on its own terms." image={spices[0].image} />
        <section className="v-wrap v-catalogue">
          <div className="v-catalogue-top"><span className="v-kicker">THE VANAM SPICE HOUSE · 15 EXPRESSIONS</span><p>Every page tells an individual story: flavour, culinary use and crop-region context. None imply a confirmed supplier relationship.</p></div>
          <div className="v-filters" aria-label="Filter spice collection">
            {filters.map((item) => <button type="button" className={filter === item ? 'is-active' : ''} aria-pressed={filter === item} onClick={() => setFilter(item)} key={item}>{item}</button>)}
          </div>
          <div className="v-spice-grid">
            {visible.map((spice, index) => (
              <motion.article className="v-spice-card" key={spice.slug} initial={{ opacity: 0, y: 18 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, amount: 0.15 }} transition={{ duration: 0.55, delay: (index % 3) * 0.05 }}>
                <Link href={`/spices/${spice.slug}`} className="v-spice-card-image" data-cursor="discover" aria-label={`Discover ${spice.name}`}>
                  <img src={spice.image} alt={spice.imageAlt} width="700" height="850" loading="lazy" />
                  <span className="v-spice-card-number">{String(spices.indexOf(spice) + 1).padStart(2, '0')} <i /> 15</span>
                  <span className="v-spice-card-open">Discover {spice.name} <ArrowUpRight size={14} /></span>
                </Link>
                <div className="v-spice-card-copy"><span className="v-kicker">{spice.category}</span><h2><Link href={`/spices/${spice.slug}`}>{spice.name}</Link></h2><p>{spice.subtitle}</p><Link className="v-small-link" href={`/spices/${spice.slug}`}>The story <ArrowRight size={13} /></Link></div>
              </motion.article>
            ))}
          </div>
        </section>
        <section className="v-collection-note"><div><SectionLabel number="02">Choose your spice</SectionLabel><h2>A good meal<br /><em>begins with a detail.</em></h2></div><TextLink href="/recipes">Find inspiration at the table</TextLink></section>
      </main>
    </>
  );
}

export function SpiceDetail({ slug }: { slug: string }) {
  const spice = spices.find((item) => item.slug === slug);
  if (!spice) return <NotFoundContent />;
  const related = spice.related.map((relatedSlug) => spices.find((item) => item.slug === relatedSlug)).filter((item): item is (typeof spices)[number] => Boolean(item));
  const linkedOrigins = spice.origin.filter((origin) => origin !== 'India').map((origin) => origins.find((item) => item.name === origin)).filter((item): item is (typeof origins)[number] => Boolean(item));
  const flavourNotes = spice.character.split(' · ');
  return (
    <>
      <PageMeta
        title={`${spice.name} — ${spice.title} | VANAM`}
        description={`${spice.name}: ${spice.description} Explore its flavour, aroma, culinary uses, regional context and VANAM’s available pack sizes.`}
        image={spice.image}
        schema={{ '@context': 'https://schema.org', '@type': 'Product', name: spice.name, description: spice.description, image: new URL(spice.image, window.location.origin).href, brand: { '@type': 'Brand', name: 'VANAM' }, category: `Indian spices / ${spice.category}` }}
      />
      <main className="v-page v-spice-detail">
        <section className="v-detail-hero">
          <motion.img layoutId={`spice-${spice.slug}`} src={spice.image} alt={spice.imageAlt} width="1500" height="1300" fetchPriority="high" />
          <div className="v-detail-hero-shade" />
          <div className="v-detail-hero-copy">
            <Link className="v-back-link" href="/spices"><ArrowRight className="v-flip" size={14} /> All spices</Link>
            <span className="v-kicker">{spice.title}</span>
            <h1>{spice.name}</h1>
            <p>{spice.subtitle}</p>
          </div>
          <span className="v-detail-hero-index">{String(spices.indexOf(spice) + 1).padStart(2, '0')} <i /> 15</span>
        </section>
        <section className="v-detail-intro v-wrap">
          <SectionLabel number="02">The spice profile</SectionLabel>
          <div><h2>{spice.subtitle}</h2><p>{spice.flavour}</p></div>
          <div className="v-flavour-profile" aria-label={`Flavour characteristics: ${flavourNotes.join(', ')}`}>
            {flavourNotes.map((note, index) => <div className="v-flavour-line" key={note}><span>{note}</span><i><b style={{ width: `${54 + ((index * 17 + spice.slug.length * 3) % 42)}%` }} /></i></div>)}
          </div>
        </section>
        <section className="v-detail-story">
          <div className="v-detail-story-image"><img src={spice.image} alt={`${spice.name}: ${spice.imageAlt}`} width="1000" height="1100" loading="lazy" /></div>
          <div className="v-detail-story-copy"><SectionLabel number="03">Origin & character</SectionLabel><span className="v-kicker">GROWING-REGION CONTEXT</span><h2>A story shaped<br /><em>by place.</em></h2><div className="v-origin-names">{spice.origin.map((origin) => {
            const place = origins.find((item) => item.name === origin);
            return place ? <Link key={origin} href={`/origins/${place.slug}`}>{origin}<ArrowUpRight size={13} /></Link> : <span key={origin}>{origin}</span>;
          })}</div><p>{spice.description}</p><p className="v-disclosure">These are general crop-region associations, not a statement that VANAM currently sources from every location shown. Specific farm and lot records have not been supplied.</p>{linkedOrigins.length > 0 && <TextLink href={`/origins/${linkedOrigins[0].slug}`}>Read the regional story</TextLink>}</div>
        </section>
        <section className="v-wrap v-culinary">
          <div className="v-culinary-copy"><SectionLabel number="04">At the table</SectionLabel><h2>Let the flavour<br /><em>find its place.</em></h2><p>{spice.flavour}</p><div className="v-culinary-uses"><h3>In the kitchen</h3>{spice.kitchen.map((use) => <span key={use}><i />{use}</span>)}</div></div>
          <div className="v-culinary-detail"><div className="v-profile-list"><div><span>Colour</span><b>{spice.colour}</b></div><div><span>Aroma</span><b>{spice.aroma}</b></div><div><span>Form</span><b>{spice.form}</b></div><div><span>Character</span><b>{spice.character}</b></div></div><div className="v-pairings"><h3>Pairs well with</h3><div>{spice.pairings.map((name) => { const match = spices.find((item) => item.name.toLowerCase() === name.toLowerCase()); return match ? <Link key={match.slug} href={`/spices/${match.slug}`}>{match.name}<ArrowUpRight size={13} /></Link> : <span key={name}>{name}</span>; })}</div></div></div>
        </section>
        <section className="v-pack-sizes"><div><SectionLabel number="05">Available formats</SectionLabel><h2>Ready for <em>your kitchen.</em></h2><p>Formats shown for the VANAM collection. Final pack specifications and availability should be confirmed before launch.</p></div><div className="v-size-list">{spice.sizes.map((size) => <span key={size}>{size}</span>)}</div></section>
        <section className="v-wrap v-related">
          <div className="v-related-head"><SectionLabel number="06">A related note</SectionLabel><h2>Explore another <em>flavour.</em></h2></div>
          <div className="v-related-grid">{related.map((item) => <Link href={`/spices/${item.slug}`} key={item.slug} className="v-related-card" data-cursor="discover"><img src={item.image} alt={item.imageAlt} loading="lazy" width="500" height="600" /><span>{item.category}</span><b>{item.name}<ArrowRight size={15} /></b></Link>)}</div>
        </section>
        <PageEndCta title="Bring a little India to the table." href="/recipes" label="Find a recipe" />
      </main>
    </>
  );
}

function regionImage(slug: string) {
  const map: Record<string, string> = { kerala: 'black-pepper', gujarat: 'cumin', rajasthan: 'coriander', 'andhra-pradesh': 'red-chilli', karnataka: 'cardamom', 'madhya-pradesh': 'coriander' };
  return spices.find((item) => item.slug === map[slug]) ?? spices[0];
}

export function OriginsIndex() {
  return (
    <>
      <PageMeta title="Origins — Indian Spice Regions | VANAM" description="Discover the Indian regions associated with VANAM spices through regional stories, growing conditions, culinary traditions and related spice pages." image={regionImage('kerala').image} />
      <main className="v-page">
        <PageIntro number="03" label="The origins" title={<>India, told<br /><em>through spice.</em></>} description="A vertical journey from country to region, from spice to story. No illustrated map—just the places and ingredients connected by food." />
        <section className="v-origin-flow v-wrap" aria-label="How to explore spice origins">
          <span>INDIA</span><i>↓</i><span>REGION</span><i>↓</i><span>SPICE</span><i>↓</i><span>STORY</span>
        </section>
        <section className="v-wrap v-origin-index">
          <div className="v-origin-index-head"><SectionLabel number="03">Regional discovery</SectionLabel><p>Explore recognised crop associations. They are not claims about VANAM’s own supplier network.</p></div>
          <div className="v-origin-grid">{origins.map((origin, index) => {
            const featured = regionImage(origin.slug);
            return <motion.article key={origin.slug} className={`v-origin-card v-origin-card-${index % 3}`} initial={{ opacity: 0, y: 22 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, amount: 0.16 }} transition={{ duration: 0.62, delay: (index % 3) * 0.06 }}>
              <Link href={`/origins/${origin.slug}`} data-cursor="image"><img src={featured.image} alt="" width="700" height="900" loading="lazy" /><span className="v-origin-card-shade" /><span className="v-origin-card-copy"><i>{String(index + 1).padStart(2, '0')} — REGION</i><b>{origin.name}</b><small>{origin.spices.join(' · ')}</small><em>Read the story <ArrowRight size={14} /></em></span></Link>
            </motion.article>;
          })}</div>
        </section>
        <PageEndCta title="Follow a spice to the table." href="/spices" label="Explore the collection" />
      </main>
    </>
  );
}

export function OriginDetail({ slug }: { slug: string }) {
  const origin = origins.find((item) => item.slug === slug);
  if (!origin) return <NotFoundContent />;
  const image = regionImage(origin.slug);
  const related = origin.spices.map((name) => spices.find((item) => item.name.toLowerCase() === name.toLowerCase())).filter((item): item is (typeof spices)[number] => Boolean(item));
  return (
    <>
      <PageMeta title={`${origin.name} Spice Origins | VANAM`} description={`${origin.name}: explore its agricultural landscape, the spices associated with the region, and how those ingredients meet the Indian kitchen.`} image={image.image} />
      <main className="v-page">
        <section className="v-origin-hero"><img src={image.image} alt={`${origin.name} region story, illustrated through ${image.name.toLowerCase()}`} width="1500" height="1000" fetchPriority="high" /><div className="v-origin-hero-shade" /><div className="v-origin-hero-copy"><Link className="v-back-link" href="/origins"><ArrowRight className="v-flip" size={14} /> All origins</Link><span className="v-kicker">INDIA · {origin.spices.join(' · ')}</span><h1>{origin.name}</h1><p>{origin.story}</p></div></section>
        <section className="v-region-story v-wrap"><div><SectionLabel number="03">Place & growing conditions</SectionLabel><h2>A landscape<br /><em>of its own.</em></h2></div><div><p>{origin.climate}</p><p>{origin.conditions}</p><p>{origin.usage}</p><div className="v-disclosure"><b>About sourcing</b><span>{origin.sourcing}</span></div></div></section>
        <section className="v-region-spices"><div className="v-wrap"><SectionLabel number="04">Spices in the story</SectionLabel><h2>Follow the flavour.</h2><div className="v-region-spice-grid">{related.map((spice) => <Link key={spice.slug} href={`/spices/${spice.slug}`} data-cursor="discover"><img src={spice.image} alt={spice.imageAlt} width="620" height="760" loading="lazy" /><span>{spice.category}</span><b>{spice.name}<ArrowRight size={15} /></b></Link>)}</div></div></section>
        <PageEndCta title={`More of India, one spice at a time.`} href="/origins" label="Explore the other regions" />
      </main>
    </>
  );
}

function NotFoundContent() {
  return <main className="v-not-found"><span className="v-kicker">THE SPICE HOUSE</span><h1>This chapter isn’t here.</h1><p>That page may have moved. Return to the collection and continue exploring.</p><TextLink href="/spices">Visit the collection</TextLink></main>;
}
