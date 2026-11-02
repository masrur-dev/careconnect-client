
import Link from "next/link";

export default function Footer() {
  return (
    <footer className="bg-neutral text-neutral-content">
      <div className="container-custom grid gap-10 py-14 md:grid-cols-3">
        <div>
          <h2 className="mb-4 text-2xl font-bold">
            CareConnect
          </h2>
          <p className="max-w-sm text-sm leading-7 opacity-80">
            Bringing communities together through
            meaningful social service events.
            Join hands and create positive change.
          </p>
        </div>

        <div>
          <h3 className="mb-4 text-lg font-semibold">
            Quick Links
          </h3>
          <nav className="flex flex-col gap-3 text-sm">
            <Link href="/">Home</Link>
            <Link href="/events">Upcoming Events</Link>
            <Link href="/login">Login</Link>
            <Link href="/register">Register</Link>
          </nav>
        </div>

        <div>
          <h3 className="mb-4 text-lg font-semibold">
            Our Mission
          </h3>
          <p className="text-sm leading-7 opacity-80">
            Support local communities by making
            volunteering and social development
            opportunities easier to discover.
          </p>
        </div>
      </div>

     
<div className="border-t border-neutral-content/20 py-5 text-center text-sm opacity-80">
  © 2026 CareConnect. All rights reserved.
</div>

    </footer>
  );
}
