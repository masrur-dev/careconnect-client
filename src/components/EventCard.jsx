
"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
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

  return (
    <div className="card h-full overflow-hidden border border-base-300 bg-base-100 shadow-md transition-shadow hover:shadow-xl">

      {/* Event Image */}
     <figure className="relative h-52 bg-base-200">
  {hasValidImage && !imageError ? (
    <Image
  src={event.thumbnail}
  alt={event.title}
  width={800}
  height={500}
  unoptimized
  className="h-48 w-full object-cover"
  onError={() => setImageError(true)}
/>
  ) : (
    <div className="flex h-full w-full items-center justify-center text-base-content/50">
      Community Event
    </div>
  )}
</figure>

      {/* Event Information */}
      <div className="card-body">

        {/* Event Type */}
        <div className="badge badge-primary badge-outline">
          {eventType}
        </div>

        {/* Event Title */}
        <h2 className="card-title text-xl">
          {title}
        </h2>

        {/* Description */}
        <p className="text-sm leading-6 text-base-content/70">
          {shortDescription}
        </p>

        {/* Location and Date */}
        <div className="mt-3 space-y-2 text-sm">
          <p>📍 {location}</p>
          <p>📅 {formattedDate}</p>
        </div>

        {/* View Details Button */}
        <div className="card-actions mt-auto pt-4">
          <Link
            href={`/events/${_id}`}
            className="btn btn-primary w-full"
          >
            View Event
          </Link>
        </div>

      </div>
    </div>
  );
}
