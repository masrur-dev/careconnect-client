
"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { authClient } from "@/lib/auth-client";
import { apiFetch, clearJwt } from "@/lib/api";
import EventCard from "@/components/EventCard";
import LeaveJoinedEventButton from "@/components/LeaveJoinedEventButton";

export default function JoinedEventsPage() {
  const router = useRouter();
  const { data: session, isPending } = authClient.useSession();

  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [dateOrder, setDateOrder] = useState("soonest");

  const userId = session?.user?.id;
  const sortedEvents = [...events].sort((first, second) => {
    const difference = new Date(first.eventDate) - new Date(second.eventDate);
    return dateOrder === "latest" ? -difference : difference;
  });

  // Redirect users who are not logged in
  useEffect(() => {
    if (!isPending && !userId) {
      router.replace("/login");
    }
  }, [isPending, userId, router]);

  // Load logged-in user's joined events
  useEffect(() => {
    if (isPending) return;

    if (!userId) {
      return;
    }

    const controller = new AbortController();

    async function loadJoinedEvents() {
      setLoading(true);
      setError("");

      try {
        const response = await apiFetch("/my-joined-events", {
          method: "GET",
          cache: "no-store",
          signal: controller.signal,
        });

        if (response.status === 401) {
          clearJwt();
          router.replace("/login");
          return;
        }

        if (!response.ok) {
          throw new Error(
            response.status === 401
              ? "Your session has expired. Please login again."
              : "Failed to load joined events."
          );
        }

        const data = await response.json();

        if (!controller.signal.aborted) {
          setEvents(data);
        }
      } catch (err) {
        if (!controller.signal.aborted) {
          console.error("Joined events error:", err);
          setError(err.message);
        }
      } finally {
        if (!controller.signal.aborted) {
          setLoading(false);
        }
      }
    }

    loadJoinedEvents();

    return () => controller.abort();
  }, [isPending, userId, router]);

  // Loading session
  if (isPending || (userId && loading)) {
    return (
      <div className="flex min-h-[70vh] items-center justify-center">
        <span className="loading loading-spinner loading-lg text-primary" />
      </div>
    );
  }

  // Private route
  if (!userId) {
    return null;
  }

  return (
    <section className="min-h-screen bg-base-200 py-14">
      <div className="container-custom">

        {/* Page Heading */}
        <div className="mb-10 text-center">
          <h1 className="text-3xl font-bold md:text-4xl">
            My Joined Events
          </h1>

          <p className="mt-3 text-base-content/70">
            Discover the community events you have joined.
          </p>
        </div>

        {/* Error Message */}
        {error ? (
          <div role="alert" className="alert alert-error">
            <span>{error}</span>
          </div>
        ) : events.length === 0 ? (

          // Empty State
          <div className="mx-auto max-w-lg rounded-xl border border-base-300 bg-base-100 p-10 text-center">
            <h2 className="text-xl font-semibold">
              No Joined Events Yet
            </h2>

            <p className="mt-3 text-base-content/70">
              You have not joined any events yet.
              Explore upcoming events and get involved.
            </p>

            <Link
              href="/events"
              className="btn btn-primary mt-6"
            >
              Explore Events
            </Link>
          </div>

        ) : (

          // Joined Events Grid
          <>
          <div className="mb-5 flex justify-end">
            <label className="flex items-center gap-3 text-sm font-medium">
              Sort by date
              <select
                className="select select-bordered rounded-xl bg-base-100"
                value={dateOrder}
                onChange={(event) => setDateOrder(event.target.value)}
                aria-label="Sort joined events by date"
              >
                <option value="soonest">Soonest first</option>
                <option value="latest">Latest first</option>
              </select>
            </label>
          </div>
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {sortedEvents.map((event) => (
              <div key={event._id} className="flex flex-col gap-3">
                <EventCard event={event} />
                <LeaveJoinedEventButton
                  eventId={String(event._id)}
                  onLeave={(eventId) => setEvents((current) => current.filter((item) => String(item._id) !== eventId))}
                />
              </div>
            ))}
          </div>
          </>

        )}
      </div>
    </section>
  );
}
