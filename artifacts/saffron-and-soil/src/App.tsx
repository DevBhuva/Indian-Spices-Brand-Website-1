import { useEffect, useState, type ReactNode } from 'react';
import { Link, Route, Switch, useLocation, Router as WouterRouter } from 'wouter';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import {
  ArrowDown, ArrowRight, ArrowUpRight, Check, Clock3, Leaf,
  Menu, ShieldCheck, X,
} from 'lucide-react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ErrorBoundary } from '@/components/error-boundary';
import { Form } from '@/components/ui/form';
import { Toaster } from '@/components/ui/toaster';
import { TooltipProvider } from '@/components/ui/tooltip';
import NotFound from '@/pages/not-found';

const queryClient = new QueryClient();
const BRAND = 'Saffron & Soil';
const CONTACT_EMAIL = 'replace-with-your-company-email@example.com';
const navLinks = [
  ['Home', '/'], ['About', '/about'], ['Products', '/products'], ['Quality', '/quality'],
  ['Recipes', '/recipes'], ['Our Story', '/our-story'], ['Gallery', '/gallery'], ['Contact', '/contact'],
] as const;
const productItems = [
  { name: 'Turmeric Powder', category: 'Ground spices', description: 'Golden, earthy turmeric with a mellow warmth and naturally deep colour.', sizes: '50g · 100g · 200g', image: '/images/spice-range.png', pos: '12% 50%' },
  { name: 'Red Chilli Powder', category: 'Ground spices', description: 'A vivid, balanced chilli that brings colour before heat and a lingering finish.', sizes: '50g · 100g · 200g', image: '/images/spice-hero.png', pos: '68% 48%' },
  { name: 'Coriander Powder', category: 'Ground spices', description: 'Bright and citrusy, milled for the gentle sweetness of freshly crushed seed.', sizes: '50g · 100g · 200g', image: '/images/spice-table.png', pos: '68% 48%' },
  { name: 'Cumin Powder', category: 'Ground spices', description: 'Toasty, fragrant cumin, carefully cleaned and ground in small batches.', sizes: '50g · 100g · 200g', image: '/images/spice-range.png', pos: '76% 53%' },
  { name: 'Garam Masala', category: 'Blended spices', description: 'A house blend of warming whole spices, layered rather than loud.', sizes: '50g · 100g', image: '/images/spice-table.png', pos: '52% 48%' },
  { name: 'Black Pepper', category: 'Whole spices', description: 'Bold peppercorns with a clean, bright bite from the Malabar coast.', sizes: '50g · 100g', image: '/images/farm-harvest.png', pos: '56% 56%' },
  { name: 'Cumin Seeds', category: 'Whole spices', description: 'A kitchen essential, selected for a warm aroma and even, clean seed.', sizes: '50g · 100g · 200g', image: '/images/spice-table.png', pos: '39% 67%' },
  { name: 'Green Cardamom', category: 'Whole spices', description: 'Naturally sweet, aromatic pods gathered from the southern hills.', sizes: '25g · 50g', image: '/images/farm-harvest.png', pos: '44% 55%' },
  { name: 'Cinnamon', category: 'Whole spices', description: 'Fragrant bark with soft sweetness, selected for its delicate layers.', sizes: '25g · 50g', image: '/images/spice-table.png', pos: '78% 30%' },
  { name: 'Kitchen King Masala', category: 'Blended spices', description: 'An all-purpose family blend for rich gravies, vegetables and more.', sizes: '50g · 100g', image: '/images/spice-range.png', pos: '52% 46%' },
];
const regionData = [
  { name: 'Gujarat', spices: 'Cumin · Coriander · Fennel', text: 'Dry days and open skies nurture the clean, aromatic seeds at the heart of everyday Indian cooking.', x: 37, y: 49 },
  { name: 'Rajasthan', spices: 'Cumin · Fenugreek · Coriander', text: 'A sunlit landscape known for deeply aromatic seed spices and resilient farming traditions.', x: 42, y: 34 },
  { name: 'Kerala', spices: 'Black pepper · Cardamom · Cinnamon', text: 'The cool, rain-fed slopes of the Western Ghats yield pepper, cardamom and cinnamon of remarkable character.', x: 47, y: 78 },
  { name: 'Andhra Pradesh', spices: 'Red chilli · Turmeric', text: 'Warm soils and a long growing season give Andhra its iconic red chillies and vibrant turmeric.', x: 57, y: 65 },
  { name: 'Karnataka', spices: 'Pepper · Cardamom · Turmeric', text: 'From humid coastal belts to green highlands, Karnataka brings fragrant, richly varied harvests.', x: 50, y: 70 },
  { name: 'Tamil Nadu', spices: 'Turmeric · Chilli · Coriander', text: 'Sunshine, fertile plains and generations of know-how make Tamil Nadu a home for bold, vivid spices.', x: 55, y: 79 },
  { name: 'Madhya Pradesh', spices: 'Coriander · Garlic · Chilli', text: 'Central India’s fertile heartland is prized for bright coriander and robust, dependable crops.', x: 51, y: 47 },
  { name: 'Uttar Pradesh', spices: 'Coriander · Fennel · Chilli', text: 'A rich agricultural belt where careful cultivation gives seed spices a delicate, rounded fragrance.', x: 61, y: 39 },
];
const benefits = [
  ['01', 'Authentic sourcing', 'Spices carefully selected from trusted Indian growing regions.'],
  ['02', 'Pure flavour', 'Maintaining the natural aroma, colour and character of every spice.'],
  ['03', 'Quality first', 'Strict quality checks throughout processing and packaging.'],
  ['04', 'Made for every kitchen', 'Authentic Indian flavour made simple for everyday cooking.'],
];
const qualitySteps = [
  ['01', 'Source', 'Close relationships with growers and trusted spice markets.'],
  ['02', 'Select', 'Each lot is chosen for its aroma, colour and character.'],
  ['03', 'Clean', 'Careful cleaning removes dust and unwanted material.'],
  ['04', 'Process', 'Thoughtful handling helps preserve each spice’s nature.'],
  ['05', 'Quality check', 'Checks at every stage, from incoming spice to final pack.'],
  ['06', 'Pack', 'Sealed with care to protect freshness until it reaches your kitchen.'],
];
const recipes = [
  { name: 'Slow-simmered dal makhani', category: 'Comfort food', time: '55 min', spice: 'Garam Masala', description: 'Black lentils, a patient simmer, a spoonful of butter and our warm house garam masala.', image: '/images/spice-table.png' },
  { name: 'Sunday aloo gobi', category: 'Everyday favourites', time: '35 min', spice: 'Turmeric + Cumin', description: 'Golden potato and cauliflower with cumin seeds, turmeric and a squeeze of lime.', image: '/images/spice-hero.png' },
  { name: 'Malabar pepper rasam', category: 'Comfort food', time: '25 min', spice: 'Black Pepper', description: 'A bright, peppery broth with tamarind, tomato and the fragrance of curry leaves.', image: '/images/farm-harvest.png' },
  { name: 'Chilli crisp bhindi', category: 'Everyday favourites', time: '30 min', spice: 'Red Chilli', description: 'Tender okra tossed with garlic, coriander and a little lively heat.', image: '/images/spice-range.png' },
  { name: 'Cardamom chai cake', category: 'Something sweet', time: '60 min', spice: 'Green Cardamom', description: 'A soft tea cake carrying the gentle perfume of crushed green cardamom.', image: '/images/spice-table.png' },
  { name: 'Coriander lemon rice', category: 'Everyday favourites', time: '20 min', spice: 'Coriander', description: 'Fragrant rice brightened with fresh lemon, toasted spices and crunchy peanuts.', image: '/images/spice-hero.png' },
];
const storyMilestones = [
  ['A living inheritance', 'India’s spice story is carried between growing regions, bustling markets and family kitchens, in flavours that travel across generations.'],
  ['A wider table', 'Across India’s varied landscapes, growers and market partners bring distinctive spices from their regions to kitchens everywhere.'],
  ['Care, made visible', 'Thoughtful cleaning, close quality checks and considered packaging help preserve the character of every spice.'],
  ['Tradition, onward', 'Old knowledge meets a contemporary outlook: still curious, still rooted, still made for everyday cooking.'],
];

