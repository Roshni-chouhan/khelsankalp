import { useState } from "react";
import {
  CalendarDays,
  CheckCircle2,
  Clock3,
  Lock,
  Send,
  XCircle,
} from "lucide-react";

import {
  createAccessRequest,
  type ControlledFeature,
  getFeatureAccess,
} from "@/lib/accessControl";

interface FeatureRequestCardProps {
  feature: ControlledFeature;
  title: string;
  description: string;
  icon: string;
}

export function FeatureRequestCard({
  feature,
  title,
  description,
  icon,
}: FeatureRequestCardProps) {
  const [status, setStatus] = useState(() =>
    getFeatureAccess(feature),
  );

  function handleRequest() {
    createAccessRequest(
      feature,
      "Demo Organizer",
      "Organizer",
      `Request access to manage ${title}.`,
    );

    setStatus("pending");
  }

  return (
    <div className="ks-access-card">
      <div className="ks-access-icon">{icon}</div>

      <div className="flex-1">
        <div className="flex flex-wrap items-center gap-2">
          <h3 className="ks-card-title">{title}</h3>

          {status === "pending" && (
            <span className="ks-status pending">
              <Clock3 size={13} />
              Pending approval
            </span>
          )}

          {status === "approved" && (
            <span className="ks-status approved">
              <CheckCircle2 size={13} />
              Approved
            </span>
          )}

          {status === "rejected" && (
            <span className="ks-status rejected">
              <XCircle size={13} />
              Rejected
            </span>
          )}
        </div>

        <p className="mt-2 text-sm text-muted-foreground">
          {description}
        </p>

        {status !== "approved" && (
          <button
            type="button"
            onClick={handleRequest}
            disabled={status === "pending"}
            className="ks-primary-button mt-5"
          >
            {status === "pending" ? (
              <>
                <Clock3 size={16} />
                Waiting for Super Admin
              </>
            ) : (
              <>
                <Send size={16} />
                Request Access
              </>
            )}
          </button>
        )}

        {status === "approved" && (
          <button
            type="button"
            className="ks-primary-button mt-5"
            onClick={() => {
              window.location.href = `/${feature}`;
            }}
          >
            <CheckCircle2 size={16} />
            Open {title}
          </button>
        )}
      </div>
    </div>
  );
}