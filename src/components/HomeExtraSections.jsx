import Link from "next/link";
import { ArrowRight, CalendarCheck2, Heart, Mail, UsersRound } from "lucide-react";
import { connection } from "next/server";
import { apiUrl } from "@/lib/api";

const features = [
  {
    icon: CalendarCheck2,
    number: "01",
    title: "Find a cause that fits",
    description: "Browse upcoming cleanups, donation drives, and local initiatives in one place.",
  },
  {
    icon: UsersRound,
    number: "02",
    title: "Show up together",
    description: "Join an event and meet neighbors who care about making your community stronger.",
  },
  {
    icon: Heart,
    number: "03",
    title: "Make it happen",
    description: "Have an idea? Create an event and invite your community to take part.",
  },
];

const gallery = [
  { title: "Care for our green spaces", category: "Community cleanup", image: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?auto=format&fit=crop&w=900&q=85", shape: "gallery-tall" },
  { title: "A little help goes a long way", category: "Donation drive", image: "https://images.unsplash.com/photo-1469571486292-0ba58a3f068b?auto=format&fit=crop&w=900&q=85", shape: "" },
  { title: "Growing a greener future", category: "Tree plantation", image: "https://images.unsplash.com/photo-1416879595882-3373a0480b5b?auto=format&fit=crop&w=900&q=85", shape: "" },
  { title: "Neighbors helping neighbors", category: "Local outreach", image: "https://images.unsplash.com/photo-1593113598332-cd288d649433?auto=format&fit=crop&w=900&q=85", shape: "gallery-wide" },
];

export function FeaturesSection() {
  return (
    <section className="bg-base-200/55 py-20 md:py-24">
      <div className="container-custom">
        <div className="mb-12 grid gap-5 md:grid-cols-[1fr_auto] md:items-end">
          <div>
            <span className="section-kicker">A simpler way to give back</span>
            <h2 className="section-heading mt-3">Good starts with <span className="text-primary">one step.</span></h2>
          </div>
          <p className="max-w-md leading-7 text-base-content/65">From finding the right event to bringing an idea to life, CareConnect makes local action feel easy.</p>
        </div>
        <div className="grid gap-4 md:grid-cols-3">
          {features.map(({ icon: Icon, number, title, description }) => (
            <article key={number} className="feature-card rounded-2xl border border-base-300/70 bg-base-100 p-7">
              <div className="mb-9 flex items-center justify-between">
                <span className="feature-icon"><Icon size={22} /></span>
                <span className="text-sm font-semibold tracking-widest text-base-content/30">{number}</span>
              </div>
              <h3 className="text-xl font-bold">{title}</h3>
              <p className="mt-3 leading-7 text-base-content/65">{description}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

export async function CommunityStats() {
  await connection();

  let stats;

  try {
    const response = await fetch(apiUrl("/stats"), { cache: "no-store" });
    if (!response.ok) throw new Error("Failed to fetch community statistics");
    stats = await response.json();
  } catch (error) {
    console.error("Failed to load community stats:", error);
    return null;
  }

  const items = [
    { label: "Upcoming events", value: stats.upcomingEvents, icon: CalendarCheck2 },
    { label: "Volunteer sign-ups", value: stats.participations, icon: Heart },
    { label: "Community members", value: stats.members, icon: UsersRound },
  ];

  return (
    <section className="bg-base-100 py-12 md:py-16">
      <div className="container-custom">
        <div className="mb-8 text-center">
          <span className="section-kicker">Small actions add up</span>
          <h2 className="section-heading mt-3">Our community, <span className="text-primary">in action.</span></h2>
        </div>
        <div className="grid gap-4 sm:grid-cols-3">
          {items.map(({ label, value, icon: Icon }) => (
            <div key={label} className="flex items-center gap-4 rounded-2xl border border-base-300/70 bg-base-100 p-6 shadow-sm">
              <span className="feature-icon"><Icon size={22} /></span>
              <div>
                <p className="text-3xl font-bold tabular-nums">{Number(value || 0).toLocaleString()}</p>
                <p className="mt-1 text-sm text-base-content/65">{label}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export function GallerySection() {
  return (
    <section className="bg-base-100 py-20 md:py-24">
      <div className="container-custom">
        <div className="mb-10 flex flex-wrap items-end justify-between gap-5">
          <div>
            <span className="section-kicker">Little moments, real impact</span>
            <h2 className="section-heading mt-3">Community in <span className="text-primary">action.</span></h2>
          </div>
          <Link href="/events" className="btn btn-ghost rounded-full">Find an event <ArrowRight size={17} /></Link>
        </div>
        <div className="gallery-grid">
          {gallery.map((item) => (
            <article key={item.title} className={`gallery-item ${item.shape}`} style={{ backgroundImage: `linear-gradient(180deg, transparent 35%, rgb(14 32 24 / 78%)), url("${item.image}")` }}>
              <div className="gallery-caption"><span>{item.category}</span><h3>{item.title}</h3></div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

export function NewsletterSection() {
  return (
    <section className="bg-base-100 pb-20 md:pb-24">
      <div className="container-custom">
        <div className="newsletter-panel relative grid gap-8 overflow-hidden rounded-3xl px-6 py-10 md:grid-cols-[1fr_auto] md:items-center md:px-12 md:py-12">
          <div className="newsletter-copy relative z-10">
            <span className="newsletter-kicker"><Mail size={15} /> A little good in your inbox</span>
            <h2 className="mt-4 text-3xl font-bold tracking-tight md:text-4xl">Stay close to your community.</h2>
            <p className="mt-3 max-w-xl leading-7 opacity-75">Get occasional updates about upcoming events and ways to lend a hand nearby.</p>
          </div>
          <div className="newsletter-form join relative z-10">
            <div className="newsletter-field">
              <label className="input validator join-item newsletter-input">
                <Mail className="h-[1em] shrink-0 opacity-55" size={18} aria-hidden="true" />
                <input id="newsletter-email" name="email" type="email" placeholder="mail@site.com" autoComplete="email" required aria-label="Email address" />
              </label>
              <div className="validator-hint hidden">Enter a valid email address</div>
            </div>
            <button type="button" className="btn btn-neutral newsletter-button join-item">Join us <ArrowRight size={17} /></button>
            <p className="newsletter-note">No spam, just good things happening nearby.</p>
          </div>
        </div>
      </div>
    </section>
  );
}
