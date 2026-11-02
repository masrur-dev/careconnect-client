"use client";

import { useState } from "react";
import { authClient } from "@/lib/auth-client";
import { apiFetch, clearJwt } from "@/lib/api";
import { useToast } from "@/components/ToastProvider";

export default function LeaveJoinedEventButton({ eventId, onLeave }) {
  const toast = useToast();
  const { data: session } = authClient.useSession();
  const [loading, setLoading] = useState(false);

  const handleLeave = async () => {
    if (loading || !session?.user) return;

    setLoading(true);

    try {
      const response = await apiFetch(`/events/${eventId}/join`, { method: "DELETE" });
      const contentType = response.headers.get("content-type") || "";
      const result = contentType.includes("application/json")
        ? await response.json()
        : {};

      if (response.status === 401) {
        clearJwt();
        toast.error("Please login again.");
        return;
      }

      if (!response.ok) {
        toast.error(result.message || "Could not leave this event.");
        return;
      }

      onLeave(eventId);
      toast.success("You have left the event.");
    } catch (error) {
      console.error("Leave joined event error:", error);
      toast.error("Could not connect to the server.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <button
      type="button"
      onClick={handleLeave}
      disabled={loading}
      className="btn btn-outline btn-error w-full rounded-xl"
    >
      {loading ? <><span className="loading loading-spinner loading-sm" /> Leaving event…</> : "Leave event"}
    </button>
  );
}
