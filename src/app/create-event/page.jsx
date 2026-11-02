
"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { authClient } from "@/lib/auth-client";
import { apiFetch, clearJwt } from "@/lib/api";
import { toast, Toaster } from "sonner";

export default function CreateEventPage() {
  const router = useRouter();

  const { data: session, isPending } = authClient.useSession();
  const [loading, setLoading] = useState(false);

  // Redirect users who are not logged in
  useEffect(() => {
    if (!isPending && !session?.user) {
      router.replace("/login");
    }
  }, [isPending, session?.user, router]);

  // Handle Create Event form submission
  const handleCreateEvent = async (e) => {
    e.preventDefault();

    if (!session?.user) {
      toast.error("Please login first.");
      return;
    }

    const form = e.currentTarget;
    const formData = new FormData(form);

    const event = {
      title: formData.get("title")?.trim(),
      description: formData.get("description")?.trim(),
      eventType: formData.get("eventType"),
      thumbnail: formData.get("thumbnail")?.trim(),
      location: formData.get("location")?.trim(),
      eventDate: formData.get("eventDate"),
      creatorEmail: session.user.email,
      organizerName: session.user.name,
    };

    // Required fields validation
    if (
      !event.title ||
      !event.description ||
      !event.eventType ||
      !event.thumbnail ||
      !event.location ||
      !event.eventDate
    ) {
      toast.error("Please fill in all required fields.");
      return;
    }

    // Get local date in YYYY-MM-DD format
    const now = new Date();

    const today = [
      now.getFullYear(),
      String(now.getMonth() + 1).padStart(2, "0"),
      String(now.getDate()).padStart(2, "0"),
    ].join("-");

    // Event date must be in the future
    if (event.eventDate <= today) {
      toast.error("Please select a future event date.");
      return;
    }

    setLoading(true);

    try {
      // Send event to Express Server (identity comes from the JWT, not the body)
      const response = await apiFetch("/events", {
        method: "POST",
        body: JSON.stringify(event),
      });

      const result = await response.json();

      if (response.status === 401) {
        clearJwt();
        toast.error("Please login again.");
        router.replace("/login");
        return;
      }

      if (!response.ok) {
        console.error("Create Event Error:", result);

        toast.error(
          result.message ||
            result.error ||
            "Failed to create event."
        );

        return;
      }

      toast.success("Event created successfully!");

      form.reset();

      router.push("/events");
      router.refresh();
    } catch (error) {
      console.error("Create Event Error:", error);
      toast.error("Could not connect to the server.");
    } finally {
      setLoading(false);
    }
  };

  // Loading while checking session
  if (isPending) {
    return (
      <div className="flex min-h-[70vh] items-center justify-center">
        <span className="loading loading-spinner loading-lg text-primary" />
      </div>
    );
  }

  // Protect private page
  if (!session?.user) {
    return null;
  }

  return (
    <section className="bg-base-200 px-4 py-12">
      <Toaster position="top-right" richColors />

      <div className="mx-auto max-w-3xl">

        {/* Page Header */}
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-bold">
            Create New Event
          </h1>

          <p className="mt-3 text-base-content/70">
            Organize an event and make a positive impact
            with CareConnect.
          </p>
        </div>

        {/* Form Card */}
        <div className="card border border-base-300 bg-base-100 shadow-lg">
          <div className="card-body p-6 md:p-10">

            <form
              onSubmit={handleCreateEvent}
              className="space-y-5"
            >

              {/* Event Title */}
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
                  placeholder="Enter event title"
                  className="input w-full"
                  required
                />
              </div>

              {/* Event Description */}
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
                  placeholder="Describe your event"
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
                  defaultValue=""
                  className="select w-full"
                  required
                >
                  <option value="" disabled>
                    Select event type
                  </option>

                  <option value="Cleanup">Cleanup</option>
                  <option value="Plantation">Plantation</option>
                  <option value="Donation">Donation</option>
                  <option value="Education">Education</option>
                  <option value="Health">Health</option>
                  <option value="Other">Other</option>
                </select>
              </div>

              {/* Event Location */}
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
                  placeholder="Example: Mirpur, Dhaka"
                  className="input w-full"
                  required
                />
              </div>

              {/* Event Date */}
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
                  className="input w-full"
                  required
                />
              </div>

              {/* Thumbnail URL */}
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
                  placeholder="https://example.com/event.jpg"
                  className="input w-full"
                  required
                />
              </div>

              {/* Organizer Name */}
              <div>
                <label
                  htmlFor="organizerName"
                  className="mb-2 block font-medium"
                >
                  Organizer Name
                </label>

                <input
                  id="organizerName"
                  type="text"
                  value={session.user.name || ""}
                  className="input w-full bg-base-200"
                  readOnly
                />
              </div>

              {/* Organizer Email */}
              <div>
                <label
                  htmlFor="creatorEmail"
                  className="mb-2 block font-medium"
                >
                  Organizer Email
                </label>

                <input
                  id="creatorEmail"
                  type="email"
                  value={session.user.email || ""}
                  className="input w-full bg-base-200"
                  readOnly
                />
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={loading}
                className="btn btn-primary w-full"
              >
                {loading ? (
                  <>
                    <span className="loading loading-spinner loading-sm" />
                    Creating Event...
                  </>
                ) : (
                  "Create Event"
                )}
              </button>

            </form>
          </div>
        </div>
      </div>
    </section>
  );
}
