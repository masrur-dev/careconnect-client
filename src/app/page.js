
import Link from "next/link";
import RecentEvents from "@/components/RecentEvents";

export default function Home() {
  return (
    <>
      {/* Hero Section */}
      <section className="bg-base-200 py-24">
        <div className="container-custom text-center">
          <span className="badge badge-primary mb-6">
            Together We Make a Difference
          </span>

          <h1 className="mx-auto max-w-4xl text-4xl font-bold leading-tight md:text-6xl">
            Small Actions.
            <span className="text-primary">
              {" "}Big Community Impact.
            </span>
          </h1>

          <p className="mx-auto mt-6 max-w-2xl text-lg leading-8 text-base-content/70">
            Discover meaningful events, support local
            communities, and create positive change
            with people around you.
          </p>

          <div className="mt-9 flex flex-wrap justify-center gap-4">
            <Link
              href="/events"
              className="btn btn-primary"
            >
              Explore Events
            </Link>

            <Link
              href="/create-event"
              className="btn btn-outline"
            >
              Create Event
            </Link>
          </div>
        </div>
      </section>

      {/* Recent Upcoming Events Section */}
      <RecentEvents />
    </>
  );
}
