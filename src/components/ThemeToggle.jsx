
"use client";

import { useEffect, useSyncExternalStore } from "react";

// The <html data-theme> attribute is the single source of truth for the
// current theme, so React reads it instead of keeping (and resetting)
// its own state inside an effect.
function subscribeToTheme(callback) {
  const observer = new MutationObserver(callback);
  observer.observe(document.documentElement, {
    attributes: true,
    attributeFilter: ["data-theme"],
  });
  return () => observer.disconnect();
}

function getThemeSnapshot() {
  return document.documentElement.getAttribute("data-theme") || "light";
}

function getServerThemeSnapshot() {
  return "light";
}

export default function ThemeToggle() {
  const theme = useSyncExternalStore(
    subscribeToTheme,
    getThemeSnapshot,
    getServerThemeSnapshot,
  );

  // Restore saved theme after hydration (localStorage is unavailable on the server)
  useEffect(() => {
    const savedTheme = localStorage.getItem(
      "careconnect-theme"
    );

    if (savedTheme === "light" || savedTheme === "dark") {
      document.documentElement.setAttribute(
        "data-theme",
        savedTheme
      );
    }
  }, []);

  // Change theme
  const toggleTheme = () => {
    const nextTheme =
      theme === "dark" ? "light" : "dark";

    document.documentElement.setAttribute(
      "data-theme",
      nextTheme
    );

    localStorage.setItem(
      "careconnect-theme",
      nextTheme
    );
  };

  return (
    <button
      type="button"
      onClick={toggleTheme}
      className="btn btn-ghost btn-sm rounded-full px-3"
      aria-label={`Switch to ${theme === "dark" ? "light" : "dark"} theme`}
      aria-pressed={theme === "dark"}
      title="Change Theme"
    >
      <span className={`swap swap-rotate ${theme === "dark" ? "swap-active" : ""}`} aria-hidden="true">
        <svg className="swap-on h-5 w-5 fill-current" viewBox="0 0 24 24">
          <path d="M12 2a1 1 0 0 1 1 1v1a1 1 0 1 1-2 0V3a1 1 0 0 1 1-1Zm0 17a1 1 0 0 1 1 1v1a1 1 0 1 1-2 0v-1a1 1 0 0 1 1-1ZM4.93 4.93a1 1 0 0 1 1.41 0l.71.71a1 1 0 1 1-1.41 1.41l-.71-.71a1 1 0 0 1 0-1.41Zm12.02 12.02a1 1 0 0 1 1.41 0l.71.71a1 1 0 1 1-1.41 1.41l-.71-.71a1 1 0 0 1 0-1.41ZM2 12a1 1 0 0 1 1-1h1a1 1 0 1 1 0 2H3a1 1 0 0 1-1-1Zm17 0a1 1 0 0 1 1-1h1a1 1 0 1 1 0 2h-1a1 1 0 0 1-1-1ZM4.93 19.07a1 1 0 0 1 0-1.41l.71-.71a1 1 0 1 1 1.41 1.41l-.71.71a1 1 0 0 1-1.41 0ZM16.95 7.05a1 1 0 0 1 0-1.41l.71-.71a1 1 0 1 1 1.41 1.41l-.71.71a1 1 0 0 1-1.41 0ZM12 7a5 5 0 1 1 0 10 5 5 0 0 1 0-10Z" />
        </svg>
        <svg className="swap-off h-5 w-5 fill-current" viewBox="0 0 24 24">
          <path d="M20.1 15.5A8.5 8.5 0 0 1 8.5 3.9 8.6 8.6 0 1 0 20.1 15.5Z" />
        </svg>
      </span>
      <span className="hidden sm:inline">Theme</span>
    </button>
  );
}
