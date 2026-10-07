import { useEffect, useMemo, useState, type FormEvent } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { ArrowLeft, ArrowRight, ArrowUpRight, Check, ChevronLeft, ChevronRight, X } from 'lucide-react';
import { Link } from 'wouter';
import { journal } from '../data/journal';
import { origins } from '../data/origins';
import { recipes } from '../data/recipes';
import { spices } from '../data/spices';
import { PageMeta } from './seo';
import { PageEndCta, PageIntro, SectionLabel, TextLink } from './ui';

const contactEmail = 'replace-with-your-company-email@example.com';

function prepareDraft(subject: string, fields: Record<string, string>) {
  const body = Object.entries(fields).map(([key, value]) => `${key}: ${value}`).join('\n');
  window.location.href = `mailto:${contactEmail}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
}

export function StoryPage() {
  const chapters = [
    { title: 'A living inheritance', text: 'India’s spice story travels through growing regions, markets and family kitchens. Every ingredient carries its own vocabulary of colour, aroma and use.' },
    { title: 'Why spices matter', text: 'A pinch can change the way a dish arrives at the table. It can bring warmth, fragrance, brightness or the memory of a place.' },
    { title: 'A point of view', text: 'VANAM begins with respect for that variety: a premium Indian spice house shaped by heritage, considered detail and a contemporary eye.' },
    { title: 'Care in the craft', text: 'The brand’s story is told through ingredients, culinary knowledge and a clear standard for describing how each product is handled.' },
    { title: 'An open future', text: 'There is always another region, recipe or ritual worth discovering. VANAM is an invitation to keep looking, cooking and sharing.' },
  ];
  return (
    <>
      <PageMeta title="Our Story — VANAM Indian Spice House" description="Meet VANAM: a contemporary Indian spice house inspired by the country’s heritage of flavour, the meaning of spice and thoughtful detail." image={spices[0].image} />
      <main className="v-page">
        <PageIntro number="01" label="The house" title={<>A heritage of<br /><em>Indian flavour.</em></>} description="VANAM is a premium Indian spice house shaped by the idea that every flavour carries a story." image={spices[4].image} />
        <section className="v-story-intro"><div className="v-wrap"><span className="v-kicker">INDIA’S SPICE HERITAGE, REIMAGINED</span><h2>A story that begins<br /><em>with the ingredient.</em></h2><p>Not with a founding myth or a date. With the colours, aromas and traditions that have made Indian spices part of everyday life.</p></div></section>
        <section className="v-story-chapters">
          {chapters.map((chapter, index) => {
            const image = [spices[0], spices[2], spices[4], spices[5], spices[7]][index];
            return <article className={`v-story-chapter v-story-chapter-${index + 1}`} key={chapter.title}>
              <div className="v-story-chapter-image" data-cursor="image"><img src={image.image} alt={image.imageAlt} width="1000" height="1150" loading="lazy" /></div>
              <div><SectionLabel number={`0${index + 1}`}>The house</SectionLabel><span className="v-kicker">{index === 0 ? 'BEGINNING' : index === 1 ? 'WHY SPICES' : index === 2 ? 'PHILOSOPHY' : index === 3 ? 'CRAFT' : 'THE FUTURE'}</span><h2>{chapter.title}</h2><p>{chapter.text}</p></div>
            </article>;
          })}
        </section>
        <PageEndCta title="A heritage of Indian flavour." href="/spices" label="Meet the collection" />
      </main>
    </>
  );
}

const qualitySteps = [
  { name: 'Source', prompt: 'Where did this crop grow, and what records support that description?', note: 'Tie each ingredient to a documented region and supply record before publishing a sourcing claim.', image: spices[4].image },
  { name: 'Select', prompt: 'What defines the ingredient chosen for the blend or pack?', note: 'Describe visible form, aroma and culinary character without inventing a standard or score.', image: spices[2].image },
  { name: 'Clean', prompt: 'What handling is appropriate for this spice?', note: 'Document the actual cleaning method and controls used for the product before making a process claim.', image: spices[11].image },
  { name: 'Process', prompt: 'How is the ingredient prepared for its intended use?', note: 'Processing varies by spice. Any statement about milling, temperature or batch size must match actual practice.', image: spices[0].image },
  { name: 'Test', prompt: 'Which checks apply to this product and its batch?', note: 'Testing protocols and laboratory results were not provided. This page does not claim a certification or test result.', image: spices[7].image },
  { name: 'Pack', prompt: 'How will the final format protect and identify the spice?', note: 'The digital pack shown is a concept. Final packaging and legal product information must be confirmed.', image: spices[12].image },
];

export function QualityPage() {
  const [active, setActive] = useState(0);
  const step = qualitySteps[active];
  return (
    <>
      <PageMeta title="Quality & Craft — VANAM Spices" description="Explore the quality framework behind VANAM’s Indian spices: source, select, clean, process, test and pack, with no unsupported certification claims." image={spices[4].image} />
      <main className="v-page">
        <PageIntro number="04" label="The craft" title={<>Care is a process,<br /><em>not a promise.</em></>} description="Quality deserves to be described plainly, with every operational claim supported by the right records." image={spices[2].image} />
        <section className="v-quality-intro v-wrap"><SectionLabel number="04">Quality, by design</SectionLabel><div><h2>Precise in the detail.<br /><em>Honest in the claim.</em></h2><p>This quality framework sets out the questions a spice journey should answer. VANAM-specific suppliers, operating procedures, tests and certifications have not been provided; none are asserted here.</p></div></section>
        <section className="v-quality-workbench">
          <div className="v-quality-visual"><AnimatePresence mode="wait"><motion.img key={step.name} src={step.image} alt="" width="1000" height="900" loading="lazy" initial={{ opacity: 0, scale: 1.03 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.55 }} /></AnimatePresence><div className="v-quality-visual-shade" /><span>{String(active + 1).padStart(2, '0')} <i /> 06</span><div className="v-quality-caption"><small>THE QUESTION</small><b>{step.prompt}</b></div></div>
          <div className="v-quality-steps"><span className="v-kicker">A QUALITY FRAMEWORK</span><div className="v-process-line"><i style={{ transform: `scaleX(${(active + 1) / qualitySteps.length})` }} /></div>
            {qualitySteps.map((item, index) => <button key={item.name} type="button" onClick={() => setActive(index)} className={active === index ? 'is-active' : ''} aria-pressed={active === index}>
              <span>0{index + 1}</span><b>{item.name}</b><i aria-hidden="true">{active === index ? '−' : '+'}</i>
              {active === index && <small>{item.note}</small>}
            </button>)}
          </div>
        </section>
        <div className="v-wrap v-quality-note"><span><Check size={16} /> WHAT THIS PAGE DOES NOT CLAIM</span><p>No purity, organic, lab-tested, pesticide-free, food-safety certification or sourcing-partner claim is made without supporting information from VANAM.</p></div>
        <PageEndCta title="Know the spice. Follow the story." href="/origins" label="Explore the origins" />
      </main>
    </>
  );
}

const sourcingStages = [
  { title: 'The land', text: 'India’s spice-growing landscapes vary with climate, soil and season. A recognised crop region can offer useful context without identifying a specific farm.', image: '/images/farm-harvest.png' },
  { title: 'The harvest', text: 'Harvest timing and post-harvest care influence a spice’s colour, form and aroma. Product-specific details need to be verified before they are attributed to VANAM.', image: spices[4].image },
  { title: 'The selection', text: 'A thoughtful selection starts with the ingredient and the cooking role it is meant to play.', image: spices[2].image },
  { title: 'The craft', text: 'Cleaning, processing and quality checks should be described at the level VANAM can document for each product.', image: spices[0].image },
  { title: 'The pack', text: 'A package is part of the experience and a source of essential product information. The visual displayed here is an unconfirmed design study.', image: spices[12].image },
  { title: 'Your kitchen', text: 'The journey comes together in the everyday ritual of cooking: a spice warmed in a pan, shared around a table.', image: spices[7].image },
];

export function SourcingPage() {
  return (
    <>
      <PageMeta title="Farm & Sourcing — VANAM" description="Follow the general journey of Indian spices from crop region to kitchen. VANAM-specific supplier relationships and operating details are not asserted." image="/images/farm-harvest.png" />
      <main className="v-page">
        <PageIntro number="04" label="The journey" title={<>From the lands<br /><em>that grow flavour.</em></>} description="A thoughtful sourcing story starts with what can be verified: place, crop, handling and the path into the kitchen." image="/images/farm-harvest.png" />
        <section className="v-sourcing-notice v-wrap"><SectionLabel number="04">A note on sourcing</SectionLabel><div><h2>Crop regions are not<br /><em>supplier claims.</em></h2><p>The regions featured here describe general agricultural associations. VANAM’s specific growers, farms, supply partners and traceability records were not provided.</p></div></section>
        <section className="v-sourcing-journey">{sourcingStages.map((stage, index) => <article className="v-sourcing-stage" key={stage.title}><div className="v-sourcing-stage-image"><img src={stage.image} alt="" width="1000" height="900" loading="lazy" /></div><div><SectionLabel number={`0${index + 1}`}>From land to kitchen</SectionLabel><h2>{stage.title}</h2><p>{stage.text}</p></div></article>)}</section>
        <PageEndCta title="Follow the story of an ingredient." href="/origins" label="Discover the origins" />
      </main>
    </>
  );
}

const recipeCategories = ['All', 'Indian classics', 'Regional', 'Everyday', 'Festive', 'Vegetarian', 'Non-vegetarian'];

export function RecipesPage() {
  const [filter, setFilter] = useState('All');
  const visible = filter === 'All' ? recipes : recipes.filter((recipe) => recipe.category.toLowerCase() === filter.toLowerCase());
  return (
    <>
      <PageMeta title="Indian Spice Recipes — VANAM Table" description="Cook with VANAM recipes for Indian classics, regional dishes, everyday meals, festive cooking and more. Each recipe links its featured spices." image={recipes[0].image} />
      <main className="v-page">
        <PageIntro number="05" label="The table" title={<>A little more<br /><em>flavour to share.</em></>} description="Recipes for everyday cooking, unhurried meals and the people who gather around your table." image={recipes[0].image} />
        <section className="v-wrap v-recipes-index">
          <div className="v-editorial-feature"><Link href={`/recipes/${recipes[0].slug}`} className="v-editorial-feature-image" data-cursor="discover"><img src={recipes[0].image} alt="" width="1100" height="770" fetchPriority="high" /><span>THE VANAM TABLE · FEATURED RECIPE</span></Link><div><SectionLabel number="05">From the kitchen</SectionLabel><span className="v-kicker">{recipes[0].time} · {recipes[0].difficulty}</span><h2>{recipes[0].name}</h2><p>{recipes[0].description}</p><TextLink href={`/recipes/${recipes[0].slug}`}>Read the recipe</TextLink></div></div>
          <div className="v-filters" aria-label="Filter recipes">{recipeCategories.map((category) => <button key={category} type="button" onClick={() => setFilter(category)} className={filter === category ? 'is-active' : ''} aria-pressed={filter === category}>{category}</button>)}</div>
          {visible.length > 0 ? <div className="v-recipe-grid">{visible.map((recipe, index) => <motion.article key={recipe.slug} className={`v-recipe-card v-recipe-card-${index % 3}`} initial={{ opacity: 0, y: 18 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, amount: 0.12 }} transition={{ duration: 0.55 }}><Link href={`/recipes/${recipe.slug}`} data-cursor="discover"><div className="v-recipe-card-image"><img src={recipe.image} alt="" width="740" height="580" loading="lazy" /><span>{recipe.time} · {recipe.difficulty}</span></div><small>{recipe.category}</small><h2>{recipe.name}</h2><p>{recipe.description}</p><b>Open recipe <ArrowRight size={14} /></b></Link></motion.article>)}</div> : <p className="v-empty-state">A new recipe is being prepared for this collection.</p>}
        </section>
        <PageEndCta title="Make room for another flavour." href="/spices" label="Explore the spices" />
      </main>
    </>
  );
}

export function RecipeDetail({ slug }: { slug: string }) {
  const recipe = recipes.find((item) => item.slug === slug);
  if (!recipe) return <NotFoundContent />;
  const linkedSpices = recipe.spices.map((name) => spices.find((item) => item.name.toLowerCase() === name.toLowerCase())).filter((item): item is (typeof spices)[number] => Boolean(item));
  const related = recipes.filter((other) => other.slug !== recipe.slug && other.spices.some((name) => recipe.spices.includes(name))).slice(0, 3);
  return (
    <>
      <PageMeta title={`${recipe.name} Recipe — VANAM Table`} description={`${recipe.description} See ingredients, preparation, method, cooking time and the VANAM spices used in this recipe.`} image={recipe.image} schema={{ '@context': 'https://schema.org', '@type': 'Recipe', name: recipe.name, description: recipe.description, image: recipe.image, recipeCategory: recipe.category, recipeIngredient: recipe.ingredients, recipeInstructions: recipe.method.map((text) => ({ '@type': 'HowToStep', text })), cookTime: recipe.time }} />
      <main className="v-page v-recipe-detail">
        <section className="v-recipe-hero"><img src={recipe.image} alt={`Prepared ${recipe.name}`} width="1800" height="1200" fetchPriority="high" /><div className="v-recipe-hero-shade" /><div className="v-recipe-hero-copy"><Link className="v-back-link" href="/recipes"><ArrowLeft size={14} /> All recipes</Link><span className="v-kicker">{recipe.category} · {recipe.time} · {recipe.difficulty}</span><h1>{recipe.name}</h1><p>{recipe.description}</p></div></section>
        <section className="v-recipe-story v-wrap"><SectionLabel number="05">A story from the table</SectionLabel><p>{recipe.story}</p><div className="v-recipe-meta"><span><small>PREPARATION</small><b>{recipe.preparation.length} steps</b></span><span><small>COOKING TIME</small><b>{recipe.time}</b></span><span><small>DIFFICULTY</small><b>{recipe.difficulty}</b></span></div></section>
        <section className="v-recipe-body v-wrap"><div className="v-recipe-ingredients"><span className="v-kicker">BEFORE YOU BEGIN</span><h2>Gather the <em>ingredients.</em></h2><ul>{recipe.ingredients.map((ingredient) => <li key={ingredient}>{ingredient}</li>)}</ul><h3>Preparation</h3><ol>{recipe.preparation.map((step) => <li key={step}>{step}</li>)}</ol></div><div className="v-recipe-method"><SectionLabel number="05">At the stove</SectionLabel><h2>Let it <em>come together.</em></h2><ol>{recipe.method.map((step, index) => <li key={step}><span>0{index + 1}</span><p>{step}</p></li>)}</ol><div className="v-chef-tip"><span>THE COOK’S NOTE</span><p>{recipe.tip}</p></div></div></section>
        <section className="v-recipe-spices"><div className="v-wrap"><SectionLabel number="02">The featured spices</SectionLabel><div className="v-recipe-spice-links">{linkedSpices.map((spice) => <Link key={spice.slug} href={`/spices/${spice.slug}`}><img src={spice.image} alt="" width="220" height="240" loading="lazy" /><span>{spice.name}</span><ArrowUpRight size={13} /></Link>)}</div></div></section>
        {related.length > 0 && <section className="v-wrap v-related-recipes"><SectionLabel number="05">Keep cooking</SectionLabel><h2>More for <em>the table.</em></h2><div>{related.map((item) => <Link key={item.slug} href={`/recipes/${item.slug}`}><span>{item.category} · {item.time}</span><b>{item.name}<ArrowRight size={14} /></b></Link>)}</div></section>}
        <PageEndCta title="The best part is sharing it." href="/recipes" label="Back to the recipes" />
      </main>
    </>
  );
}

export function JournalPage() {
  const featured = journal[0];
  return (
    <>
      <PageMeta title="The VANAM Journal — Stories of Indian Spice" description="Read the VANAM journal: editorial notes on Indian spice regions, culinary traditions, ingredients and the journey from crop to kitchen." image={featured.image} />
      <main className="v-page">
        <PageIntro number="06" label="The journey" title={<>Stories of spice,<br /><em>place and table.</em></>} description="A considered journal about the ingredients and traditions that shape the way India cooks." />
        <section className="v-wrap v-journal-page">
          <Link className="v-journal-hero" href={`/journal/${featured.slug}`} data-cursor="discover"><img src={featured.image} alt="" width="1500" height="900" fetchPriority="high" /><span className="v-journal-hero-shade" /><div><span className="v-kicker">THE JOURNAL · {featured.readingTime}</span><h2>{featured.title}</h2><p>{featured.excerpt}</p><b>Read the feature <ArrowRight size={15} /></b></div></Link>
          <div className="v-journal-grid">{journal.slice(1).map((entry, index) => <motion.article className={`v-journal-card v-journal-card-${index + 1}`} key={entry.slug} initial={{ opacity: 0, y: 18 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, amount: 0.16 }}><Link href={`/journal/${entry.slug}`} data-cursor="discover"><div><img src={entry.image} alt="" width="700" height="550" loading="lazy" /></div><span>{entry.category} · {entry.readingTime}</span><h2>{entry.title}</h2><p>{entry.excerpt}</p><b>Open the story <ArrowRight size={14} /></b></Link></motion.article>)}</div>
        </section>
        <PageEndCta title="A flavour is only the beginning." href="/origins" label="Discover where it grows" />
      </main>
    </>
  );
}

export function JournalArticle({ slug }: { slug: string }) {
  const article = journal.find((item) => item.slug === slug);
  if (!article) return <NotFoundContent />;
  return (
    <>
      <PageMeta title={`${article.title} | VANAM Journal`} description={article.excerpt} image={article.image} schema={{ '@context': 'https://schema.org', '@type': 'Article', headline: article.title, description: article.excerpt, image: article.image, datePublished: '2026-10-07', author: { '@type': 'Organization', name: 'VANAM' }, publisher: { '@type': 'Organization', name: 'VANAM' } }} />
      <main className="v-page">
        <section className="v-article-hero"><img src={article.image} alt="" width="1600" height="1000" fetchPriority="high" /><div className="v-article-hero-shade" /><div><Link className="v-back-link" href="/journal"><ArrowLeft size={14} /> The journal</Link><span className="v-kicker">{article.category} · 07 OCTOBER 2026 · {article.readingTime}</span><h1>{article.title}</h1><p>{article.excerpt}</p></div></section>
        <article className="v-article-body v-wrap"><aside><span>VANAM JOURNAL</span><span>07 OCT 2026</span><span>{article.readingTime}</span></aside><div><p className="v-article-standfirst">{article.excerpt}</p>{article.body.map((paragraph, index) => <p key={paragraph}>{paragraph}{index === 0 && <span className="v-article-drop" aria-hidden="true">{paragraph.charAt(0)}</span>}</p>)}<div className="v-article-end">— VANAM, A HERITAGE OF INDIAN FLAVOUR —</div></div></article>
        <PageEndCta title="Continue the story." href="/journal" label="Read another note" />
      </main>
    </>
  );
}

type GalleryImage = { title: string; category: string; src: string; alt: string; concept?: boolean };
const galleryImages: GalleryImage[] = [
  ...spices.map((spice) => ({ title: spice.name, category: 'Spices', src: spice.image, alt: spice.imageAlt })),
  ...origins.map((origin, index) => ({ title: origin.name, category: 'Origins', src: spices[[4, 3, 2, 1, 5, 2][index] ?? 0].image, alt: `${origin.name} crop-region story, represented by ${origin.spices[0]}` })),
  { title: 'The growing landscape', category: 'Farms', src: '/images/farm-harvest.png', alt: 'Illustrative Indian agricultural landscape', },
  ...spices.slice(0, 4).map((spice) => ({ title: `${spice.name} · detail`, category: 'Craft', src: spice.image, alt: spice.imageAlt })),
  { title: 'VANAM packaging study', category: 'Packaging', src: spices[0].image, alt: 'Illustrative VANAM packaging concept', concept: true },
  ...recipes.map((recipe) => ({ title: recipe.name, category: 'Food', src: recipe.image, alt: `Editorial food photograph for ${recipe.name}` })),
  { title: 'Hands at work', category: 'People', src: '/images/farm-harvest.png', alt: 'Illustrative image associated with agricultural work' },
];
const galleryCategories = ['All', 'Spices', 'Origins', 'Farms', 'Craft', 'Packaging', 'Food', 'People'];

export function GalleryPage() {
  const [category, setCategory] = useState('All');
  const [selected, setSelected] = useState<number | null>(null);
  const visible = useMemo(() => galleryImages.map((item, index) => ({ ...item, index })).filter((item) => category === 'All' || item.category === category), [category]);

  useEffect(() => {
    if (selected === null) return;
    const onKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setSelected(null);
      if (event.key === 'ArrowRight') setSelected((current) => current === null ? null : (current + 1) % galleryImages.length);
      if (event.key === 'ArrowLeft') setSelected((current) => current === null ? null : (current - 1 + galleryImages.length) % galleryImages.length);
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [selected]);

  return (
    <>
      <PageMeta title="VANAM Gallery — Spices, Origins & the Table" description="Explore the VANAM visual journal: spice still lifes, regional stories, farm imagery, craft, food and a digital packaging study." image={spices[4].image} />
      <main className="v-page">
        <PageIntro number="07" label="The journey" title={<>A house of colour,<br /><em>texture and flavour.</em></>} description="A visual journal through the ingredients, landscapes and rituals behind the Indian spice cupboard." />
        <section className="v-wrap v-gallery-page">
          <div className="v-filters" aria-label="Filter gallery">{galleryCategories.map((item) => <button type="button" className={item === category ? 'is-active' : ''} aria-pressed={item === category} onClick={() => setCategory(item)} key={item}>{item}</button>)}</div>
          <div className="v-gallery-grid">{visible.map((item, index) => <button type="button" key={`${item.title}-${item.index}`} className={`v-gallery-tile v-gallery-tile-${index % 5}`} onClick={() => setSelected(item.index)} data-cursor="image">
            {item.concept ? <span className="v-gallery-pack"><b>VANAM</b><i />{item.title}</span> : <img src={item.src} alt={item.alt} width="700" height="850" loading="lazy" />}
            <span className="v-gallery-caption"><i>{item.category}</i><b>{item.title}</b></span>
          </button>)}</div>
        </section>
        <PageEndCta title="Discover more behind the flavour." href="/origins" label="Follow the origins" />
      </main>
      <AnimatePresence>
        {selected !== null && (
          <motion.div className="v-lightbox" role="dialog" aria-modal="true" aria-label={`${galleryImages[selected].title} photograph`} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onMouseDown={(event) => { if (event.target === event.currentTarget) setSelected(null); }}>
            <button type="button" className="v-lightbox-close" onClick={() => setSelected(null)} aria-label="Close image"><X /></button>
            <button type="button" className="v-lightbox-prev" onClick={() => setSelected((selected - 1 + galleryImages.length) % galleryImages.length)} aria-label="Previous image"><ChevronLeft /></button>
            {galleryImages[selected].concept ? <div className="v-lightbox-pack"><span>VANAM</span><i />{galleryImages[selected].title}<small>ILLUSTRATIVE DESIGN STUDY</small></div> : <img src={galleryImages[selected].src} alt={galleryImages[selected].alt} />}
            <div className="v-lightbox-caption"><span>{galleryImages[selected].category}</span><b>{galleryImages[selected].title}</b></div>
            <button type="button" className="v-lightbox-next" onClick={() => setSelected((selected + 1) % galleryImages.length)} aria-label="Next image"><ChevronRight /></button>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

function ContactFields() {
  return (
    <div className="v-contact-details">
      <div><small>EMAIL</small><b>Official inbox pending confirmation</b></div>
      <div><small>PHONE / WHATSAPP</small><b>Number to be supplied by VANAM</b></div>
      <div><small>ADDRESS</small><b>Verified business address to be added</b></div>
    </div>
  );
}

export function ContactPage() {
  const [status, setStatus] = useState('');
  const submit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const fields = Object.fromEntries([...new FormData(event.currentTarget).entries()].map(([key, value]) => [key, String(value)]));
    prepareDraft('VANAM website enquiry', fields);
    setStatus('Your email app will open with a draft. This site does not store or send form submissions.');
  };
  return (
    <>
      <PageMeta title="Contact VANAM — Indian Spice House" description="Get in touch with VANAM for product questions, distribution enquiries and brand partnerships. Official contact details are awaiting confirmation." image={spices[4].image} />
      <main className="v-page">
        <PageIntro number="08" label="Contact the house" title={<>Let’s begin<br /><em>a conversation.</em></>} description="For product questions, partnerships or distribution, send a note to the VANAM team." />
        <section className="v-contact-layout v-wrap">
          <div className="v-contact-aside"><SectionLabel number="08">The house</SectionLabel><h2>We would be glad<br /><em>to hear from you.</em></h2><p>Official email, phone, WhatsApp, social and postal details have not been provided yet. They are intentionally left unfilled rather than invented.</p><ContactFields /><div className="v-setup-warning">The sample recipient in the form must be replaced with VANAM’s official inbox before launch.</div></div>
          <form className="v-contact-form" onSubmit={submit}>
            <span className="v-kicker">WRITE TO VANAM</span>
            <div className="v-form-grid">
              <label><span>Your name</span><input required name="Name" autoComplete="name" /></label>
              <label><span>Email address</span><input required type="email" name="Email" autoComplete="email" /></label>
              <label className="v-span-all"><span>What can we help with?</span><select name="Enquiry type" defaultValue="Product enquiry"><option>Product enquiry</option><option>Distribution</option><option>Partnership</option><option>Press</option><option>Something else</option></select></label>
              <label className="v-span-all"><span>Your message</span><textarea required name="Message" rows={5} /></label>
            </div>
            <button className="v-button v-button-maroon" type="submit">Prepare email draft <ArrowRight size={15} /></button>
            {status && <p className="v-form-status" role="status">{status}</p>}
            <p className="v-form-disclaimer">Submitting opens a draft in your email application. Nothing is stored or sent by this website.</p>
          </form>
        </section>
        <PageEndCta title="Explore the flavours behind the name." href="/spices" label="See the spices" />
      </main>
    </>
  );
}

const businessTypes = ['Importer', 'Distributor', 'Retailer', 'Food service', 'Brand partner', 'Other'];

export function DistributorsPage() {
  const [status, setStatus] = useState('');
  const submit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const fields = Object.fromEntries([...new FormData(event.currentTarget).entries()].map(([key, value]) => [key, String(value)]));
    prepareDraft('VANAM distribution enquiry', fields);
    setStatus('Your email app will open with a draft. This site does not store or send enquiries.');
  };
  return (
    <>
      <PageMeta title="Become a VANAM Distributor — Indian Spices" description="Enquire about distributing VANAM Indian spices. Share your company, location and business details using the trade enquiry form." image={spices[2].image} />
      <main className="v-page">
        <PageIntro number="08" label="For trade" title={<>Bring the house<br /><em>to your market.</em></>} description="VANAM is open to conversations with distributors, retailers, importers and food-service partners." image={spices[2].image} />
        <section className="v-distributor-intro v-wrap"><SectionLabel number="08">A conversation for trade</SectionLabel><div><h2>Start with <em>your market.</em></h2><p>Tell us about your business and the market you serve. A VANAM representative will need to be connected to the sample email recipient before enquiries can be received.</p><div className="v-setup-warning">No enquiry is sent or stored until the recipient email is configured.</div></div></section>
        <section className="v-distributor-form-section">
          <form className="v-distributor-form" onSubmit={submit}>
            <div className="v-distributor-form-title"><span className="v-kicker">DISTRIBUTION ENQUIRY</span><h2>Tell us <em>about your business.</em></h2></div>
            <div className="v-form-grid">
              <label><span>Full name</span><input required name="Name" autoComplete="name" /></label>
              <label><span>Company</span><input required name="Company" autoComplete="organization" /></label>
              <label><span>Country</span><input required name="Country" autoComplete="country-name" /></label>
              <label><span>State / region</span><input name="State / region" autoComplete="address-level1" /></label>
              <label><span>City</span><input name="City" autoComplete="address-level2" /></label>
              <label><span>Phone</span><input required type="tel" name="Phone" autoComplete="tel" /></label>
              <label><span>Work email</span><input required type="email" name="Email" autoComplete="email" /></label>
              <label><span>Business type</span><select name="Business type" defaultValue="" required><option value="" disabled>Select a business type</option>{businessTypes.map((type) => <option key={type}>{type}</option>)}</select></label>
              <label className="v-span-all"><span>Message</span><textarea name="Message" rows={5} placeholder="Tell us about your market, business and the products you’re interested in." /></label>
            </div>
            <button className="v-button v-button-gold" type="submit">Prepare trade enquiry <ArrowRight size={15} /></button>
            {status && <p className="v-form-status" role="status">{status}</p>}
            <p className="v-form-disclaimer">The form prepares a draft email only. It does not send or retain your information.</p>
          </form>
        </section>
        <PageEndCta title="A heritage of Indian flavour." href="/spices" label="Discover the collection" />
      </main>
    </>
  );
}

function NotFoundContent() {
  return <main className="v-not-found"><span className="v-kicker">THE SPICE HOUSE</span><h1>This chapter isn’t here.</h1><p>That page may have moved. Return to the VANAM collection and keep exploring.</p><TextLink href="/spices">Visit the collection</TextLink></main>;
}
