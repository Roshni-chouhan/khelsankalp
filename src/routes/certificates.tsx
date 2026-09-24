import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { QrCode, ShieldCheck, Search } from "lucide-react";
import { PageHeader } from "@/components/common/PageHeader";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { certificates } from "@/data/mock";

export const Route = createFileRoute("/certificates")({
  head: () => ({
    meta: [
      { title: "Digital Certificates & QR Verification — KhelSankalp SGSITS" },
      {
        name: "description",
        content:
          "Verify SGSITS Indore sports certificates instantly using the certificate code or QR reference.",
      },
      { property: "og:title", content: "Certificate Verification — KhelSankalp SGSITS" },
      { property: "og:description", content: "Instant QR verification of SGSITS sports certificates." },
    ],
  }),
  component: CertificatesPage,
});

function CertificatesPage() {
  const [code, setCode] = useState("");
  const [result, setResult] = useState<null | { ok: boolean; text: string }>(null);

  const verify = () => {
    const found = certificates.find(
      (c) => c.code.toLowerCase() === code.trim().toLowerCase() || c.id.toLowerCase() === code.trim().toLowerCase(),
    );
    setResult(
      found
        ? { ok: true, text: `Valid — ${found.title} awarded to ${found.athlete} (${found.tournament}).` }
        : { ok: false, text: "No matching certificate found in the SGSITS KhelSankalp registry." },
    );
  };

  return (
    <div>
      <PageHeader
        eyebrow="Registry"
        title="Digital Certificates"
        description="Every KhelSankalp certificate carries a QR code and a unique registry reference that anyone can verify."
      />
      <div className="mx-auto max-w-7xl px-4 py-10">
        <Card className="glass-card gap-4 p-6">
          <h2 className="flex items-center gap-2 text-lg font-bold text-primary">
            <ShieldCheck className="h-5 w-5 text-royal" /> Verify a certificate
          </h2>
          <div className="grid gap-3 sm:grid-cols-[minmax(0,1fr)_auto]">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                value={code}
                onChange={(e) => setCode(e.target.value)}
                placeholder="e.g. SGSITS-UNI-0142-AD or CERT-2025-0142"
                className="pl-9"
              />
            </div>
            <Button onClick={verify} className="gradient-royal text-primary-foreground">Verify</Button>
          </div>
          {result ? (
            <p
              className={`rounded-xl px-4 py-3 text-sm font-medium ${
                result.ok ? "bg-success/12 text-success" : "bg-destructive/10 text-destructive"
              }`}
            >
              {result.text}
            </p>
          ) : null}
        </Card>

        <h2 className="mt-12 text-xl font-bold text-primary">Issued certificates</h2>
        <div className="mt-5 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
          {certificates.map((c) => (
            <Card key={c.id} className="glass-card gap-3 p-6">
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0">
                  <p className="font-semibold text-primary">{c.title}</p>
                  <p className="truncate text-sm text-muted-foreground">{c.athlete}</p>
                </div>
                <Badge variant="secondary" className="shrink-0 capitalize">{c.type}</Badge>
              </div>
              <p className="text-sm text-muted-foreground">{c.tournament}</p>
              <div className="mt-1 flex items-center gap-3 rounded-xl bg-surface p-3">
                <QrCode className="h-12 w-12 shrink-0 text-primary" />
                <span className="min-w-0">
                  <span className="block truncate font-mono text-xs text-muted-foreground">{c.code}</span>
                  <span className="block text-xs text-muted-foreground">Issued {c.issuedOn}</span>
                </span>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}
