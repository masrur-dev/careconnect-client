"use client";

import { useEffect, useState } from "react";
import { Search } from "lucide-react";
import EventCard from "@/components/EventCard";
import { apiUrl } from "@/lib/api";

export default function EventBrowser({ initialEvents }) {
  const [events, setEvents] = useState(initialEvents);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const query = search.trim();

    if (!query) {
      setEvents(initialEvents);
      setError("");
      setLoading(false);
      return;
    }

    const controller = new AbortController();
    setLoading(true);
    setError("");

    const timeout = setTimeout(async () => {
      try {
        const response = await fetch(
          apiUrl(`/events?search=${encodeURIComponent(query)}`),
          { cache: "no-store", signal: controller.signal },
        );

        if (!response.ok) throw new Error("Unable to search events.");

        const results = await response.json();
        if (!controller.signal.aborted) setEvents(results);
      } catch (searchError) {
        if (!controller.signal.aborted) {
          console.error("Event search error:", searchError);
          setError("Search is temporarily unavailable. Please try again.");
        }
      } finally {
        if (!controller.signal.aborted) setLoading(false);
      }
    }, 250);

    return () => {
      clearTimeout(timeout);
      controller.abort();
    };
  }, [search, initialEvents]);

  return (
    <div>
      <div className="mb-7 flex flex-wrap items-center justify-between gap-4">
        <label className="input input-bordered flex min-w-[min(100%,20rem)] flex-1 items-center gap-2 rounded-xl bg-base-100 sm:max-w-md">
          <Search size={18} className="shrink-0 text-base-content/50" aria-hidden="true" />
          <span className="sr-only">Search upcoming events</span>
          <input
            type="search"
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            placeholder="Search events or locations"
            aria-label="Search events or locations"
            className="grow"
          />
        </label>
        <p className="text-sm text-base-content/60" aria-live="polite">
          {loading ? "Searching…" : `${events.length} ${events.length === 1 ? "event" : "events"}`}
        </p>
      </div>

      {error && <p role="alert" className="alert alert-warning mb-5">{error}</p>}

      {events.length > 0 ? (
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          {events.map((event) => <EventCard key={event._id} event={event} />)}
        </div>
      ) : (
        <div className="rounded-2xl border border-base-300 bg-base-100 px-6 py-14 text-center">
          <h2 className="text-2xl font-semibold">No matching events</h2>
          <p className="mt-3 text-base-content/70">Try another title, description, or location.</p>
        </div>
      )}
    </div>
  );
}