function BrandLogo() {
  return <Link href="/" className="brand-mark" aria-label={`${BRAND} home`} data-testid="link-brand-home">
    <span className="brand-seal">S<span style={{ fontSize: 9, verticalAlign: 'top' }}>✳</span></span>
    <span className="brand-name">{BRAND}<span>Indian spices · rooted in India</span></span>
  </Link>;
}

function Header() {
  const [path] = useLocation();
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  useEffect(() => {
    const watch = () => setScrolled(window.scrollY > 32);
    window.addEventListener('scroll', watch);
    watch();
    return () => window.removeEventListener('scroll', watch);
  }, []);
  useEffect(() => { setOpen(false); window.scrollTo({ top: 0, behavior: 'smooth' }); }, [path]);
  const solid = scrolled || path !== '/';
  return <>
    <header className={`site-header ${solid ? 'scrolled inner-header' : ''}`}>
      <BrandLogo />
      <nav className="main-nav" aria-label="Main navigation">
        {navLinks.map(([label, href]) => <Link key={href} href={href} data-testid={`nav-${label.toLowerCase().replace(' ', '-')}`}>{label}</Link>)}
      </nav>
      <Link className="header-cta" href="/contact?enquiry=distributor">Become a distributor <ArrowUpRight size={13} /></Link>
      <button className="menu-toggle" type="button" aria-label={open ? 'Close navigation' : 'Open navigation'} onClick={() => setOpen(!open)} data-testid="button-menu-toggle">
        {open ? <X size={25} /> : <Menu size={25} />}
      </button>
    </header>
    {open && <nav className="mobile-menu" aria-label="Mobile navigation">
      <div className="eyebrow">Explore {BRAND}</div>
      {navLinks.map(([label, href]) => <Link key={href} href={href}>{label}</Link>)}
      <Link href="/contact?enquiry=distributor" className="text-link">Become a distributor <ArrowRight size={16} /></Link>
    </nav>}
  </>;
}

