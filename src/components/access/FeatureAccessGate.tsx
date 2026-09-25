import { useState, type ReactNode } from "react";
import { Clock3, Lock, Send } from "lucide-react";

import {
  createAccessRequest,
  getFeatureAccess,
  type ControlledFeature,
} from "@/lib/accessControl";

interface FeatureAccessGateProps {
  feature: ControlledFeature;
  title: string;
  description: string;
  children: ReactNode;
}

export function FeatureAccessGate({
  feature,
  title,
  description,
  children,
}: FeatureAccessGateProps) {
  const [status, setStatus] = useState(() =>
    getFeatureAccess(feature),
  );

  if (status === "approved") {
    return <>{children}</>;
  }

  function requestAccess() {
    createAccessRequest(
      feature,
      "Demo Organizer",
      "Organizer",
      `Request access to manage ${title}.`,
    );

    setStatus("pending");
  }

  return (
    <section className="ks-feature-lock">
      <div className="ks-feature-lock-icon">
        {status === "pending" ? (
          <Clock3 size={34} />
        ) : (
          <Lock size={34} />
        )}
      </div>

      <div className="max-w-xl">
        <p className="ks-eyebrow">
          SUPER ADMIN CONTROLLED
        </p>

        <h1 className="mt-3 text-3xl font-bold tracking-tight">
          {title}
        </h1>

        <p className="mt-3 text-muted-foreground">
          {description}
        </p>

        {status === "pending" ? (
          <div className="mt-6 rounded-xl border border-amber-200 bg-amber-50 p-4 text-left">
            <div className="flex items-center gap-2 font-semibold text-amber-800">
              <Clock3 size={18} />
              Access request submitted
            </div>

            <p className="mt-1 text-sm text-amber-700">
              Your request is waiting for Super Admin approval.
            </p>
          </div>
        ) : (
          <button
            type="button"
            onClick={requestAccess}
            className="ks-primary-button mt-6"
          >
            <Send size={17} />
            Request Access from Super Admin
          </button>
        )}

        <p className="mt-5 text-xs text-muted-foreground">
          Only approved organisers or authorised sports
          team members can manage this section.
        </p>
      </div>
    </section>
  );
}