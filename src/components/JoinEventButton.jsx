
"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { authClient } from "@/lib/auth-client";
import { apiFetch, clearJwt } from "@/lib/api";
import { toast, Toaster } from "sonner";

export default function JoinEventButton({ eventId }) {
  const router = useRouter();

  const { data: session, isPending } = authClient.useSession();

  const [loading, setLoading] = useState(false);
  const [checking, setChecking] = useState(true);
  const [joined, setJoined] = useState(false);
  const [statusError, setStatusError] = useState(false);

  const userId = session?.user?.id;

  // Check MongoDB join status after login
  useEffect(() => {
    if (isPending) return;

    if (!userId) return;

    const controller = new AbortController();

    async function checkJoinStatus() {
      try {
        const response = await apiFetch(
          `/events/${eventId}/join-status`,
          {
            method: "GET",
            cache: "no-store",
            signal: controller.signal,
          }
        );

        if (!response.ok) {
          throw new Error("Failed to check join status");
        }

        const result = await response.json();

        if (!controller.signal.aborted) {
          setJoined(Boolean(result.joined));
          setStatusError(false);
        }
      } catch (error) {
        if (!controller.signal.aborted) {
          console.error("Join status error:", error);
          setStatusError(true);
        }
      } finally {
        if (!controller.signal.aborted) {
          setChecking(false);
        }
      }
    }

    checkJoinStatus();

    return () => controller.abort();
  }, [eventId, userId, isPending]);

  // Join event
  const handleJoinEvent = async () => {
    if (!session?.user) {
      router.push("/login");
      return;
    }

    if (loading || joined || checking || statusError) {
      return;
    }

    setLoading(true);

    try {
      const response = await apiFetch(
        `/events/${eventId}/join`,
        {
          method: "POST",
        }
      );

      const result = await response.json();

      if (response.status === 409) {
        setJoined(true);
        toast.info("You have already joined this event.");
        return;
      }

      if (response.status === 401) {
        clearJwt();
        toast.error("Please login again.");
        router.push("/login");
        return;
      }

      if (!response.ok) {
        toast.error(
          result.message || "Failed to join event."
        );
        return;
      }

      setJoined(true);
      toast.success("Event joined successfully!");
    } catch (error) {
      console.error("Join event error:", error);
      toast.error("Could not connect to the server.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Toaster position="top-right" richColors />

      <button
        type="button"
        onClick={handleJoinEvent}
        disabled={
          isPending ||
          loading ||
          joined ||
          (Boolean(userId) && (checking || statusError))
        }
        className={`btn ${
          joined ? "btn-success" : "btn-primary"
        }`}
      >
        {isPending ? (
          "Checking Login..."
        ) : !userId ? (
          "Login to Join Event"
        ) : checking ? (
          <>
            <span className="loading loading-spinner loading-sm" />
            Checking Join Status...
          </>
        ) : statusError ? (
          "Unable to Check Join Status"
        ) : loading ? (
          <>
            <span className="loading loading-spinner loading-sm" />
            Joining Event...
          </>
        ) : joined ? (
          "✓ Joined Event"
        ) : (
          "Join Event"
        )}
      </button>
    </>
  );
}
