import { createFileRoute, Link } from "@tanstack/react-router";

import {
  Handshake,
  ArrowRight,
  Trophy,
  Users,
  MapPin,
} from "lucide-react";

import sponsors from "@/data/sponsors.json";

export const Route = createFileRoute("/sponsors")({
  component: SponsorsPage,
});

function SponsorsPage() {
  return (
    <main className="min-h-screen bg-background">

      {/* Hero */}
      <section className="bg-primary px-4 py-16 text-primary-foreground">
        <div className="mx-auto max-w-7xl">

          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gold/15">
            <Handshake className="h-6 w-6 text-gold" />
          </div>

          <p className="mt-6 text-xs font-semibold uppercase tracking-[0.22em] text-gold">
            Sports partnerships
          </p>

          <h1 className="mt-3 text-4xl font-bold sm:text-5xl">
            Our Sponsors & Partners
          </h1>

          <p className="mt-4 max-w-2xl text-sm leading-7 text-primary-foreground/75 sm:text-base">
            Local organizations and community partners helping tournaments,
            athletes and grassroots sports grow.
          </p>

        </div>
      </section>

      {/* Sponsors */}
      <section className="mx-auto max-w-7xl px-4 py-12">

        <div className="grid gap-6 md:grid-cols-2">

          {sponsors.map((sponsor) => (
            <article
              key={sponsor.id}
              className="rounded-2xl border border-border bg-surface p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-lg"
            >

              <div className="flex items-start gap-5">

                <div className="flex h-20 w-20 shrink-0 items-center justify-center overflow-hidden rounded-2xl border border-border bg-muted">

                  <img
                    src={sponsor.logo}
                    alt={sponsor.name}
                    className="h-full w-full object-contain p-2"
                  />

                </div>

                <div>

                  <span className="rounded-full bg-gold/10 px-3 py-1 text-xs font-semibold text-gold-foreground">
                    {sponsor.category}
                  </span>

                  <h2 className="mt-3 text-xl font-bold text-primary">
                    {sponsor.name}
                  </h2>

                </div>

              </div>

              <p className="mt-6 text-sm leading-7 text-muted-foreground">
                {sponsor.description}
              </p>

              <div className="mt-6 grid grid-cols-3 gap-3 border-t border-border pt-5">

                <div className="text-center">
                  <Trophy className="mx-auto h-5 w-5 text-gold" />
                  <p className="mt-2 text-[11px] text-muted-foreground">
                    Tournaments
                  </p>
                </div>

                <div className="text-center">
                  <Users className="mx-auto h-5 w-5 text-royal" />
                  <p className="mt-2 text-[11px] text-muted-foreground">
                    Athletes
                  </p>
                </div>

                <div className="text-center">
                  <MapPin className="mx-auto h-5 w-5 text-royal" />
                  <p className="mt-2 text-[11px] text-muted-foreground">
                    Local
                  </p>
                </div>

              </div>

            </article>
          ))}

        </div>

        {/* Sponsor CTA */}
        <div className="mt-12 rounded-2xl bg-primary p-8 text-primary-foreground">

          <div className="flex flex-col justify-between gap-6 md:flex-row md:items-center">

            <div>

              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-gold">
                Become a partner
              </p>

              <h2 className="mt-2 text-2xl font-bold">
                Support local sports
              </h2>

              <p className="mt-2 max-w-xl text-sm leading-6 text-primary-foreground/70">
                Connect with tournament organizers and support athletes
                through sports sponsorship opportunities.
              </p>

            </div>

            <Link
              to="/auth"
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-gold px-5 py-3 text-sm font-semibold text-gold-foreground"
            >
              Partner with us
              <ArrowRight className="h-4 w-4" />
            </Link>

          </div>

        </div>

      </section>
    </main>
  );
}