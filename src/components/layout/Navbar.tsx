import { Link, useNavigate } from "@tanstack/react-router";
import { Menu, Bell, Search, LayoutDashboard, LogOut, User, Shield } from "lucide-react";
import { useState } from "react";
import logo from "@/assets/unisports-logo.png";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { announcements } from "@/data/mock";
import { useMember } from "@/hooks/useSession";
import { supabase } from "@/integrations/supabase/client";
import { useQueryClient } from "@tanstack/react-query";

export const NAV_LINKS = [
  { to: "/", label: "Home" },
  { to: "/explore", label: "Explore" },
  { to: "/sports", label: "Sports" },
  { to: "/tournaments", label: "Tournaments" },
  { to: "/athletes", label: "Athletes" },
  { to: "/teams", label: "Teams" },
  { to: "/facilities", label: "Facilities" },
  { to: "/campus-map", label: "Campus Map" },
  { to: "/about", label: "About" },
] as const;

export function Navbar() {
  const [open, setOpen] = useState(false);
  const { session, profile, ready, isStaff } = useMember();
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const isSignedIn = !!session && ready;

  async function handleSignOut() {
    await queryClient.cancelQueries();
    queryClient.clear();
    await supabase.auth.signOut();
    navigate({ to: "/auth", replace: true });
  }

  return (
    <header className="sticky top-0 z-50 border-b border-border/70 bg-background/80 backdrop-blur-xl">
      <div className="mx-auto grid max-w-7xl grid-cols-[minmax(0,1fr)_auto] items-center gap-3 px-4 py-3 lg:flex lg:justify-between">
        <Link to="/" className="flex min-w-0 items-center gap-3">
          <img
            src={logo}
            alt="KhelSankalp SGSITS Ekalavya emblem"
            width={44}
            height={44}
            className="h-11 w-11 shrink-0"
          />
          <span className="min-w-0">
            <span className="block truncate font-display text-lg font-bold leading-none text-primary">
              KhelSankalp
            </span>
            <span className="block truncate text-[11px] uppercase tracking-[0.18em] text-muted-foreground">
              SGSITS Indore
            </span>
          </span>
        </Link>

        <nav className="hidden items-center gap-1 xl:flex">
          {NAV_LINKS.map((l) => (
            <Link
              key={l.to}
              to={l.to}
              activeOptions={{ exact: l.to === "/" }}
              activeProps={{ className: "bg-accent text-accent-foreground" }}
              className="rounded-full px-3 py-2 text-sm font-medium text-muted-foreground transition-colors hover:bg-accent hover:text-accent-foreground"
            >
              {l.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          <Button asChild variant="ghost" size="icon" className="hidden sm:inline-flex">
            <Link to="/explore" aria-label="Search KhelSankalp">
              <Search className="h-5 w-5" />
            </Link>
          </Button>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="relative" aria-label="Notifications">
                <Bell className="h-5 w-5" />
                <span className="absolute right-1.5 top-1.5 h-2 w-2 rounded-full bg-live" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-80">
              <DropdownMenuLabel>Announcements</DropdownMenuLabel>
              <DropdownMenuSeparator />
              {announcements.slice(0, 4).map((a) => (
                <DropdownMenuItem key={a.id} className="flex flex-col items-start gap-0.5">
                  <span className="text-sm font-semibold">{a.title}</span>
                  <span className="text-xs text-muted-foreground">
                    {a.category} · {a.date}
                  </span>
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>

          {isSignedIn ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" className="hidden gap-2 sm:inline-flex">
                  <User className="h-4 w-4" />
                  <span className="max-w-[8rem] truncate">{profile?.full_name ?? "Member"}</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                <DropdownMenuLabel>
                  <div className="flex flex-col">
                    <span className="truncate">{profile?.full_name}</span>
                    <span className="text-xs font-normal text-muted-foreground">
                      {profile?.roll_number}
                    </span>
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild>
                  <Link to="/portal" className="cursor-pointer">
                    <LayoutDashboard className="mr-2 h-4 w-4" />
                    Member Portal
                  </Link>
                </DropdownMenuItem>
                {isStaff && (
                  <DropdownMenuItem asChild>
                    <Link to="/dashboard" className="cursor-pointer">
                      <Shield className="mr-2 h-4 w-4" />
                      Staff Dashboard
                    </Link>
                  </DropdownMenuItem>
                )}
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={handleSignOut} className="cursor-pointer text-destructive">
                  <LogOut className="mr-2 h-4 w-4" />
                  Sign out
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <Button asChild className="hidden gradient-royal text-primary-foreground sm:inline-flex">
              <Link to="/auth">
                <User className="mr-2 h-4 w-4" />
                Sign in / Register
              </Link>
            </Button>
          )}

          <Sheet open={open} onOpenChange={setOpen}>
            <SheetTrigger asChild>
              <Button variant="outline" size="icon" className="xl:hidden" aria-label="Open menu">
                <Menu className="h-5 w-5" />
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-[85vw] max-w-sm">
              <SheetTitle className="px-1 text-left">Navigate KhelSankalp</SheetTitle>
              <nav className="mt-4 flex flex-col gap-1">
                {NAV_LINKS.map((l) => (
                  <Link
                    key={l.to}
                    to={l.to}
                    onClick={() => setOpen(false)}
                    activeOptions={{ exact: l.to === "/" }}
                    activeProps={{ className: "bg-accent text-accent-foreground" }}
                    className="rounded-lg px-3 py-3 text-sm font-medium text-foreground transition-colors hover:bg-accent"
                  >
                    {l.label}
                  </Link>
                ))}
                {isSignedIn ? (
                  <>
                    <Link
                      to="/portal"
                      onClick={() => setOpen(false)}
                      className="rounded-lg px-3 py-3 text-sm font-medium text-foreground transition-colors hover:bg-accent"
                    >
                      Member Portal
                    </Link>
                    {isStaff && (
                      <Link
                        to="/dashboard"
                        onClick={() => setOpen(false)}
                        className="rounded-lg px-3 py-3 text-sm font-medium text-foreground transition-colors hover:bg-accent"
                      >
                        Staff Dashboard
                      </Link>
                    )}
                    <button
                      onClick={() => {
                        setOpen(false);
                        void handleSignOut();
                      }}
                      className="rounded-lg px-3 py-3 text-left text-sm font-medium text-destructive transition-colors hover:bg-accent"
                    >
                      Sign out
                    </button>
                  </>
                ) : (
                  <Link
                    to="/auth"
                    onClick={() => setOpen(false)}
                    className="rounded-lg bg-primary px-3 py-3 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
                  >
                    Sign in / Register
                  </Link>
                )}
              </nav>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}
