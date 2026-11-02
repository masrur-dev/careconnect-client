
"use client";

import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { authClient } from "@/lib/auth-client";
import AuthNav from "@/components/AuthNav";
import ThemeToggle from "@/components/ThemeToggle";
import { Menu, X } from "lucide-react";

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const router = useRouter();

  const { data: session, isPending } = authClient.useSession();
  const user = session?.user;

  const closeMenu = () => setMenuOpen(false);

  const handleMobileLogout = async () => {
    const { error } = await authClient.signOut();

    if (error) {
      console.error("Logout failed:", error);
      return;
    }

    closeMenu();
    router.push("/");
    router.refresh();
  };

  return (
    <header className="sticky top-0 z-50 border-b border-base-300 bg-base-100">
      <div className="navbar container-custom min-h-20 gap-2">

        {/* Logo */}
        <div className="navbar-start min-w-0">
          <Link
            href="/"
            className="whitespace-nowrap text-lg font-bold text-primary sm:text-2xl"
          >
            CareConnect
          </Link>
        </div>

        {/* Desktop Navigation */}
        <div className="navbar-center hidden lg:flex">
          <ul className="menu menu-horizontal gap-3 px-1 font-medium">
            <li>
              <Link href="/" className="btn btn-ghost btn-sm rounded-full px-4">Home</Link>
            </li>
            <li>
              <Link href="/events" className="btn btn-ghost btn-sm rounded-full px-4">Upcoming Events</Link>
            </li>
          </ul>
        </div>

        {/* Navbar Right */}
        <div className="navbar-end min-w-0 gap-1 sm:gap-2">
          <ThemeToggle />

          {/* Desktop Profile Dropdown */}
          {user && (
            <div className="dropdown dropdown-end hidden lg:block">
              <button
                type="button"
                tabIndex={0}
                className="btn btn-ghost btn-sm"
              >
                Profile
              </button>

              <div
                tabIndex={0}
                className="dropdown-content profile-dropdown-content z-50 mt-3 rounded-2xl border border-base-300/70 bg-base-100 p-3 shadow-xl"
              >
                <Link href="/create-event" className="btn btn-ghost btn-sm rounded-xl">Create Event</Link>
                <Link href="/manage-events" className="btn btn-ghost btn-sm rounded-xl">Manage Events</Link>
                <Link href="/joined-events" className="btn btn-ghost btn-sm rounded-xl">Joined Events</Link>
              </div>
            </div>
          )}

          {/* Desktop Auth Buttons / User Profile */}
          <div className="hidden lg:block">
            <AuthNav />
          </div>

          {/* Mobile Hamburger Button */}
          <button
            type="button"
            className="btn btn-ghost btn-square lg:hidden"
            onClick={() => setMenuOpen(!menuOpen)}
            aria-label={menuOpen ? "Close menu" : "Open menu"}
            aria-expanded={menuOpen}
            aria-controls="careconnect-mobile-menu"
          >
            {menuOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
      </div>

      {/* Mobile Navigation */}
      {menuOpen && (
        <nav
          id="careconnect-mobile-menu"
          className="mobile-nav-drop border-t border-base-300 bg-base-100 lg:hidden"
        >
          <ul className="menu container-custom w-full gap-1 py-3">
            <li>
              <Link href="/" onClick={closeMenu}>
                Home
              </Link>
            </li>

            <li>
              <Link href="/events" onClick={closeMenu}>
                Upcoming Events
              </Link>
            </li>

            {!isPending && user && (
              <>
                <li className="menu-title">
                  {user.name}
                </li>

                <li>
                  <Link href="/create-event" onClick={closeMenu}>
                    Create Event
                  </Link>
                </li>

                <li>
                  <Link href="/manage-events" onClick={closeMenu}>
                    Manage Events
                  </Link>
                </li>

                <li>
                  <Link href="/joined-events" onClick={closeMenu}>
                    Joined Events
                  </Link>
                </li>

                <li>
                  <button
                    type="button"
                    onClick={handleMobileLogout}
                    className="text-error"
                  >
                    Logout
                  </button>
                </li>
              </>
            )}

            {!isPending && !user && (
              <>
                <li>
                  <Link href="/login" onClick={closeMenu}>
                    Login
                  </Link>
                </li>

                <li>
                  <Link href="/register" onClick={closeMenu}>
                    Register
                  </Link>
                </li>
              </>
            )}
          </ul>
        </nav>
      )}
    </header>
  );
}
