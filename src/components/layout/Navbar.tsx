import { useState } from "react";
import { Link, useLocation } from "@tanstack/react-router";
import {
  Search,
  Bell,
  UserRound,
  Menu,
  X,
  CalendarDays,
  Trophy,
  Handshake,
  Camera,
} from "lucide-react";

const navigation = [
  { label: "Home", to: "/" },
  { label: "Explore", to: "/explore" },
  { label: "Sports", to: "/sports" },
  { label: "Tournaments", to: "/tournaments" },
  { label: "Schedule", to: "/schedule", icon: Trophy },
  { label: "Calendar", to: "/calendar", icon: CalendarDays },
  { label: "Athletes", to: "/athletes" },
  { label: "Teams", to: "/teams" },
  { label: "Sponsors", to: "/sponsors", icon: Handshake },
  { label: "Gallery", to: "/gallery", icon: Camera },
  { label: "Facilities", to: "/facilities" },
  { label: "Campus Map", to: "/campus-map" },
  { label: "About", to: "/about" },
] as const;

export function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const location = useLocation();

  const isActive = (path: string) => {
    if (path === "/") {
      return location.pathname === "/";
    }

    return location.pathname.startsWith(path);
  };

  return (
    <header className="sticky top-0 z-50 border-b border-border bg-background/95 backdrop-blur-xl">
      <div className="mx-auto flex h-[76px] max-w-[1440px] items-center px-4 sm:px-6 lg:px-8">

        {/* Logo */}
        <Link
          to="/"
          className="flex shrink-0 items-center gap-3"
          onClick={() => setMobileOpen(false)}
        >
          <img
            src="/favicon.png"
            alt="KhelSankalp"
            className="h-12 w-12 object-contain"
          />

          <div className="hidden sm:block">
            <div className="font-display text-xl font-bold leading-none text-primary">
              KhelSankalp
            </div>

            <div className="mt-1 text-[10px] font-semibold tracking-[0.18em] text-muted-foreground">
              SGSITS INDORE
            </div>
          </div>
        </Link>

        {/* Desktop Navigation */}
        <nav className="ml-8 hidden flex-1 items-center justify-center gap-1 xl:flex">
          {navigation.map((item) => {
            const active = isActive(item.to);

            return (
              <Link
                key={item.to}
                to={item.to}
                className={`rounded-full px-3 py-2 text-sm font-semibold transition ${
                  active
                    ? "bg-primary/10 text-primary"
                    : "text-muted-foreground hover:bg-muted hover:text-primary"
                }`}
              >
                {item.label}
              </Link>
            );
          })}
        </nav>

        {/* Desktop Actions */}
        <div className="ml-auto hidden items-center gap-2 xl:flex">

          <button
            type="button"
            aria-label="Search"
            className="flex h-10 w-10 items-center justify-center rounded-full text-primary transition hover:bg-muted"
          >
            <Search className="h-5 w-5" />
          </button>

          <button
            type="button"
            aria-label="Notifications"
            className="relative flex h-10 w-10 items-center justify-center rounded-full text-primary transition hover:bg-muted"
          >
            <Bell className="h-5 w-5" />
            <span className="absolute right-2 top-2 h-2 w-2 rounded-full bg-red-500" />
          </button>

          <Link
            to="/auth"
            className="ml-1 inline-flex items-center gap-2 rounded-xl bg-primary px-5 py-3 text-sm font-semibold text-primary-foreground shadow-sm transition hover:bg-primary/90"
          >
            <UserRound className="h-4 w-4" />
            Sign in / Register
          </Link>
        </div>

        {/* Mobile Menu Button */}
        <button
          type="button"
          onClick={() => setMobileOpen((value) => !value)}
          className="ml-auto flex h-10 w-10 items-center justify-center rounded-xl text-primary hover:bg-muted xl:hidden"
          aria-label="Toggle menu"
        >
          {mobileOpen ? (
            <X className="h-6 w-6" />
          ) : (
            <Menu className="h-6 w-6" />
          )}
        </button>
      </div>

      {/* Mobile Navigation */}
      {mobileOpen && (
        <div className="border-t border-border bg-background px-4 py-4 xl:hidden">
          <nav className="grid gap-1 sm:grid-cols-2">

            {navigation.map((item) => {
              const active = isActive(item.to);

              return (
                <Link
                  key={item.to}
                  to={item.to}
                  onClick={() => setMobileOpen(false)}
                  className={`flex items-center gap-2 rounded-xl px-4 py-3 text-sm font-semibold transition ${
                    active
                      ? "bg-primary/10 text-primary"
                      : "text-muted-foreground hover:bg-muted hover:text-primary"
                  }`}
                >
                  {item.icon && (
                    <item.icon className="h-4 w-4" />
                  )}

                  {item.label}
                </Link>
              );
            })}

            <Link
              to="/auth"
              onClick={() => setMobileOpen(false)}
              className="mt-2 flex items-center justify-center gap-2 rounded-xl bg-primary px-4 py-3 text-sm font-semibold text-primary-foreground sm:col-span-2"
            >
              <UserRound className="h-4 w-4" />
              Sign in / Register
            </Link>

            <Link to="/tournaments">
  Tournaments
</Link>

<Link to="/fixtures">
  Fixtures
</Link>

<Link to="/schedule">
  Schedule
</Link>

<Link to="/calendar">
  Calendar
</Link>

<Link to="/gallery">
  Gallery
</Link>

          </nav>
        </div>
      )}
    </header>
  );
}

