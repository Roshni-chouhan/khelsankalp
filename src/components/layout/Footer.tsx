import { Link } from "@tanstack/react-router";
import { MapPin, Mail, Phone } from "lucide-react";
import logo from "@/assets/unisports-logo.png";

import { COLLEGE } from "@/data/mock";

export function Footer() {
  return (
    <footer className="mt-20 border-t border-border bg-surface">
      <div className="mx-auto grid max-w-7xl gap-10 px-4 py-14 md:grid-cols-2 lg:grid-cols-4">
        <div>
          <div className="flex items-center gap-3">
            <img src={logo} alt="KhelSankalp emblem" width={48} height={48} loading="lazy" className="h-12 w-12" />
            <div>
              <p className="font-display text-lg font-bold text-primary">KhelSankalp</p>
              <p className="text-xs uppercase tracking-[0.18em] text-muted-foreground">
                {COLLEGE.short} Indore
              </p>
            </div>
          </div>
          <p className="mt-4 font-display text-lg text-primary">{COLLEGE.sanskrit}</p>
          <p className="mt-1 text-sm text-muted-foreground">{COLLEGE.tagline}</p>
        </div>

        <div>
          <h4 className="text-sm font-semibold uppercase tracking-wider text-foreground">Compete</h4>
          <ul className="mt-4 space-y-2 text-sm text-muted-foreground">
            <li><Link to="/tournaments" className="hover:text-primary">Tournaments</Link></li>
            <li><Link to="/sports" className="hover:text-primary">Sports</Link></li>
            <li><Link to="/teams" className="hover:text-primary">Teams</Link></li>
            <li><Link to="/athletes" className="hover:text-primary">Athletes</Link></li>
            <li><Link to="/certificates" className="hover:text-primary">Certificate verification</Link></li>
          </ul>
        </div>

        <div>
          <h4 className="text-sm font-semibold uppercase tracking-wider text-foreground">Campus</h4>
          <ul className="mt-4 space-y-2 text-sm text-muted-foreground">
            <li><Link to="/facilities" className="hover:text-primary">Facilities & booking</Link></li>
            <li><Link to="/campus-map" className="hover:text-primary">Campus sports map</Link></li>
            <li><Link to="/explore" className="hover:text-primary">Explore & search</Link></li>
            <li><Link to="/dashboard" className="hover:text-primary">Athlete / Coach / Organizer portals</Link></li>
            <li><Link to="/about" className="hover:text-primary">About KhelSankalp</Link></li>
          </ul>
        </div>

        <div>
          <h4 className="text-sm font-semibold uppercase tracking-wider text-foreground">
            Sports Council
          </h4>
          <ul className="mt-4 space-y-3 text-sm text-muted-foreground">
            <li className="flex gap-2">
              <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-royal" />
              <span>23, Park Road, {COLLEGE.city} 452003</span>
            </li>
            <li className="flex gap-2">
              <Mail className="mt-0.5 h-4 w-4 shrink-0 text-royal" />
              <span>sports@sgsits.ac.in</span>
            </li>
            <li className="flex gap-2">
              <Phone className="mt-0.5 h-4 w-4 shrink-0 text-royal" />
              <span>+91 731 000 0000</span>
            </li>
          </ul>
          
        </div>
      </div>
      <div className="border-t border-border py-5 text-center text-xs text-muted-foreground">
        © {new Date().getFullYear()} {COLLEGE.name} · KhelSankalp digital sports ecosystem ·
        {" "}{COLLEGE.sportsCouncil}
      </div>
    </footer>
  );
}
