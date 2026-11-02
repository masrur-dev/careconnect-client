
"use client";

import { useEffect } from "react";
import Link from "next/link";

export default function ErrorPage({ error, reset }) {
  useEffect(() => {
    console.error("CareConnect error:", error);
  }, [error]);

  return (
    <section className="flex min-h-[75vh] items-center justify-center bg-base-200 px-4 py-16">
      <div className="mx-auto max-w-lg text-center">
        <div className="mb-6 text-6xl">
          ⚠️
        </div>

        <h1 className="text-3xl font-bold">
          Something Went Wrong
        </h1>

        <p className="mt-4 text-base-content/70">
          We couldn&apos;t load this page.
          Please try again.
        </p>

        <div className="mt-8 flex flex-wrap justify-center gap-3">
          <button
            type="button"
            onClick={() => reset()}
            className="btn btn-primary"
          >
            Try Again
          </button>

          <Link
            href="/"
            className="btn btn-outline"
          >
            Back to Home
          </Link>
        </div>
      </div>
    </section>
  );
}