function Footer() {
  return <footer className="footer">
    <div className="footer-main">
      <div><BrandLogo /><p>From India’s soil to your kitchen. We bring the colour, fragrance and character of carefully chosen spices to everyday cooking.</p></div>
      <div className="footer-col"><h4>Explore</h4>{navLinks.slice(1, 5).map(([name, href]) => <Link key={href} href={href}>{name}</Link>)}</div>
      <div className="footer-col"><h4>Our world</h4>{navLinks.slice(5).map(([name, href]) => <Link key={href} href={href}>{name}</Link>)}</div>
      <div><h4>Come say namaste</h4><p>For distribution, partnerships or a simple hello, we would love to hear from you.</p><Link className="text-link" href="/contact">Get in touch <ArrowRight size={14} /></Link></div>
    </div>
    <div className="footer-bottom"><span>© {new Date().getFullYear()} {BRAND}. All rights reserved.</span><span>Rooted in India. Made for every kitchen.</span></div>
  </footer>;
}

function SiteLayout({ children }: { children: ReactNode }) {
  return <div className="site-shell"><Header /><main>{children}</main><Footer /></div>;
}

function PageHero({ label, title, italic, description, plain = false }: { label: string; title: string; italic?: string; description: string; plain?: boolean }) {
  return <section className={`page-hero ${plain ? 'no-image' : ''}`}>
    <div className="eyebrow">{label}</div>
    <h1 className="page-title">{title} {italic && <em>{italic}</em>}</h1>
    <p className="copy">{description}</p>
  </section>;
}

function ProductCard({ item, onView }: { item: typeof productItems[number]; onView: () => void }) {
  return <article className="product-card" data-testid={`card-product-${item.name.toLowerCase().replaceAll(' ', '-')}`}>
    <div className="product-photo"><img src={item.image} style={{ objectPosition: item.pos }} alt={`${item.name} spices`} /><span className="product-tag">{item.category}</span></div>
    <div className="product-info"><div className="eyebrow">{item.category}</div><h3>{item.name}</h3><p>{item.description}</p>
      <div className="product-meta"><span>Available formats</span><span>{item.sizes}</span></div>
      <button type="button" className="product-view" onClick={onView} data-testid={`button-view-${item.name.toLowerCase().replaceAll(' ', '-')}`}>Discover this spice <ArrowRight size={13} /></button>
    </div>
  </article>;
}

function ProductModal({ item, onClose }: { item: typeof productItems[number]; onClose: () => void }) {
  return <div className="modal-backdrop" role="presentation" onMouseDown={(event) => { if (event.target === event.currentTarget) onClose(); }}>
    <div className="modal" role="dialog" aria-modal="true" aria-label={item.name}>
      <button className="modal-close" type="button" onClick={onClose} aria-label="Close"><X /></button>
      <img src={item.image} style={{ objectPosition: item.pos }} alt={item.name} />
      <div className="modal-copy"><div className="eyebrow">{item.category}</div><h2>{item.name}</h2><p>{item.description}</p><p>Every spice begins with a thoughtful selection. We work to preserve its natural character through careful cleaning, processing and hygienic packing.</p><div className="product-meta"><span>Available formats</span><span>{item.sizes}</span></div><Link href="/contact" className="text-link" onClick={onClose}>Ask us about this product <ArrowRight size={15} /></Link></div>
    </div>
  </div>;
}

