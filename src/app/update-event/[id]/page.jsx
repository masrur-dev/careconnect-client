
"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { authClient } from "@/lib/auth-client";
import { apiFetch, apiUrl, clearJwt } from "@/lib/api";
import { toast, Toaster } from "sonner";

export default function UpdateEventPage() {
  const router = useRouter();
  const params = useParams();
  const eventId = params.id;

  const { data: session, isPending } = authClient.useSession();
  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const userId = session?.user?.id;
  const userEmail = session?.user?.email;

  useEffect(() => {
    if (!isPending && !userId) {
      router.replace("/login");
    }
  }, [isPending, userId, router]);

  // Load existing event
  useEffect(() => {
    if (isPending || !userId || !eventId) return;

    const controller = new AbortController();

    async function loadEvent() {
      try {
        const response = await fetch(apiUrl(`/events/${eventId}`), {
          cache: "no-store",
          signal: controller.signal,
        });

        if (!response.ok) {
          throw new Error("Failed to load event.");
        }

        const data = await response.json();

        // Check ownership on frontend
        const isOwner = data.creatorId
          ? data.creatorId === userId
          : data.creatorEmail === userEmail;

        if (!isOwner) {
          throw new Error(
            "You are not allowed to edit this event."
          );
        }

        if (!controller.signal.aborted) {
          setEvent(data);
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

    loadEvent();

    return () => controller.abort();
  }, [eventId, isPending, userId, userEmail]);

  // Update form data
  const handleChange = (e) => {
    const { name, value } = e.target;

    setEvent((previous) => ({
      ...previous,
      [name]: value,
    }));
  };

  // Save updated event
  const handleUpdate = async (e) => {
    e.preventDefault();

    if (saving || !event) return;

    const updates = {
      title: event.title.trim(),
      description: event.description.trim(),
      eventType: event.eventType,
      thumbnail: event.thumbnail.trim(),
      location: event.location.trim(),
      eventDate: event.eventDate,
    };

    if (Object.values(updates).some((value) => !value)) {
      toast.error("Please fill in all fields.");
      return;
    }

    // Validate date
    const now = new Date();
    const today = [
      now.getFullYear(),
      String(now.getMonth() + 1).padStart(2, "0"),
      String(now.getDate()).padStart(2, "0"),
    ].join("-");

    if (updates.eventDate <= today) {
      toast.error("Please select a future event date.");
      return;
    }

    setSaving(true);

    try {
      const response = await apiFetch(
        `/events/${eventId}`,
        {
          method: "PATCH",
          body: JSON.stringify(updates),
        }
      );

      const result = await response.json();

      if (response.status === 401) {
        clearJwt();
        toast.error("Please login again.");
        router.replace("/login");
        return;
      }

      if (!response.ok) {
        toast.error(
          result.message || "Failed to update event."
        );
        return;
      }

      toast.success("Event updated successfully!");

      router.push("/manage-events");
      router.refresh();
    } catch (err) {
      console.error("Update event error:", err);
      toast.error("Could not connect to the server.");
    } finally {
      setSaving(false);
    }
  };

  if (isPending || (userId && loading)) {
    return (
      <div className="flex min-h-[70vh] items-center justify-center">
        <span className="loading loading-spinner loading-lg text-primary" />
      </div>
    );
  }

  if (!userId) return null;

  if (error || !event) {
    return (
      <section className="min-h-[70vh] px-4 py-20 text-center">
        <h1 className="text-2xl font-bold">
          Unable to Edit Event
        </h1>

        <p className="mt-3 text-error">
          {error || "Event not found."}
        </p>

        <Link
          href="/manage-events"
          className="btn btn-primary mt-6"
        >
          Back to Manage Events
        </Link>
      </section>
    );
  }

  return (
    <section className="min-h-screen bg-base-200 px-4 py-12">
      <Toaster position="top-right" richColors />

      <div className="mx-auto max-w-3xl">
        <Link
          href="/manage-events"
          className="btn btn-ghost mb-5"
        >
          ← Back to Manage Events
        </Link>

        <div className="mb-8 text-center">
          <h1 className="text-3xl font-bold">
            Update Event
          </h1>

          <p className="mt-3 text-base-content/70">
            Edit your event details and save your changes.
          </p>
        </div>

        <div className="card border border-base-300 bg-base-100 shadow-lg">
          <div className="card-body p-6 md:p-10">
            <form
              onSubmit={handleUpdate}
              className="space-y-5"
            >
              {/* Title */}
              <div>
                <label
                  htmlFor="title"
                  className="mb-2 block font-medium"
                >
                  Event Title
                </label>

                <input
                  id="title"
                  name="title"
                  type="text"
                  value={event.title || ""}
                  onChange={handleChange}
                  className="input w-full"
                  required
                />
              </div>

              {/* Description */}
              <div>
                <label
                  htmlFor="description"
                  className="mb-2 block font-medium"
                >
                  Event Description
                </label>

                <textarea
                  id="description"
                  name="description"
                  value={event.description || ""}
                  onChange={handleChange}
                  className="textarea min-h-32 w-full"
                  required
                />
              </div>

              {/* Event Type */}
              <div>
                <label
                  htmlFor="eventType"
                  className="mb-2 block font-medium"
                >
                  Event Type
                </label>

                <select
                  id="eventType"
                  name="eventType"
                  value={event.eventType || ""}
                  onChange={handleChange}
                  className="select w-full"
                  required
                >
                  <option value="Cleanup">Cleanup</option>
                  <option value="Plantation">Plantation</option>
                  <option value="Donation">Donation</option>
                  <option value="Education">Education</option>
                  <option value="Health">Health</option>
                  <option value="Other">Other</option>
                </select>
              </div>

              {/* Location */}
              <div>
                <label
                  htmlFor="location"
                  className="mb-2 block font-medium"
                >
                  Event Location
                </label>

                <input
                  id="location"
                  name="location"
                  type="text"
                  value={event.location || ""}
                  onChange={handleChange}
                  className="input w-full"
                  required
                />
              </div>

              {/* Date */}
              <div>
                <label
                  htmlFor="eventDate"
                  className="mb-2 block font-medium"
                >
                  Event Date
                </label>

                <input
                  id="eventDate"
                  name="eventDate"
                  type="date"
                  value={event.eventDate || ""}
                  onChange={handleChange}
                  className="input w-full"
                  required
                />
              </div>

              {/* Thumbnail */}
              <div>
                <label
                  htmlFor="thumbnail"
                  className="mb-2 block font-medium"
                >
                  Event Thumbnail URL
                </label>

                <input
                  id="thumbnail"
                  name="thumbnail"
                  type="url"
                  value={event.thumbnail || ""}
                  onChange={handleChange}
                  className="input w-full"
                  required
                />
              </div>

              {/* Organizer */}
              <div>
                <label className="mb-2 block font-medium">
                  Organizer Email
                </label>

                <input
                  type="email"
                  value={session.user.email}
                  className="input w-full bg-base-200"
                  readOnly
                />
              </div>

              {/* Actions */}
              <div className="flex flex-wrap gap-3 pt-3">
                <button
                  type="submit"
                  disabled={saving}
                  className="btn btn-primary flex-1"
                >
                  {saving ? (
                    <>
                      <span className="loading loading-spinner loading-sm" />
                      Updating...
                    </>
                  ) : (
                    "Save Changes"
                  )}
                </button>

                <Link
                  href="/manage-events"
                  className="btn btn-outline"
                >
                  Cancel
                </Link>
              </div>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
}
