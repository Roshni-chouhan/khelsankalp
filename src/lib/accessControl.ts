export type ControlledFeature =
  | "gallery"
  | "schedule"
  | "fixtures"
  | "calendar";

export type AccessRequestStatus =
  | "pending"
  | "approved"
  | "rejected";

export interface AccessRequest {
  id: string;
  feature: ControlledFeature;
  requestedBy: string;
  role: "Organizer" | "Core Team" | "Sports Head";
  reason: string;
  status: AccessRequestStatus;
  requestedAt: string;
  reviewedAt?: string;
}

const STORAGE_KEY = "khelsankalp_access_requests";

export function getAccessRequests(): AccessRequest[] {
  if (typeof window === "undefined") return [];

  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    return stored ? JSON.parse(stored) : [];
  } catch {
    return [];
  }
}

function saveAccessRequests(requests: AccessRequest[]) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(requests));
}

export function getFeatureLabel(feature: ControlledFeature) {
  const labels: Record<ControlledFeature, string> = {
    gallery: "Tournament Gallery",
    schedule: "Tournament Schedule",
    fixtures: "Fixtures",
    calendar: "Sports Calendar",
  };

  return labels[feature];
}

export function getFeatureIcon(feature: ControlledFeature) {
  const icons: Record<ControlledFeature, string> = {
    gallery: "📸",
    schedule: "📅",
    fixtures: "🏆",
    calendar: "🗓️",
  };

  return icons[feature];
}

export function getFeatureAccess(
  feature: ControlledFeature,
): AccessRequestStatus {
  const requests = getAccessRequests();

  const featureRequests = requests.filter(
    (request) => request.feature === feature,
  );

  if (featureRequests.some((request) => request.status === "approved")) {
    return "approved";
  }

  if (featureRequests.some((request) => request.status === "pending")) {
    return "pending";
  }

  return "rejected";
}

export function createAccessRequest(
  feature: ControlledFeature,
  requestedBy = "Demo Organizer",
  role: AccessRequest["role"] = "Organizer",
  reason = "Requesting access to manage tournament information.",
) {
  const requests = getAccessRequests();

  const existingPending = requests.find(
    (request) =>
      request.feature === feature &&
      request.status === "pending",
  );

  if (existingPending) {
    return existingPending;
  }

  const request: AccessRequest = {
    id: `REQ-${Date.now()}`,
    feature,
    requestedBy,
    role,
    reason,
    status: "pending",
    requestedAt: new Date().toISOString(),
  };

  saveAccessRequests([request, ...requests]);

  return request;
}

export function updateAccessRequest(
  requestId: string,
  status: "approved" | "rejected",
) {
  const requests = getAccessRequests();

  const updated = requests.map((request) =>
    request.id === requestId
      ? {
          ...request,
          status,
          reviewedAt: new Date().toISOString(),
        }
      : request,
  );

  saveAccessRequests(updated);

  return updated;
}