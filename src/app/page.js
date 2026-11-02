import Link from "next/link";
import { ArrowRight, CalendarDays, HeartHandshake, MapPin, Sparkles, UsersRound } from "lucide-react";
import RecentEvents from "@/components/RecentEvents";
import { CommunityStats, FeaturesSection, GallerySection, NewsletterSection } from "@/components/HomeExtraSections";

const highlights = [
  { icon: CalendarDays, label: "Find an event", detail: "See what's happening nearby" },
  { icon: HeartHandshake, label: "Meet your people", detail: "Make a difference together" },
  { icon: MapPin, label: "Help locally", detail: "Show up for your community" },
];

export default function Home() {
  return (
    <>
      <section className="home-hero relative isolate overflow-hidden">
        <div className="hero-orb hero-orb-one" aria-hidden="true" />
        <div className="hero-orb hero-orb-two" aria-hidden="true" />
        <div className="container-custom relative grid min-h-[610px] items-center gap-14 py-20 lg:grid-cols-[1.1fr_0.9fr] lg:py-24">
          <div className="max-w-2xl">
            <div className="hero-eyebrow mb-7 inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm font-semibold">
              <Sparkles size={16} /> Good things happen together
            </div>
            <h1 className="text-5xl font-bold leading-[1.08] tracking-tight sm:text-6xl lg:text-7xl">
              Make room for <span className="hero-highlight">good</span> in your day.
            </h1>
            <p className="mt-6 max-w-xl text-lg leading-8 text-base-content/70">
              Find a local cause, meet people who care, and turn a little of your time into something meaningful.
            </p>
            <div className="mt-9 flex flex-wrap gap-3">
              <Link href="/events" className="btn btn-primary btn-lg rounded-full px-7 shadow-lg shadow-primary/20">
                Explore events <ArrowRight size={18} />
              </Link>
              <Link href="/create-event" className="btn btn-ghost btn-lg rounded-full border border-base-content/15 px-7">
                Start an event
              </Link>
            </div>
            <div className="mt-12 flex flex-wrap items-center gap-x-7 gap-y-3 text-sm font-medium text-base-content/65">
              <span className="inline-flex items-center gap-2"><span className="hero-dot" /> For every kind of helper</span>
              <span className="inline-flex items-center gap-2"><span className="hero-dot" /> Right in your community</span>
            </div>
          </div>

          <div className="hero-art relative mx-auto w-full max-w-[490px]">
            <div className="hero-art-backdrop" aria-hidden="true" />
            <div className="hero-note hero-note-top"><span className="hero-note-icon"><UsersRound size={19} /></span><span><strong>People-powered</strong><small>Every helping hand counts</small></span></div>
            <div className="hero-illustration" aria-hidden="true">
              <div className="sun" />
              <div className="hill hill-back" />
              <div className="hill hill-front" />
              <div className="person person-one"><i /><b /><span /></div>
              <div className="person person-two"><i /><b /><span /></div>
              <div className="person person-three"><i /><b /><span /></div>
              <div className="plant plant-one"><i /><i /><b /></div>
              <div className="plant plant-two"><i /><i /><b /></div>
              <div className="little-heart">♥</div>
            </div>
            <div className="hero-note hero-note-bottom"><MapPin size={17} /><span>Small acts, closer to home</span></div>
          </div>
        </div>
        <div className="container-custom relative pb-10">
          <div className="hero-highlights grid gap-3 rounded-2xl p-3 sm:grid-cols-3 sm:p-4">
            {highlights.map(({ icon: Icon, label, detail }) => (
              <div key={label} className="flex items-center gap-3 rounded-xl px-4 py-3">
                <span className="highlight-icon"><Icon size={20} /></span>
                <span><strong className="block text-sm">{label}</strong><small className="text-xs text-base-content/60">{detail}</small></span>
              </div>
            ))}
          </div>
        </div>
      </section>
      <FeaturesSection />
      <RecentEvents />
      <CommunityStats />
      <GallerySection />
      <NewsletterSection />
    </>
  );
}
