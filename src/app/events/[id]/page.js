
import Link from "next/link";
import Image from "next/image";
import { CalendarDays } from "lucide-react";
import { Suspense } from "react";
import JoinEventButton from "@/components/JoinEventButton";
import ShareEventButton from "@/components/ShareEventButton";
import { apiUrl } from "@/lib/api";

// Fetch single event from Express API
async function EventContent({ params }) {
  const { id } = await params;

  let event = null;

  try {
    const response = await fetch(apiUrl(`/events/${id}`), {
      cache: "no-store",
    });

    if (response.ok) {
      event = await response.json();
    }
  } catch (error) {
    console.error("Event details error:", error);
  }

  // Event not found
  if (!event) {
    return (
      <section className="py-24 text-center">
        <h1 className="text-3xl font-bold">
          Event Not Found
        </h1>

        <Link
          href="/events"
          className="btn btn-primary mt-6"
        >
          Back to Events
        </Link>
      </section>
    );
  }

  // Format event date
  const formattedDate = new Date(
    `${event.eventDate}T00:00:00Z`
  ).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
    timeZone: "UTC",
  });

  return (
    <section className="min-h-screen bg-base-200 py-14">
      <div className="container-custom">

        {/* Back Button */}
        <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
          <Link href="/events" className="btn btn-ghost rounded-full">
            ← Back to Events
          </Link>
          <ShareEventButton title={event.title} />
        </div>

        {/* Event Card */}
        <div className="overflow-hidden rounded-2xl bg-base-100 shadow-lg">

          {/* Event Thumbnail */}
          <div className="relative h-64 overflow-hidden bg-gradient-to-br from-primary/15 via-base-200 to-secondary/20 md:h-[420px]">
            {event.thumbnail && !event.thumbnail.includes("example.com") ? (
              <Image
                src={event.thumbnail}
                alt={`${event.title} event thumbnail`}
                width={1600}
                height={900}
                unoptimized
                preload
                className="h-full w-full object-cover"
              />
            ) : (
              <div className="flex h-full items-center justify-center text-lg font-semibold text-base-content/55">
                {event.eventType || "Community Event"}
              </div>
            )}
            <div className="pointer-events-none absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-black/35 to-transparent" />
          </div>

          <div className="p-6 md:p-10">

            {/* Event Type */}
            <span className="badge badge-primary mb-4">
              {event.eventType}
            </span>

            {/* Event Title */}
            <h1 className="mb-6 text-3xl font-bold md:text-4xl">
              {event.title}
            </h1>

            {/* Event Information */}
            <div className="mb-8 grid gap-4 md:grid-cols-2">

              {/* Event Location */}
              <div className="rounded-xl bg-base-200 p-5">
                <p className="text-sm opacity-70">
                  Event Location
                </p>

                <p className="mt-2 font-semibold">
                  📍 {event.location}
                </p>
              </div>

              {/* Event Date */}
              <div className="rounded-xl bg-base-200 p-5">
                <p className="text-sm opacity-70">
                  Event Date
                </p>

                <p className="mt-2 flex items-center gap-2 font-semibold">
                  <CalendarDays size={18} className="shrink-0 text-primary" aria-hidden="true" />
                  {formattedDate}
                </p>
              </div>

            </div>

            {/* Event Description */}
            <h2 className="mb-4 text-2xl font-bold">
              About This Event
            </h2>

            <p className="mb-8 whitespace-pre-line leading-8 text-base-content/75">
              {event.description}
            </p>

            {/* Organizer */}
            <p className="mb-6 text-sm text-base-content/70">
              Organized by: {event.creatorEmail}
            </p>

            {/* Join Event Button */}
            <JoinEventButton eventId={String(event._id)} />

          </div>
        </div>
      </div>
    </section>
  );
}

// Event Details Page
export default function EventDetailsPage({ params }) {
  return (
    <Suspense
      fallback={
        <div className="py-24 text-center">
          <span className="loading loading-spinner loading-lg text-primary" />
          <p className="mt-3">
            Loading event details...
          </p>
        </div>
      }
    >
      <EventContent params={params} />
    </Suspense>
  );
}
