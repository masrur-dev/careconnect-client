"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Search } from "lucide-react";
import { authClient } from "@/lib/auth-client";
import { apiFetch, clearJwt } from "@/lib/api";
import { useToast } from "@/components/ToastProvider";

export default function ManageEventsPage() {
  const toast = useToast();
  const router = useRouter();
  const { data: session, isPending } = authClient.useSession();

  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");

  const [selectedEvent, setSelectedEvent] = useState(null);
  const [deleting, setDeleting] = useState(false);

  const userId = session?.user?.id;
  const filteredEvents = events.filter((event) => {
    const query = search.trim().toLowerCase();
    if (!query) return true;
    return [event.title, event.eventType, event.location]
      .some((value) => value?.toLowerCase().includes(query));
  });

  // Protect private route
  useEffect(() => {
    if (!isPending && !userId) {
      router.replace("/login");
    }
  }, [isPending, userId, router]);

  // Fetch user's created events
  useEffect(() => {
    if (isPending || !userId) return;

    const controller = new AbortController();

    async function loadMyEvents() {
      setLoading(true);
      setError("");

      try {
        const response = await apiFetch("/my-events", {
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
          throw new Error("Failed to load your events.");
        }

        const data = await response.json();

        if (!controller.signal.aborted) {
          setEvents(data);
        }
      } catch (err) {
        if (!controller.signal.aborted) {
          setError(err.message);
        }
      } finally {
        if (!controller.signal.aborted) {
          setLoading(false);
        }
      }
    }

    loadMyEvents();

    return () => controller.abort();
  }, [isPending, userId, router]);

  // Delete selected event
  const handleDelete = async () => {
    if (!selectedEvent || deleting) return;

    setDeleting(true);

    try {
      const response = await apiFetch(
        `/events/${selectedEvent._id}`,
        {
          method: "DELETE",
        },
      );

      const result = await response.json();

      if (!response.ok) {
        toast.error(result.message || "Failed to delete event.");
        return;
      }

      setEvents((previous) =>
        previous.filter((event) => event._id !== selectedEvent._id),
      );

      setSelectedEvent(null);
      toast.success("Event deleted successfully!");
    } catch (err) {
      console.error("Delete event error:", err);
      toast.error("Could not connect to the server.");
    } finally {
      setDeleting(false);
    }
  };

  // Loading state
  if (isPending || (userId && loading)) {
    return (
      <div className="flex min-h-[70vh] items-center justify-center">
        <span className="loading loading-spinner loading-lg text-primary" />
      </div>
    );
  }

  if (!userId) return null;

  return (
    <section className="min-h-screen bg-base-200 py-14">

      <div className="container-custom">
        {/* Heading */}
        <div className="mb-8 flex flex-wrap items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold">Manage My Events</h1>

            <p className="mt-2 text-base-content/70">
              View and manage your created events.
            </p>
          </div>

          <Link href="/create-event" className="btn btn-primary">
            + Create Event
          </Link>
        </div>

        {/* Error */}
        {error ? (
          <div role="alert" className="alert alert-error">
            {error}
          </div>
        ) : events.length === 0 ? (
          <div className="rounded-xl bg-base-100 p-10 text-center">
            <h2 className="text-xl font-semibold">No Events Created Yet</h2>

            <p className="mt-3 text-base-content/70">
              Start organizing your first community event.
            </p>

            <Link href="/create-event" className="btn btn-primary mt-6">
              Create Your First Event
            </Link>
          </div>
        ) : (
          <>
          <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
            <label className="input input-bordered flex w-full max-w-md items-center gap-2 rounded-xl bg-base-100">
              <Search size={18} className="shrink-0 text-base-content/50" aria-hidden="true" />
              <input
                type="search"
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                placeholder="Search title, type, or location"
                aria-label="Search your events"
                className="grow"
              />
            </label>
            <span className="text-sm text-base-content/60" aria-live="polite">
              Showing {filteredEvents.length} of {events.length} events
            </span>
          </div>
          <div className="overflow-x-auto rounded-xl border border-base-300 bg-base-100 shadow-sm">
            <table className="table">
              <thead>
                <tr>
                  <th>Event</th>
                  <th>Type</th>
                  <th>Date</th>
                  <th>Location</th>
                  <th>Actions</th>
                </tr>
              </thead>

              <tbody>
                {filteredEvents.length === 0 ? (
                  <tr><td colSpan={5} className="py-10 text-center text-base-content/60">No events match your search.</td></tr>
                ) : filteredEvents.map((event) => (
                  <tr key={event._id}>
                    <td>
                      <Link
                        href={`/events/${event._id}`}
                        className="font-semibold hover:text-primary"
                      >
                        {event.title}
                      </Link>
                    </td>

                    <td>{event.eventType}</td>
                    <td>{event.eventDate}</td>
                    <td>{event.location}</td>

                    <td>
                      <div className="flex gap-2">
                        {/* Edit will be enabled next */}
                        <Link
                          href={`/update-event/${event._id}`}
                          className="btn btn-outline btn-info btn-sm"
                        >
                          Edit
                        </Link>

                        {/* Delete */}
                        <button
                          type="button"
                          onClick={() => setSelectedEvent(event)}
                          className="btn btn-outline btn-error btn-sm"
                        >
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          </>
        )}
      </div>

      {/* DaisyUI Delete Confirmation Modal */}
      {selectedEvent && (
        <div
          className="modal modal-open"
          role="dialog"
          aria-modal="true"
          aria-labelledby="delete-event-title"
        >
          <div className="modal-box">
            <h3 id="delete-event-title" className="text-xl font-bold">
              Delete Event?
            </h3>

            <p className="mt-4">
              Are you sure you want to delete{" "}
              <strong>{selectedEvent.title}</strong>?
            </p>

            <p className="mt-2 text-sm text-error">
              This action cannot be undone.
            </p>

            <div className="modal-action">
              <button
                type="button"
                disabled={deleting}
                onClick={() => setSelectedEvent(null)}
                className="btn btn-ghost"
              >
                Cancel
              </button>

              <button
                type="button"
                disabled={deleting}
                onClick={handleDelete}
                className="btn btn-error"
              >
                {deleting ? (
                  <>
                    <span className="loading loading-spinner loading-sm" />
                    Deleting...
                  </>
                ) : (
                  "Yes, Delete"
                )}
              </button>
            </div>
          </div>

          <div
            className="modal-backdrop"
            onClick={() => {
              if (!deleting) setSelectedEvent(null);
            }}
          />
        </div>
      )}
    </section>
  );
}