function ProductsSection({ featured = false }: { featured?: boolean }) {
  const [selected, setSelected] = useState<typeof productItems[number] | null>(null);
  const items = featured ? productItems.slice(0, 4) : productItems;
  return <section className="section product-band">
    <div className="section-head"><div><div className="eyebrow">{featured ? 'From our spice cupboard' : 'The collection'}</div><h2>{featured ? <>Flavour, carefully <em>crafted.</em></> : <>A little of India, <em>in every jar.</em></>}</h2></div>
      {featured && <Link className="text-link" href="/products">View all products <ArrowRight size={14} /></Link>}
    </div>
    <div className="product-grid">{items.map((item) => <ProductCard key={item.name} item={item} onView={() => setSelected(item)} />)}</div>
    {!featured && <div className="section-head" style={{ marginTop: 46, marginBottom: 0 }}><p className="copy">Our range is made for the rhythm of real kitchens: everyday essentials, whole spices and blends to bring a little more depth to the table.</p><Link className="text-link" href="/contact">Enquire about our range <ArrowRight size={14} /></Link></div>}
    {selected && <ProductModal item={selected} onClose={() => setSelected(null)} />}
  </section>;
}

function WhySection() {
  return <section className="section benefit-section">
    <div className="eyebrow">What we stand for</div><h2>Good spice begins <em>with good care.</em></h2>
    <div className="benefit-grid">{benefits.map(([n, title, text]) => <article className="benefit" key={n}><span className="benefit-no">{n}</span><h3>{title}</h3><p>{text}</p></article>)}</div>
  </section>;
}

function MapSection() {
  const [selected, setSelected] = useState(regionData[2]);
  return <section className="section map-section">
    <div className="section-head"><div><div className="eyebrow">A country of many flavours</div><h2>Rooted in <em>India’s soil.</em></h2></div><p className="copy">Every growing landscape has its own story. We look for spices where they grow best, and for the people who know them by heart.</p></div>
    <div className="map-layout"><div className="india-map" aria-label="Interactive map of Indian spice growing regions">
      <svg className="india-shape" viewBox="0 0 400 480" role="img" aria-label="Illustrated outline of India">
        <path d="M112 15 L152 22 167 42 193 45 206 66 236 67 257 87 285 91 307 115 330 128 321 147 340 165 326 185 337 204 319 223 327 243 306 255 298 281 278 291 269 313 249 323 237 348 221 368 212 391 194 418 184 454 164 436 155 408 137 383 128 356 113 336 99 311 84 291 73 264 55 244 46 217 62 197 57 177 76 160 75 138 92 122 89 99 103 81 95 60 107 40 Z" fill="#cfbd9d" stroke="#ad9574" strokeWidth="2" />
        <path d="M105 84 Q190 115 307 115 M69 203 Q166 211 327 204 M91 290 Q184 305 278 291 M128 356 Q190 366 237 348" stroke="#e8ddca" strokeWidth="2" strokeDasharray="4 6" fill="none" opacity=".85"/>
      </svg>
      {regionData.map((region) => <button key={region.name} className={`region-pin ${selected.name === region.name ? 'active' : ''}`} style={{ left: `${region.x}%`, top: `${region.y}%` }} onMouseEnter={() => setSelected(region)} onClick={() => setSelected(region)} aria-label={`Learn about ${region.name}`} data-testid={`button-region-${region.name.toLowerCase().replaceAll(' ', '-')}`} />)}
      <span style={{ position: 'absolute', bottom: 15, left: 17, fontSize: 9, textTransform: 'uppercase', letterSpacing: '.15em', color: '#766655' }}>Select a growing region</span>
    </div>
    <div className="region-copy"><div className="eyebrow">From the growing region</div><h3>{selected.name}</h3><div className="region-spices">{selected.spices}</div><p>{selected.text}</p><div className="filter-row" style={{ marginBottom: 0, marginTop: 20 }}>{regionData.map((region) => <button key={region.name} className={`filter-chip ${selected.name === region.name ? 'active' : ''}`} onClick={() => setSelected(region)}>{region.name}</button>)}</div></div></div>
  </section>;
}

