
"use client";

import { useEffect } from "react";

export default function ThemeToggle() {

  // Restore saved theme after page loads
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
    const currentTheme =
      document.documentElement.getAttribute("data-theme") ||
      "light";

    const nextTheme =
      currentTheme === "dark" ? "light" : "dark";

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
      className="btn btn-ghost btn-sm"
      aria-label="Toggle light and dark theme"
      title="Change Theme"
    >
      🌓 Theme
    </button>
  );
}
