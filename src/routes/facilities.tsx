import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { MapPin, Clock, Users, Package } from "lucide-react";
import { toast } from "sonner";
import { PageHeader } from "@/components/common/PageHeader";
import { StatusBadge } from "@/components/cards/EntityCards";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { equipment, facilities, sportName } from "@/data/mock";
import type { Facility } from "@/types";

export const Route = createFileRoute("/facilities")({
  head: () => ({
    meta: [
      { title: "Facilities & Booking — KhelSankalp SGSITS" },
      {
        name: "description",
        content:
          "Grounds, courts and the indoor hall at SGSITS Indore — availability and equipment stock.",
      },
      { property: "og:title", content: "Facilities & Booking — KhelSankalp SGSITS" },
      { property: "og:description", content: "Track and Issue SGSITS sports equipment inventory." },
    ],
  }),
  component: FacilitiesPage,
});

function FacilitiesPage() {
  return (
    <div>
      <PageHeader
        eyebrow="Campus infrastructure"
        title="Facilities"
        description="Sports grounds, courts and facilities available at SGSITS."
        actions={
          <Button asChild variant="outline">
            <Link to="/campus-map">
              <MapPin className="mr-2 h-4 w-4" /> View campus map
            </Link>
          </Button>
        }
      />

      <div className="mx-auto max-w-7xl px-4 py-10">
        <Tabs defaultValue="venues">
          <TabsList>
            <TabsTrigger value="venues">Facilities</TabsTrigger>

            <TabsTrigger value="equipment">
              <Package className="mr-1.5 h-4 w-4" />
              Equipment
            </TabsTrigger>
          </TabsList>

          {/* FACILITIES */}
          <TabsContent
            value="venues"
            className="mt-6 grid gap-4 md:grid-cols-2 lg:grid-cols-3"
          >
            {facilities.map((f) => (
              <Card
                key={f.id}
                className="glass-card card-hover p-5"
              >
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-primary/10">
                    <MapPin className="h-5 w-5 text-primary" />
                  </div>

                  <h3 className="text-lg font-bold text-primary">
                    {f.name}
                  </h3>
                </div>
              </Card>
            ))}
          </TabsContent>

          {/* EQUIPMENT */}
          <TabsContent value="equipment" className="mt-6">
            <div className="overflow-x-auto rounded-2xl border border-border bg-card">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Item</TableHead>
                    <TableHead>Sport</TableHead>
                    <TableHead className="text-center">Total</TableHead>
                    <TableHead className="text-center">Issued</TableHead>
                    <TableHead className="text-center">
                      Available
                    </TableHead>
                    <TableHead>Condition</TableHead>
                    <TableHead>Store</TableHead>
                  </TableRow>
                </TableHeader>

                <TableBody>
                  {equipment.map((e) => (
                    <TableRow key={e.id}>
                      <TableCell className="font-medium">
                        {e.name}
                      </TableCell>

                      <TableCell className="text-muted-foreground">
                        {sportName(e.sport)}
                      </TableCell>

                      <TableCell className="text-center">
                        {e.total}
                      </TableCell>

                      <TableCell className="text-center">
                        {e.issued}
                      </TableCell>

                      <TableCell className="text-center font-semibold text-primary">
                        {e.total - e.issued}
                      </TableCell>

                      <TableCell>
                        <Badge
                          variant="secondary"
                          className="capitalize"
                        >
                          {e.condition}
                        </Badge>
                      </TableCell>

                      <TableCell className="text-muted-foreground">
                        {e.store}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}