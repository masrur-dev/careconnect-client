
import { Suspense } from "react";
import { connection } from "next/server";
import Link from "next/link";
import EventCard from "./EventCard";
import { apiUrl } from "@/lib/api";

function RecentEventsSkeleton() {
  return (
    <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
      {Array.from({ length: 6 }).map((_, index) => (
        <div
          key={index}
          className="rounded-xl bg-base-200 p-4 shadow-sm"
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

async function RecentEventsList() {
  await connection();

  let events = [];

  try {
    const response = await fetch(apiUrl("/events/recent"), {
      cache: "no-store",
    });

    if (!response.ok) {
      throw new Error("Failed to fetch recent events");
    }

    events = await response.json();
  } catch (error) {
    console.error("Failed to load recent events:", error);

    return (
      <p className="text-center text-error">
        Failed to load recent events. Please try again.
      </p>
    );
  }

  if (events.length === 0) {
    return (
      <p className="py-10 text-center text-base-content/70">
        No upcoming events available.
      </p>
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

export default function RecentEvents() {
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

        <Suspense fallback={<RecentEventsSkeleton />}>
          <RecentEventsList />
        </Suspense>

        <div className="mt-10 text-center">
          <Link href="/events" className="btn btn-primary">
            View All Events
          </Link>
        </div>
      </div>
    </section>
  );
}