function QualitySection({ full = false }: { full?: boolean }) {
  return <section className="section dark-section grain">
    <div className="eyebrow">Care at every step</div><h2>Pure by nature.<br /><em>Precise by process.</em></h2>
    <p className="copy">Authenticity is a promise. We carry it from the source through every decision, so the spice that reaches your kitchen is true to where it began.</p>
    <div className="quality-steps">{qualitySteps.map(([n, title, text]) => <article className="quality-step" key={n}><b>{n}</b><h3>{title}</h3><p>{text}</p></article>)}</div>
    {full && <><div className="quality-image" /><div style={{ display: 'flex', gap: 20, flexWrap: 'wrap', marginTop: 28 }}><span className="eyebrow"><ShieldCheck size={15} /> Careful selection</span><span className="eyebrow"><Leaf size={15} /> Ingredient integrity</span><span className="eyebrow"><Check size={15} /> Hygiene-led handling</span></div></>}
  </section>;
}

function HomePage() {
  return <>
    <section className="hero grain">
      <div className="hero-content"><div className="eyebrow">Authentic Indian spices</div><h1>The soul of India,<br /><em>in every pinch.</em></h1><p className="hero-copy">Carefully sourced Indian spices crafted to bring authentic flavour, aroma and tradition to every kitchen.</p>
        <div className="button-row"><Link href="/products" className="btn">Explore our spices <ArrowRight size={15} /></Link><Link href="/our-story" className="btn outline">Discover our story <ArrowUpRight size={14} /></Link></div>
      </div><a href="#our-philosophy" className="scroll-note"><span /> Scroll to savour <ArrowDown size={13} /></a>
    </section>
    <section id="our-philosophy" className="intro-grid">
      <div className="intro-image"><span className="image-caption">The Western Ghats · Kerala</span></div>
      <div className="intro-copy"><div className="eyebrow">Our philosophy</div><h2 className="page-title">From India’s soil <em>to your kitchen.</em></h2><p>There is a place, a season and a pair of hands behind every good spice. We select authentic Indian ingredients, honour traditional flavour and bring them to you with quality-focused processing and modern hygiene.</p><p>Because the best things are made with both memory and care.</p><Link className="text-link" href="/about">Know our story <ArrowRight size={15} /></Link></div>
    </section>
    <ProductsSection featured />
    <WhySection />
    <MapSection />
    <QualitySection />
    <section className="story-strip"><div className="story-image" /><div className="story-copy"><div className="eyebrow">More than a spice jar</div><h2>Every harvest carries <em>a little history.</em></h2><p className="copy">Our story is woven from the people, places and everyday rituals that make Indian food feel like home.</p><Link className="text-link" href="/our-story">Walk through our story <ArrowRight size={15} /></Link></div></section>
    <section className="section"><div className="section-head"><div><div className="eyebrow">From our kitchen to yours</div><h2>Made to be <em>shared.</em></h2><p className="copy">A few comforting, colourful ideas for your next meal.</p></div><Link className="text-link" href="/recipes">Browse all recipes <ArrowRight size={14} /></Link></div><RecipeCards entries={recipes.slice(0, 3)} /></section>
    <ContactCta />
  </>;
}

function AboutPage() {
  return <>
    <PageHero label="A little about us" title="An Indian spice house," italic="rooted in care." description="We believe good spices should tell the truth about where they come from—and make everyday cooking feel a little more like home." />
    <section className="section content-grid"><div><div className="eyebrow">Our philosophy</div><h2>Tradition in the hand.<br /><em>Care in every step.</em></h2><p className="copy">For generations, spices have travelled through India in baskets, markets and family recipes. Our work is to keep that journey honest: authentic ingredients, carefully selected; natural flavour preserved; quality watched at every stage; and modern hygiene built into the way we work.</p><p className="copy">The result is a spice cupboard that feels familiar, dependable and full of possibility.</p><Link className="text-link" href="/quality">How we take care <ArrowRight size={14} /></Link></div><div className="content-image" /></section>
    <section className="section benefit-section"><div className="eyebrow">What we believe</div><h2>Small choices make <em>lasting flavour.</em></h2><div className="values-grid" style={{ marginTop: 36 }}>{[['Honest origins','Know where our spices grow, and respect the people who grow them.'],['Flavour first','Keep the natural aroma, colour and character of each ingredient at the centre.'],['Care without compromise','Pair traditional knowledge with considered processing and modern hygiene.']].map(([title, text], i) => <article className="value-card" key={title}><span className="benefit-no">0{i + 1}</span><h3>{title}</h3><p>{text}</p></article>)}</div></section>
    <ContactCta />
  </>;
}

