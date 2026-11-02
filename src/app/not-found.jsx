
import Link from "next/link";

export default function NotFoundPage() {
  return (
    <section className="flex min-h-[75vh] items-center justify-center bg-base-200 px-4 py-16">
      <div className="mx-auto max-w-lg text-center">
        <h1 className="text-8xl font-extrabold text-primary">
          404
        </h1>

        <h2 className="mt-6 text-3xl font-bold">
          Page Not Found
        </h2>

        <p className="mt-4 text-base-content/70">
          Sorry, the page you are looking for
          does not exist or may have been moved.
        </p>

        <div className="mt-8 flex flex-wrap justify-center gap-3">
          <Link href="/" className="btn btn-primary">
            Back to Home
          </Link>

          <Link href="/events" className="btn btn-outline">
            Explore Events
          </Link>
        </div>
      </div>
    </section>
  );
}
