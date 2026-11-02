
import { Suspense } from "react";
import { connection } from "next/server";
import EventCard from "@/components/EventCard";
import { apiUrl } from "@/lib/api";

async function getEvents() {
  const response = await fetch(apiUrl("/events"), {
    cache: "no-store",
  });

  if (!response.ok) {
    throw new Error("Failed to fetch events");
  }

  return response.json();
}

function EventsSkeleton() {
  return (
    <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
      {Array.from({ length: 6 }).map((_, index) => (
        <div
          key={index}
          className="rounded-xl bg-base-100 p-4 shadow-sm"
        >
          <div className="skeleton mb-4 h-48 w-full" />
          <div className="skeleton mb-3 h-6 w-3/4" />
          <div className="skeleton mb-3 h-4 w-1/2" />
          <div className="skeleton h-10 w-full" />
        </div>
      ))}
    </div>
  );
}

async function EventsList() {
  await connection();

  let events = [];

  try {
    events = await getEvents();
  } catch (error) {
    console.error("Failed to load events:", error);

    return (
      <p className="text-center text-error">
        Failed to load events. Please try again.
      </p>
    );
  }

  if (events.length === 0) {
    return (
      <div className="py-16 text-center">
        <h2 className="text-2xl font-semibold">
          No Upcoming Events
        </h2>

        <p className="mt-3 text-base-content/70">
          There are no upcoming events available right now.
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
      {events.map((event) => (
        <EventCard key={event._id} event={event} />
      ))}
    </div>
  );
}

export default function UpcomingEventsPage() {
  return (
    <section className="min-h-screen bg-base-200/60 py-16 md:py-20">
      <div className="container-custom">

        <div className="mb-12 rounded-3xl border border-base-300/60 bg-base-100 px-6 py-10 text-center shadow-sm md:px-12 md:py-14">
          <span className="badge badge-primary badge-outline mb-4 rounded-full px-4 py-3">Find your next good thing</span>
          <h1 className="mb-4 text-4xl font-bold tracking-tight md:text-5xl">
            Upcoming <span className="text-primary">Events</span>
          </h1>

          <p className="mx-auto max-w-2xl text-base leading-7 text-base-content/70">
            Discover community service events, connect with
            volunteers, and make a positive impact together.
          </p>
        </div>

        <Suspense fallback={<EventsSkeleton />}>
          <EventsList />
        </Suspense>

      </div>
    </section>
  );
}
