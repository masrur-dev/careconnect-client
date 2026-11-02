
import EventCard from "@/components/EventCard";

// Fetch Events from Express Server
async function getEvents() {
  const response = await fetch(
    "http://localhost:5000/events",
    {
      cache: "no-store",
    }
  );

  if (!response.ok) {
    throw new Error("Failed to fetch events");
  }

  return response.json();
}

// Upcoming Events Page
export default async function UpcomingEventsPage() {
  let events = [];
  let error = false;

  try {
    events = await getEvents();
  } catch (err) {
    console.error("Error loading events:", err);
    error = true;
  }

  return (
    <section className="min-h-screen bg-base-200 py-16">
      <div className="container-custom">

        {/* Page Heading */}
        <div className="mb-12 text-center">
          <h1 className="mb-4 text-4xl font-bold">
            Upcoming Events
          </h1>

          <p className="mx-auto max-w-2xl text-base-content/70">
            Discover community service events,
            connect with volunteers, and make
            a positive impact together.
          </p>
        </div>

        {/* Events Section */}
        {error ? (
          <p className="text-center text-error">
            Failed to load events. Please try again.
          </p>
        ) : events.length === 0 ? (
          <div className="py-16 text-center">
            <h2 className="text-2xl font-semibold">
              No Upcoming Events
            </h2>

            <p className="mt-3 text-base-content/70">
              There are no upcoming events available
              right now.
            </p>
          </div>
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

      </div>
    </section>
  );
}
