import { createFileRoute } from "@tanstack/react-router";
import { ExternalLink, ImagePlus, Lock } from "lucide-react";

import { FeatureAccessGate } from "@/components/access/FeatureAccessGate";

export const Route = createFileRoute("/gallery")({
  component: GalleryPage,
});

function GalleryPage() {
  return (
    <FeatureAccessGate
      feature="gallery"
      title="Tournament Gallery"
      description="Access approved tournament photo galleries and maintain digital event memories."
    >
      <main className="ks-page">
        <div className="ks-container">
          <div className="ks-page-header">
            <div>
              <p className="ks-eyebrow">DIGITAL SPORTS RECORD</p>
              <h1 className="ks-page-title">Tournament Gallery</h1>
              <p className="ks-page-description">
                View and manage tournament photographs through
                authorised Google Drive galleries.
              </p>
            </div>

            <button className="ks-primary-button">
              <ImagePlus size={17} />
              Add Gallery
            </button>
          </div>

          <div className="ks-grid-2">
            <GalleryCard
              title="SGSITS Annual Sports Meet"
              sport="Athletics"
              date="18 Sep 2026"
              link="https://drive.google.com/"
            />

            <GalleryCard
              title="Inter-Department Cricket"
              sport="Cricket"
              date="21 Sep 2026"
              link="https://drive.google.com/"
            />
          </div>
        </div>
      </main>
    </FeatureAccessGate>
  );
}

function GalleryCard({
  title,
  sport,
  date,
  link,
}: {
  title: string;
  sport: string;
  date: string;
  link: string;
}) {
  return (
    <div className="ks-card overflow-hidden">
      <div className="flex h-48 items-center justify-center bg-gradient-to-br from-pink-100 via-purple-100 to-blue-100">
        <ImagePlus size={52} className="text-primary/50" />
      </div>

      <div className="p-6">
        <div className="text-xs font-semibold uppercase tracking-wider text-primary">
          {sport}
        </div>

        <h3 className="mt-2 text-xl font-bold">{title}</h3>

        <p className="mt-2 text-sm text-muted-foreground">
          {date}
        </p>

        <a
          href={link}
          target="_blank"
          rel="noreferrer"
          className="ks-outline-button mt-5 inline-flex"
        >
          <ExternalLink size={16} />
          Open Photos
        </a>
      </div>
    </div>
  );
}