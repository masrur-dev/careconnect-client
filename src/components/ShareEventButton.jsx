"use client";

import { Share2 } from "lucide-react";
import { useToast } from "@/components/ToastProvider";

export default function ShareEventButton({ title }) {
  const toast = useToast();

  const handleShare = async () => {
    const url = window.location.href;

    try {
      if (navigator.share) {
        await navigator.share({ title, text: `Join me at ${title}`, url });
        return;
      }

      if (navigator.clipboard?.writeText) {
        await navigator.clipboard.writeText(url);
        toast.success("Event link copied to clipboard.");
        return;
      }

      toast.error("Sharing is not available in this browser.");
    } catch (error) {
      if (error.name !== "AbortError") {
        console.error("Failed to share event:", error);
        toast.error("Could not share this event.");
      }
    }
  };

  return (
    <button type="button" onClick={handleShare} className="btn btn-outline rounded-full">
      <Share2 size={17} /> Share event
    </button>
  );
}
