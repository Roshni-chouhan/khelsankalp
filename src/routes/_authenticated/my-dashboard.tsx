import { createFileRoute, Link } from "@tanstack/react-router";

import { PageHeader } from "@/components/common/PageHeader";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useMember } from "@/hooks/useSession";
import { ROLE_LABELS } from "@/lib/auth.functions";

export const Route = createFileRoute("/_authenticated/my-dashboard")({
  head: () => ({
    meta: [
      { title: "My dashboard — KhelSankalp SGSITS" },
      {
        name: "description",
        content:
          "Your KhelSankalp dashboard at SGSITS Indore: profile, role access and sports activity in one place.",
      },
      { property: "og:title", content: "My dashboard — KhelSankalp SGSITS" },
      {
        property: "og:description",
        content: "Profile, role access and sports activity for SGSITS members.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: MyDashboardPage,
});

type Panel = { title: string; items: string[] };

const PANELS: Record<string, Panel> = {
  superadmin: {
    title: "Super admin control",
    items: [
      "Approve or reject membership requests",
      "Manage sports, teams and tournaments",
      "Oversee facilities, equipment and certificates",
      "Review institute-wide analytics",
    ],
  },
  sports_head: {
    title: "Institute sports head desk",
    items: [
      "Approve core team and athlete records",
      "Sanction tournaments and fixtures",
      "Monitor department-wise performance",
      "Publish announcements to all members",
    ],
  },
  core_team: {
    title: "Sports core team desk",
    items: [
      "Manage registrations and fixtures",
      "Update live scores and match events",
      "Post match shorts and highlights",
      "Coordinate facility bookings",
    ],
  },
  athlete: {
    title: "Athlete desk",
    items: [
      "Track your teams and tournaments",
      "View match statistics and achievements",
      "Download digital certificates",
      "Share your sports shorts",
    ],
  },
};

function MyDashboardPage() {
  const { profile, roles, approved, ready } = useMember();

  if (!ready) {
    return (
      <div className="container py-16">
        <p className="text-muted-foreground">Loading your dashboard…</p>
      </div>
    );
  }

  const pending = roles.filter((r) => r.status === "pending");
  const activeRoles = approved.length > 0 ? approved : [];

  return (
    <div className="container space-y-8 py-10">
      <PageHeader
        eyebrow="KhelSankalp"
        title={profile?.full_name ? `Welcome, ${profile.full_name}` : "My dashboard"}
        description="Your SGSITS sports profile, role access and quick actions."
      />

      <div className="grid gap-6 lg:grid-cols-3">
        <Card className="space-y-4 p-6 lg:col-span-1">
          <h2 className="text-lg font-semibold">Profile</h2>
          <dl className="space-y-3 text-sm">
            <Field label="Name" value={profile?.full_name} />
            <Field label="ID" value={profile?.roll_number} />
            <Field label="Email" value={profile?.email} />
            <Field label="Department" value={profile?.branch} />
            <Field label="Year / designation" value={profile?.year} />
            <Field label="Contact" value={profile?.phone} />
          </dl>
          <div className="flex flex-wrap gap-2 pt-2">
            {activeRoles.map((role) => (
              <Badge key={role}>{ROLE_LABELS[role] ?? role}</Badge>
            ))}
            {pending.map((r) => (
              <Badge key={r.id} variant="outline">
                {(ROLE_LABELS[r.role] ?? r.role) + " · pending"}
              </Badge>
            ))}
            {activeRoles.length === 0 && pending.length === 0 ? (
              <Badge variant="outline">No role assigned yet</Badge>
            ) : null}
          </div>
        </Card>

        <div className="space-y-6 lg:col-span-2">
          {activeRoles.length === 0 ? (
            <Card className="p-6">
              <h2 className="text-lg font-semibold">Approval pending</h2>
              <p className="mt-2 text-sm text-muted-foreground">
                Your request is with the institute sports head. You will get full access as soon
                as it is approved.
              </p>
            </Card>
          ) : (
            activeRoles.map((role) => {
              const panel = PANELS[role];
              if (!panel) return null;
              return (
                <Card key={role} className="p-6">
                  <h2 className="text-lg font-semibold">{panel.title}</h2>
                  <ul className="mt-3 space-y-2 text-sm text-muted-foreground">
                    {panel.items.map((item) => (
                      <li key={item}>• {item}</li>
                    ))}
                  </ul>
                </Card>
              );
            })
          )}

          <Card className="flex flex-wrap gap-3 p-6">
            <Button asChild>
              <Link to="/portal">Open member portal</Link>
            </Button>
            <Button asChild variant="outline">
              <Link to="/tournaments">Tournaments</Link>
            </Button>
            <Button asChild variant="outline">
              <Link to="/dashboard">Analytics</Link>
            </Button>
          </Card>
        </div>
      </div>
    </div>
  );
}

function Field({ label, value }: { label: string; value: string | null | undefined }) {
  return (
    <div>
      <dt className="text-xs uppercase tracking-wide text-muted-foreground">{label}</dt>
      <dd className="font-medium">{value || "—"}</dd>
    </div>
  );
}
