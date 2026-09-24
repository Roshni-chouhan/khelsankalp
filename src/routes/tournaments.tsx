import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { PageHeader } from "@/components/common/PageHeader";
import { TournamentCard } from "@/components/cards/EntityCards";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { sports, tournaments } from "@/data/mock";

export const Route = createFileRoute("/tournaments")({
  head: () => ({
    meta: [
      { title: "Tournaments — KhelSankalp SGSITS" },
      {
        name: "description",
        content:
          "Every SGSITS Indore tournament: fixtures, formats, registration deadlines, live scores and points tables.",
      },
      { property: "og:title", content: "Tournaments — KhelSankalp SGSITS" },
      { property: "og:description", content: "Fixtures, formats and live standings for SGSITS tournaments." },
    ],
  }),
  component: TournamentsPage,
});

function TournamentsPage() {
  const [q, setQ] = useState("");
  const [sport, setSport] = useState("all");
  const [status, setStatus] = useState("all");
  const [format, setFormat] = useState("all");

  const list = useMemo(
    () =>
      tournaments.filter(
        (t) =>
          t.name.toLowerCase().includes(q.toLowerCase()) &&
          (sport === "all" || t.sport === sport) &&
          (status === "all" || t.status === status) &&
          (format === "all" || t.format === format),
      ),
    [q, sport, status, format],
  );

  return (
    <div>
      <PageHeader
        eyebrow="Compete"
        title="Tournaments"
        description="Knockout, league and round-robin competitions organised by the SGSITS Sports Council."
        actions={<RegisterTeamDialog />}
      />
      <div className="mx-auto max-w-7xl px-4 py-10">
        <div className="grid gap-3 md:grid-cols-4">
          <Input placeholder="Search tournaments…" value={q} onChange={(e) => setQ(e.target.value)} />
          <Select value={sport} onValueChange={setSport}>
            <SelectTrigger><SelectValue placeholder="Sport" /></SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All sports</SelectItem>
              {sports.map((s) => (
                <SelectItem key={s.id} value={s.id}>{s.icon} {s.name}</SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Select value={status} onValueChange={setStatus}>
            <SelectTrigger><SelectValue placeholder="Status" /></SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Any status</SelectItem>
              <SelectItem value="ongoing">Ongoing</SelectItem>
              <SelectItem value="registration-open">Registration open</SelectItem>
              <SelectItem value="upcoming">Upcoming</SelectItem>
              <SelectItem value="completed">Completed</SelectItem>
            </SelectContent>
          </Select>
          <Select value={format} onValueChange={setFormat}>
            <SelectTrigger><SelectValue placeholder="Format" /></SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Any format</SelectItem>
              <SelectItem value="knockout">Knockout</SelectItem>
              <SelectItem value="league">League</SelectItem>
              <SelectItem value="round-robin">Round robin</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <p className="mt-6 text-sm text-muted-foreground">{list.length} tournament(s)</p>
        <div className="mt-4 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
          {list.map((t) => (
            <TournamentCard key={t.id} tournament={t} />
          ))}
        </div>
      </div>
    </div>
  );
}

function RegisterTeamDialog() {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button className="gradient-royal text-primary-foreground">Register a team</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Team registration</DialogTitle>
          <DialogDescription>
            Submit your departmental entry to the SGSITS Sports Council for approval.
          </DialogDescription>
        </DialogHeader>
        <form
          className="space-y-4"
          onSubmit={(e) => {
            e.preventDefault();
            toast.success("Registration submitted for Sports Council approval");
          }}
        >
          <div className="grid gap-2">
            <Label htmlFor="team">Team name</Label>
            <Input id="team" placeholder="e.g. CSE Coders XI" required />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="tournament">Tournament</Label>
            <Select defaultValue={tournaments[0]!.id}>
              <SelectTrigger id="tournament"><SelectValue /></SelectTrigger>
              <SelectContent>
                {tournaments.map((t) => (
                  <SelectItem key={t.id} value={t.id}>{t.name}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="grid gap-2">
            <Label htmlFor="roster">Roster (one player per line)</Label>
            <Textarea id="roster" rows={4} placeholder="Aarav Deshmukh — 0801CS221012" />
          </div>
          <DialogFooter>
            <Button type="submit" className="gradient-royal text-primary-foreground">
              Submit entry
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