function ProductsPage() {
  return <><PageHero label="Our collection" title="A pantry of" italic="possibilities." description="The spices you reach for every day, and the ones that take dinner somewhere new. Carefully chosen, thoughtfully handled, ready for your kitchen." /><ProductsSection /></>;
}

function QualityPage() {
  return <><PageHero label="Quality, by design" title="Good flavour is" italic="never an accident." description="Quality is more than a final check. It is the care we bring to each choice along the way." /><QualitySection full />
    <section className="section"><div className="eyebrow">A closer look</div><h2>Care you can <em>count on.</em></h2><div className="quality-detail-grid" style={{ marginTop: 40 }}>{[
      ['01', 'Responsible sourcing', 'Trusted relationships and careful selection help us begin with ingredients worth bringing home.'],
      ['02', 'Thoughtful handling', 'Cleaning, processing and packing follow a considered approach that protects the character of the spice.'],
      ['03', 'Checks along the way', 'We keep an eye on quality throughout the journey, not only at the end of it.'],
      ['04', 'Hygiene-led process', 'Modern hygiene practices and attention to detail guide the work behind every pack.'],
      ['05', 'Freshness protected', 'Packaging is designed to keep the aroma and flavour safe on the journey to your kitchen.'],
      ['06', 'A promise renewed', 'Every pack is a reminder of our commitment to honest flavour, made with care.'],
    ].map(([n, title, text]) => <article className="quality-detail" key={n}><span>{n}</span><h3>{title}</h3><p>{text}</p></article>)}</div></section></>;
}

function RecipeCards({ entries, onSelect }: { entries: typeof recipes; onSelect?: (recipe: typeof recipes[number]) => void }) {
  return <div className="recipe-grid">{entries.map((recipe) => <article key={recipe.name} className="recipe-card" onClick={() => onSelect?.(recipe)} role={onSelect ? 'button' : undefined} tabIndex={onSelect ? 0 : undefined} onKeyDown={(event) => { if (onSelect && (event.key === 'Enter' || event.key === ' ')) onSelect(recipe); }}>
    <img src={recipe.image} alt={`${recipe.name} with spices`} /><div className="recipe-info"><small>{recipe.category} · {recipe.spice}</small><h3>{recipe.name}</h3><p>{recipe.description}</p><small style={{ display: 'flex', alignItems: 'center', gap: 7 }}><Clock3 size={13} /> {recipe.time} <span style={{ marginLeft: 'auto' }}>Read recipe <ArrowRight size={13} /></span></small></div>
  </article>)}</div>;
}

function RecipeModal({ recipe, onClose }: { recipe: typeof recipes[number]; onClose: () => void }) {
  return <div className="modal-backdrop" onMouseDown={(event) => { if (event.target === event.currentTarget) onClose(); }}><div className="modal" role="dialog" aria-modal="true" aria-label={recipe.name}>
    <button className="modal-close" onClick={onClose} aria-label="Close recipe"><X /></button><img src={recipe.image} alt={recipe.name} /><div className="modal-copy"><div className="eyebrow">From our kitchen · {recipe.time}</div><h2>{recipe.name}</h2><p>{recipe.description}</p><h3 style={{ font: '26px var(--serif)' }}>A little of what you need</h3><p>Seasonal vegetables, a few pantry staples, fresh herbs and {recipe.spice.toLowerCase()} from our spice cupboard.</p><h3 style={{ font: '26px var(--serif)' }}>Make it your own</h3><p>Toast whole spices gently until fragrant. Add your ingredients and let the flavours come together slowly. Finish with something bright and share while warm.</p></div>
  </div></div>;
}

