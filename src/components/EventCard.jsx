
"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { ArrowUpRight, CalendarDays, MapPin } from "lucide-react";
export default function EventCard({ event }) {
  const {
    _id,
    title,
    description,
    location,
    eventType,
    eventDate,
    thumbnail,
  } = event;

  // Format event date
  const formattedDate = new Date(
    `${eventDate}T00:00:00Z`
  ).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
    timeZone: "UTC",
  });

  // Short description
  const shortDescription =
    description?.length > 110
      ? `${description.slice(0, 110)}...`
      : description;

  // Check image URL
  const hasValidImage =
    thumbnail &&
    !thumbnail.includes("example.com");

  const [imageError, setImageError] = useState(false);
  const [fallbackImageError, setFallbackImageError] = useState(false);
  const eventTypeLabel = eventType || "Community event";
  const eventKind = eventTypeLabel.toLowerCase();
  const fallbackImage = eventKind.includes("plant")
    ? "https://images.unsplash.com/photo-1416879595882-3373a0480b5b?auto=format&fit=crop&w=1000&q=85"
    : eventKind.includes("donat") || eventKind.includes("blanket")
      ? "https://images.unsplash.com/photo-1593113598332-cd288d649433?auto=format&fit=crop&w=1000&q=85"
      : eventKind.includes("clean")
        ? "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?auto=format&fit=crop&w=1000&q=85"
        : "https://images.unsplash.com/photo-1469571486292-0ba58a3f068b?auto=format&fit=crop&w=1000&q=85";

  return (
    <div className="card h-full overflow-hidden rounded-2xl border border-base-300/70 bg-base-100 shadow-sm transition duration-300 hover:-translate-y-1 hover:shadow-xl">

      {/* Event Image */}
     <figure className="group relative h-52 bg-base-200">
  {hasValidImage && !imageError ? (
    <Image
  src={event.thumbnail}
  alt={event.title}
  width={800}
  height={500}
  unoptimized
  className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
  onError={() => setImageError(true)}
/>
  ) : !fallbackImageError ? (
    <Image
      src={fallbackImage}
      alt={`${eventTypeLabel} volunteer event`}
      width={1000}
      height={600}
      unoptimized
      className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
      onError={() => setFallbackImageError(true)}
    />
  ) : (
    <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-primary/10 via-base-200 to-secondary/15 text-base-content/50">
      <span className="rounded-full bg-base-100/80 px-4 py-2 text-sm font-medium">{eventTypeLabel}</span>
    </div>
  )}
</figure>

      {/* Event Information */}
      <div className="card-body gap-3 p-6">

        {/* Event Type */}
        <div className="badge badge-primary badge-outline rounded-full px-3 py-3 font-medium">
          {eventTypeLabel}
        </div>

        {/* Event Title */}
        <h2 className="card-title text-xl leading-snug">
          {title}
        </h2>

        {/* Description */}
        <p className="text-sm leading-6 text-base-content/70">
          {shortDescription}
        </p>

        {/* Location and Date */}
        <div className="mt-2 space-y-2 border-t border-base-200 pt-4 text-sm text-base-content/70">
          <p className="flex items-center gap-2"><MapPin size={16} className="shrink-0 text-primary" /> {location}</p>
          <p className="flex items-center gap-2"><CalendarDays size={16} className="shrink-0 text-primary" /> {formattedDate}</p>
        </div>

        {/* View Details Button */}
        <div className="card-actions mt-auto pt-4">
          <Link
            href={`/events/${_id}`}
            className="btn btn-primary w-full rounded-xl"
          >
            View Event <ArrowUpRight size={17} />
          </Link>
        </div>

      </div>
    </div>
  );
}
