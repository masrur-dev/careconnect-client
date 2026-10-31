
"use client";

import Link from "next/link";
import { useState } from "react";

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);

  // Authentication will be added later.
  const user = null;

  const navLinks = (
    <>
      <li>
        <Link href="/" onClick={() => setMenuOpen(false)}>
          Home
        </Link>
      </li>
      <li>
        <Link
          href="/events"
          onClick={() => setMenuOpen(false)}
        >
          Upcoming Events
        </Link>
      </li>
    </>
  );

  return (
    <header className="sticky top-0 z-50 border-b border-base-300 bg-base-100">
      <div className="navbar container-custom min-h-20">
        <div className="navbar-start">
          <Link
            href="/"
            className="text-2xl font-bold text-primary"
          >
            CareConnect
          </Link>
        </div>

        <div className="navbar-center hidden lg:flex">
          <ul className="menu menu-horizontal gap-3 px-1 font-medium">
            {navLinks}
          </ul>
        </div>

        <div className="navbar-end gap-2">
          {user ? (
            <div className="dropdown dropdown-end">
              <button className="btn btn-ghost">
                Profile
              </button>
              <ul className="menu dropdown-content z-50 w-52 rounded-box bg-base-100 p-2 shadow-lg">
                <li><Link href="/create-event">Create Event</Link></li>
                <li><Link href="/manage-events">Manage Events</Link></li>
                <li><Link href="/joined-events">Joined Events</Link></li>
                <li><button>Logout</button></li>
              </ul>
            </div>
          ) : (
            <Link
              href="/login"
              className="btn btn-primary hidden sm:flex"
            >
              Login
            </Link>
          )}

          <button
            type="button"
            className="btn btn-ghost lg:hidden"
            onClick={() => setMenuOpen(!menuOpen)}
            aria-label="Toggle navigation menu"
            aria-expanded={menuOpen}
          >
            ☰
          </button>
        </div>
      </div>

      {menuOpen && (
        <div className="border-t border-base-300 bg-base-100 lg:hidden">
          <ul className="menu container-custom py-3">
            {navLinks}
            <li className="sm:hidden">
              <Link href="/login" onClick={() => setMenuOpen(false)}>
                Login
              </Link>
            </li>
          </ul>
        </div>
      )}
    </header>
  );
}