function RecipesPage() {
  const [filter, setFilter] = useState('All recipes');
  const [selected, setSelected] = useState<typeof recipes[number] | null>(null);
  const filters = ['All recipes', 'Everyday favourites', 'Comfort food', 'Something sweet'];
  const visible = filter === 'All recipes' ? recipes : recipes.filter((recipe) => recipe.category === filter);
  return <><PageHero label="A little inspiration" title="Bring a little more" italic="flavour to the table." description="Recipes for the everyday, the unhurried and the people who gather around your table." />
    <section className="section"><div className="filter-row">{filters.map((item) => <button key={item} className={`filter-chip ${filter === item ? 'active' : ''}`} onClick={() => setFilter(item)} data-testid={`filter-${item.toLowerCase().replaceAll(' ', '-')}`}>{item}</button>)}</div><RecipeCards entries={visible} onSelect={setSelected} />{visible.length === 0 && <p className="copy">A new recipe is simmering. Check back soon.</p>}</section>
    {selected && <RecipeModal recipe={selected} onClose={() => setSelected(null)} />}
  </>;
}

function OurStoryPage() {
  return <><PageHero label="Our story" title="Some things are" italic="worth passing on." description="A story of good ingredients, trusted relationships and the flavours that bring us back to the table." />
    <section className="section content-grid"><div className="content-image" style={{ backgroundImage: "url('/images/farm-harvest.png')" }} /><div><div className="eyebrow">A family of flavours</div><h2>From one honest idea <em>to a shared table.</em></h2><p className="copy">India’s incredible spices deserve to be treated with the same respect they bring to our food. Their story travels through growing regions, early market mornings and kitchens where recipes are handed down by feel.</p><p className="copy">That belief guides this brand: select with care, preserve what makes each spice special and make it part of everyday life.</p></div></section>
    <section className="section benefit-section"><div className="eyebrow">The journey so far</div><h2>Many hands. <em>One promise.</em></h2><div className="timeline-list">{storyMilestones.map(([title, text], i) => <article className="timeline-entry" key={title}><span>{String(i + 1).padStart(2, '0')} / Our story</span><h3>{title}</h3><p>{text}</p></article>)}</div></section>
    <ContactCta />
  </>;
}

function GalleryPage() {
  const [active, setActive] = useState<{ image: string; label: string } | null>(null);
  const photos = [
    ['/images/spice-hero.png', 'Spice, in all its colour'],
    ['/images/farm-harvest.png', 'A harvest in the hills'],
    ['/images/spice-table.png', 'Ready for the kitchen'],
    ['/images/spice-range.png', 'Made for everyday cooking'],
    ['/images/farm-harvest.png', 'From the Western Ghats'],
    ['/images/spice-hero.png', 'The warmth of the market'],
    ['/images/spice-table.png', 'The little details'],
  ];
  return <><PageHero label="A glimpse into our world" title="The colour, craft" italic="and character of spice." description="From growing landscapes to the heart of the kitchen, take a closer look at the people and ingredients behind every pinch." />
    <section className="section"><div className="gallery-grid">{photos.map(([image, label], i) => <button className="gallery-item" key={`${label}-${i}`} onClick={() => setActive({ image, label })} aria-label={`View image: ${label}`} data-testid={`gallery-image-${i + 1}`}><img src={image} alt={label} /><span className="gallery-label">{label}</span></button>)}</div></section>
    {active && <div className="modal-backdrop" onClick={() => setActive(null)}><div className="modal" style={{ display: 'block', maxWidth: 960, position: 'relative' }} onClick={(event) => event.stopPropagation()}><button className="modal-close" onClick={() => setActive(null)} aria-label="Close image"><X /></button><img src={active.image} alt={active.label} style={{ width: '100%', height: 'min(75vh,700px)', objectFit: 'cover', display: 'block' }} /><div className="modal-copy" style={{ padding: '20px 28px' }}><div className="eyebrow">{active.label}</div></div></div></div>}
  </>;
}

function ContactCta() {
  return <section className="section dark-section"><div className="eyebrow">For every kind of partnership</div><h2>Let’s bring good flavour <em>to more tables.</em></h2><p className="copy">Looking to stock our range, work together or simply learn more? Start a conversation with us.</p><Link className="btn" href="/contact" style={{ marginTop: 25 }}>Talk to our team <ArrowRight size={14} /></Link></section>;
}

const contactSchema = z.object({
  name: z.string().trim().min(1, 'Please enter your name.'),
  email: z.string().email('Enter a valid email address.'),
  phone: z.string(),
  subject: z.string().min(1, 'Choose what you are writing about.'),
  message: z.string().trim().min(1, 'Please add a message.'),
});
type ContactValues = z.infer<typeof contactSchema>;

