
import Link from "next/link";
import EventCard from "./EventCard";

export default async function RecentEvents() {
  let events = [];

  try {
    const response = await fetch(
      "http://localhost:5000/events/recent",
      { cache: "no-store" }
    );

    if (!response.ok) {
      throw new Error("Failed to fetch recent events");
    }

    events = await response.json();
  } catch (error) {
    console.error("Error:", error);
  }

  return (
    <section className="bg-base-100 py-20">
      <div className="container-custom">

        <div className="mb-10 text-center">
          <h2 className="text-3xl font-bold">
            Recent Upcoming Events
          </h2>

          <p className="mt-3 text-base-content/70">
            Explore upcoming community activities.
          </p>
        </div>

        {events.length === 0 ? (
          <p className="text-center">
            No upcoming events available.
          </p>
        ) : (
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
            {events.map((event) => (
              <EventCard
                key={event._id}
                event={event}
              />
            ))}
          </div>
        )}

        <div className="mt-10 text-center">
          <Link
            href="/events"
            className="btn btn-primary"
          >
            View All Events
          </Link>
        </div>

      </div>
    </section>
  );
}
