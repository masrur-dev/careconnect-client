
"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import {
  ArrowUpRight,
  CalendarDays,
  MapPin,
} from "lucide-react";

function isValidImageUrl(url) {
  if (!url || typeof url !== "string") {
    return false;
  }

  try {
    const parsedUrl = new URL(url);

    return (
      ["http:", "https:"].includes(parsedUrl.protocol) &&
      !["example.com", "www.example.com"].includes(
        parsedUrl.hostname.toLowerCase()
      )
    );
  } catch {
    return false;
  }
}

function formatEventDate(eventDate) {
  if (!eventDate) {
    return "Date not available";
  }

  const parsedDate = new Date(
    /^\d{4}-\d{2}-\d{2}$/.test(eventDate)
      ? `${eventDate}T00:00:00Z`
      : eventDate
  );

  if (Number.isNaN(parsedDate.getTime())) {
    return "Date not available";
  }

  return parsedDate.toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
    timeZone: "UTC",
  });
}

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

  const [failedImageUrl, setFailedImageUrl] = useState(null);
  const [failedFallbackUrl, setFailedFallbackUrl] = useState(null);

  const eventTypeLabel = eventType || "Community Event";
  const eventKind = eventTypeLabel.toLowerCase();

  const fallbackImage = eventKind.includes("plant")
    ? "https://images.unsplash.com/photo-1416879595882-3373a0480b5b?auto=format&fit=crop&w=1000&q=85"
    : eventKind.includes("donat") ||
        eventKind.includes("blanket")
      ? "https://images.unsplash.com/photo-1593113598332-cd288d649433?auto=format&fit=crop&w=1000&q=85"
      : eventKind.includes("clean")
        ? "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?auto=format&fit=crop&w=1000&q=85"
        : "https://images.unsplash.com/photo-1469571486292-0ba58a3f068b?auto=format&fit=crop&w=1000&q=85";

  const hasValidImage = isValidImageUrl(thumbnail);

  const imageError = failedImageUrl === thumbnail;

  const fallbackImageError =
    failedFallbackUrl === fallbackImage;

  const formattedDate = formatEventDate(eventDate);

  const shortDescription =
    description?.length > 110
      ? `${description.slice(0, 110)}...`
      : description || "Discover this community event.";

  return (
    <div className="card h-full overflow-hidden rounded-2xl border border-base-300/70 bg-base-100 shadow-sm transition duration-300 hover:-translate-y-1 hover:shadow-xl">

      {/* Event Image */}
      <figure className="group relative h-52 overflow-hidden bg-base-200">
        {hasValidImage && !imageError ? (
          <Image
            src={thumbnail}
            alt={title || "Community event"}
            width={800}
            height={500}
            unoptimized
            className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
            onError={() => setFailedImageUrl(thumbnail)}
          />
        ) : !fallbackImageError ? (
          <Image
            src={fallbackImage}
            alt={`${eventTypeLabel} volunteer event`}
            width={1000}
            height={600}
            unoptimized
            className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
            onError={() => setFailedFallbackUrl(fallbackImage)}
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-primary/10 via-base-200 to-secondary/15 px-4 text-center text-base-content/60">
            <span className="rounded-full bg-base-100/80 px-4 py-2 text-sm font-medium">
              {eventTypeLabel}
            </span>
          </div>
        )}
      </figure>

      {/* Event Information */}
      <div className="card-body flex flex-col gap-3 p-6">

        {/* Event Type */}
        <div>
          <span className="badge badge-primary badge-outline rounded-full px-3 py-3 font-medium">
            {eventTypeLabel}
          </span>
        </div>

        {/* Event Title */}
        <h2 className="card-title text-xl leading-snug">
          {title || "Untitled Event"}
        </h2>

        {/* Description */}
        <p className="text-sm leading-6 text-base-content/70">
          {shortDescription}
        </p>

        {/* Location and Date */}
        <div className="mt-2 space-y-2 border-t border-base-200 pt-4 text-sm text-base-content/70">
          <p className="flex items-start gap-2">
            <MapPin
              size={16}
              className="mt-0.5 shrink-0 text-primary"
            />
            <span>{location || "Location not available"}</span>
          </p>

          <p className="flex items-start gap-2">
            <CalendarDays
              size={16}
              className="mt-0.5 shrink-0 text-primary"
            />
            <span>{formattedDate}</span>
          </p>
        </div>

        {/* View Event Button */}
        <div className="card-actions mt-auto pt-4">
          <Link
            href={`/events/${_id}`}
            className="btn btn-primary w-full rounded-xl"
          >
            View Event
            <ArrowUpRight size={17} />
          </Link>
        </div>
      </div>
    </div>
  );
}