function ContactPage() {
  const distributor = window.location.search.includes('distributor');
  const [submitted, setSubmitted] = useState(false);
  const form = useForm<ContactValues>({
    resolver: zodResolver(contactSchema),
    defaultValues: {
      name: '',
      email: '',
      phone: '',
      subject: distributor ? 'Distribution enquiry' : '',
      message: '',
    },
  });
  const submit = (values: ContactValues) => {
    const body = [
      `Name: ${values.name}`,
      `Email: ${values.email}`,
      `Phone: ${values.phone || 'Not provided'}`,
      '',
      values.message,
    ].join('\n');
    window.location.href = `mailto:${CONTACT_EMAIL}?subject=${encodeURIComponent(values.subject)}&body=${encodeURIComponent(body)}`;
    setSubmitted(true);
  };
  return <><PageHero label="We would love to hear from you" title="Good things begin" italic="with a hello." description="For distribution, partnerships, product questions or a little more about our work—leave us a note." plain />
    <section className="section contact-layout"><div><div className="eyebrow">Get in touch</div><h2>Let’s start <em>a conversation.</em></h2><p className="copy">Tell us what brings you here and our team will be glad to point you in the right direction.</p><div style={{ marginTop: 40, borderTop: '1px solid var(--line)', paddingTop: 23 }}><div className="eyebrow">For our distribution partners</div><p className="copy">Interested in bringing {BRAND} to your region? Share a little about your business in the message field and select “Distribution enquiry”.</p><span className="text-link">India · Growing together <ArrowUpRight size={14} /></span></div></div>
    <Form {...form}><form className="contact-form" onSubmit={form.handleSubmit(submit)} noValidate>
      {submitted && <div className="form-success"><Check size={17} style={{ verticalAlign: 'middle', marginRight: 8 }} />Your email draft should now be open. Review the details and send it from your email app.</div>}
      <div className="field"><label htmlFor="contact-name">Your name</label><input id="contact-name" {...form.register('name')} placeholder="How should we address you?" data-testid="input-name" />{form.formState.errors.name && <span className="form-error">{form.formState.errors.name.message}</span>}</div>
      <div className="field"><label htmlFor="contact-email">Email address</label><input id="contact-email" type="email" {...form.register('email')} placeholder="you@example.com" data-testid="input-email" />{form.formState.errors.email && <span className="form-error">{form.formState.errors.email.message}</span>}</div>
      <div className="field"><label htmlFor="contact-phone">Phone (optional)</label><input id="contact-phone" type="tel" {...form.register('phone')} placeholder="+91" data-testid="input-phone" /></div>
      <div className="field"><label htmlFor="contact-subject">I’m writing about</label><select id="contact-subject" {...form.register('subject')} data-testid="select-subject"><option value="">Select one</option><option>Distribution enquiry</option><option>Product question</option><option>Partnership</option><option>Something else</option></select>{form.formState.errors.subject && <span className="form-error">{form.formState.errors.subject.message}</span>}</div>
      <div className="field full"><label htmlFor="contact-message">A little more</label><textarea id="contact-message" {...form.register('message')} placeholder="Tell us what you have in mind…" data-testid="input-message" />{form.formState.errors.message && <span className="form-error">{form.formState.errors.message.message}</span>}</div>
      <div className="field full"><button type="submit" className="btn" data-testid="button-submit-contact">Open email draft <ArrowRight size={15} /></button></div>
      <p className="form-note">This preview uses a sample recipient. Replace the contact email with your company inbox before publishing.</p>
    </form></Form></section>
  </>;
}

function RoutedErrorBoundary({ children }: { children: ReactNode }) {
  const [location] = useLocation();
  return <ErrorBoundary resetKey={location}>{children}</ErrorBoundary>;
}

function Router() {
  return <RoutedErrorBoundary><SiteLayout><Switch>
    <Route path="/" component={HomePage} />
    <Route path="/about" component={AboutPage} />
    <Route path="/products" component={ProductsPage} />
    <Route path="/quality" component={QualityPage} />
    <Route path="/recipes" component={RecipesPage} />
    <Route path="/our-story" component={OurStoryPage} />
    <Route path="/gallery" component={GalleryPage} />
    <Route path="/contact" component={ContactPage} />
    <Route component={NotFound} />
  </Switch></SiteLayout></RoutedErrorBoundary>;
}

function App() {
  return <QueryClientProvider client={queryClient}><TooltipProvider><WouterRouter base={import.meta.env.BASE_URL.replace(/\/$/, '')}><Router /></WouterRouter><Toaster /></TooltipProvider></QueryClientProvider>;
}

export default App;
