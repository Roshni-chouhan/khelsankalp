import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import type { Department, PointsRow } from "@/types";

export function DepartmentLeaderboard({ rows }: { rows: Department[] }) {
  return (
    <div className="overflow-x-auto rounded-2xl border border-border bg-card">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-12">#</TableHead>
            <TableHead>Department</TableHead>
            <TableHead className="text-center">🥇</TableHead>
            <TableHead className="text-center">🥈</TableHead>
            <TableHead className="text-center">🥉</TableHead>
            <TableHead className="text-right">Points</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {rows.map((d, i) => (
            <TableRow key={d.code}>
              <TableCell className="font-semibold text-muted-foreground">{i + 1}</TableCell>
              <TableCell>
                <div className="flex min-w-0 items-center gap-2">
                  <Badge variant="secondary" className="shrink-0">{d.code}</Badge>
                  <span className="truncate text-sm text-muted-foreground">{d.name}</span>
                </div>
              </TableCell>
              <TableCell className="text-center">{d.gold}</TableCell>
              <TableCell className="text-center">{d.silver}</TableCell>
              <TableCell className="text-center">{d.bronze}</TableCell>
              <TableCell className="text-right font-display font-bold text-primary">{d.points}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}

export function PointsTable({ rows }: { rows: PointsRow[] }) {
  return (
    <div className="overflow-x-auto rounded-2xl border border-border bg-card">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-12">#</TableHead>
            <TableHead>Team</TableHead>
            <TableHead className="text-center">P</TableHead>
            <TableHead className="text-center">W</TableHead>
            <TableHead className="text-center">L</TableHead>
            <TableHead className="text-center">D</TableHead>
            <TableHead className="text-center">NRR/GD</TableHead>
            <TableHead className="text-right">Pts</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {rows.map((r, i) => (
            <TableRow key={r.team}>
              <TableCell className="font-semibold text-muted-foreground">{i + 1}</TableCell>
              <TableCell className="font-medium">{r.team}</TableCell>
              <TableCell className="text-center">{r.played}</TableCell>
              <TableCell className="text-center">{r.won}</TableCell>
              <TableCell className="text-center">{r.lost}</TableCell>
              <TableCell className="text-center">{r.drawn}</TableCell>
              <TableCell className="text-center text-muted-foreground">{r.nrr}</TableCell>
              <TableCell className="text-right font-display font-bold text-primary">{r.points}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
