import { useLocation, Router, Route, Switch } from 'wouter';
import { motion, useReducedMotion } from 'framer-motion';
import HomePage from './vanam/Home';
import { CustomCursor, MobileExplore, Preloader, ScrollProgress, ScrollToTop, SiteFooter, SiteHeader } from './vanam/Chrome';
import { ContactPage, DistributorsPage, GalleryPage, JournalArticle, JournalPage, QualityPage, RecipeDetail, RecipesPage, SourcingPage, StoryPage } from './vanam/EditorialPages';
import { OriginDetail, OriginsIndex, SpiceDetail, SpicesIndex } from './vanam/SpicePages';
import './vanam/site.css';

function NotFoundPage() {
  return <main className="v-not-found"><span className="v-kicker">THE SPICE HOUSE</span><h1>This chapter isn’t here.</h1><p>That page may have moved. Return to the VANAM collection and continue exploring.</p><a className="v-button v-button-maroon" href="/spices">Visit the collection</a></main>;
}

function RouteContent() {
  const [path] = useLocation();
  const reduceMotion = useReducedMotion();

  return (
    <>
      <ScrollToTop />
      <motion.div key={path} className="v-route-surface" initial={reduceMotion ? false : { opacity: 0, y: 9 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: reduceMotion ? 0 : 0.42, ease: [0.2, 0.7, 0.2, 1] }}>
        <Switch>
          <Route path="/" component={HomePage} />
          <Route path="/spices" component={SpicesIndex} />
          <Route path="/spices/:slug">{(params) => <SpiceDetail slug={params.slug} />}</Route>
          <Route path="/origins" component={OriginsIndex} />
          <Route path="/origins/:slug">{(params) => <OriginDetail slug={params.slug} />}</Route>
          <Route path="/our-story" component={StoryPage} />
          <Route path="/about" component={StoryPage} />
          <Route path="/quality" component={QualityPage} />
          <Route path="/farm-sourcing" component={SourcingPage} />
          <Route path="/recipes" component={RecipesPage} />
          <Route path="/recipes/:slug">{(params) => <RecipeDetail slug={params.slug} />}</Route>
          <Route path="/journal" component={JournalPage} />
          <Route path="/journal/:slug">{(params) => <JournalArticle slug={params.slug} />}</Route>
          <Route path="/gallery" component={GalleryPage} />
          <Route path="/contact" component={ContactPage} />
          <Route path="/distributors" component={DistributorsPage} />
          <Route component={NotFoundPage} />
        </Switch>
      </motion.div>
    </>
  );
}

export default function App() {
  return (
    <Router>
      <div className="v-app">
        <a className="v-skip-link" href="#main-content">Skip to content</a>
        <Preloader />
        <ScrollProgress />
        <CustomCursor />
        <SiteHeader />
        <div id="main-content"><RouteContent /></div>
        <SiteFooter />
        <MobileExplore />
      </div>
    </Router>
  );
}
