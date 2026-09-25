import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import {
  CheckCircle2,
  Clock3,
  ShieldCheck,
  XCircle,
} from "lucide-react";

import {
  getAccessRequests,
  getFeatureLabel,
  updateAccessRequest,
  type AccessRequest,
} from "@/lib/accessControl";

export const Route = createFileRoute("/_authenticated/super-admin-requests")({
  head: () => ({
    meta: [
      {
        title: "Access Requests — KhelSankalp SGSITS",
      },
      {
        name: "description",
        content:
          "Super Admin approval panel for Gallery, Schedule, Fixtures and Calendar access requests.",
      },
    ],
  }),
  component: SuperAdminRequestsPage,
});

function SuperAdminRequestsPage() {
  const [requests, setRequests] = useState<AccessRequest[]>([]);

  function refreshRequests() {
    setRequests(getAccessRequests());
  }

  useEffect(() => {
    refreshRequests();
  }, []);

  function handleDecision(
    requestId: string,
    status: "approved" | "rejected",
  ) {
    const updated = updateAccessRequest(requestId, status);
    setRequests(updated);
  }

  const pending = requests.filter((request) => request.status === "pending");
  const approved = requests.filter((request) => request.status === "approved");
  const rejected = requests.filter((request) => request.status === "rejected");

  return (
    <div className="ks-page">
      <div className="ks-container">
        {/* HEADER */}
        <div className="ks-page-header">
          <div>
            <p className="ks-eyebrow">SUPER ADMIN</p>

            <h1 className="ks-page-title">
              Access Requests
            </h1>

            <p className="ks-page-description">
              Review and control access requests for Gallery, Schedule,
              Fixtures and Calendar management.
            </p>
          </div>

          <div className="ks-access-icon">
            <ShieldCheck size={28} />
          </div>
        </div>

        {/* STATS */}
        <div className="grid gap-4 sm:grid-cols-3">
          <div className="ks-admin-stat">
            <p className="ks-admin-stat-label">
              Pending requests
            </p>
            <p className="ks-admin-stat-value">
              {pending.length}
            </p>
          </div>

          <div className="ks-admin-stat">
            <p className="ks-admin-stat-label">
              Approved
            </p>
            <p className="ks-admin-stat-value">
              {approved.length}
            </p>
          </div>

          <div className="ks-admin-stat">
            <p className="ks-admin-stat-label">
              Rejected
            </p>
            <p className="ks-admin-stat-value">
              {rejected.length}
            </p>
          </div>
        </div>

        {/* REQUEST LIST */}
        <div className="mt-8 space-y-4">
          {requests.length === 0 ? (
            <div className="ks-empty-state">
              <ShieldCheck size={38} />

              <h2>
                No access requests
              </h2>

              <p>
                New requests from organisers and sports team members
                will appear here.
              </p>
            </div>
          ) : (
            requests.map((request) => (
              <div
                key={request.id}
                className="ks-request-row"
              >
                <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
                  {/* REQUEST INFO */}
                  <div className="min-w-0">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="ks-badge">
                        {getFeatureLabel(request.feature)}
                      </span>

                      {request.status === "pending" && (
                        <span className="ks-status pending">
                          <Clock3 size={13} />
                          Pending
                        </span>
                      )}

                      {request.status === "approved" && (
                        <span className="ks-status approved">
                          <CheckCircle2 size={13} />
                          Approved
                        </span>
                      )}

                      {request.status === "rejected" && (
                        <span className="ks-status rejected">
                          <XCircle size={13} />
                          Rejected
                        </span>
                      )}
                    </div>

                    <h2 className="mt-3 text-lg font-bold">
                      {request.requestedBy}
                    </h2>

                    <p className="mt-1 text-sm text-muted-foreground">
                      Role: {request.role}
                    </p>

                    <p className="mt-3 text-sm text-muted-foreground">
                      {request.reason}
                    </p>

                    <p className="mt-3 text-xs text-muted-foreground">
                      Requested:{" "}
                      {new Date(
                        request.requestedAt,
                      ).toLocaleString()}
                    </p>

                    {request.reviewedAt && (
                      <p className="mt-1 text-xs text-muted-foreground">
                        Reviewed:{" "}
                        {new Date(
                          request.reviewedAt,
                        ).toLocaleString()}
                      </p>
                    )}
                  </div>

                  {/* ACTIONS */}
                  {request.status === "pending" && (
                    <div className="flex shrink-0 flex-wrap gap-2">
                      <button
                        type="button"
                        onClick={() =>
                          handleDecision(
                            request.id,
                            "approved",
                          )
                        }
                        className="ks-primary-button"
                      >
                        <CheckCircle2 size={16} />
                        Approve
                      </button>

                      <button
                        type="button"
                        onClick={() =>
                          handleDecision(
                            request.id,
                            "rejected",
                          )
                        }
                        className="ks-danger-button"
                      >
                        <XCircle size={16} />
                        Reject
                      </button>
                    </div>
                  )}
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}