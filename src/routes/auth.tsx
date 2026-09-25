import { createFileRoute, useNavigate, useRouter } from "@tanstack/react-router";
import { useState } from "react";
import { toast } from "sonner";
import { GraduationCap, ShieldCheck, Trophy, Users } from "lucide-react";

import { PageHeader } from "@/components/common/PageHeader";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import { supabase } from "@/integrations/supabase/client";
import {
  CORE_TEAM_DESIGNATIONS,
  registerMember,
  requestPasswordReset,
  signInWithIdentifier,
  type RegistrableRole,
} from "@/lib/auth.functions";

export const Route = createFileRoute("/auth")({
  head: () => ({
    meta: [
      {
        title: "Role sign-in & registration — KhelSankalp SGSITS",
      },
      {
        name: "description",
        content:
          "Separate KhelSankalp desks for SGSITS athletes, sports core team members, the institute sports head and the super admin — register or sign in to your own dashboard.",
      },
      {
        property: "og:title",
        content:
          "Role sign-in & registration — KhelSankalp SGSITS",
      },
      {
        property: "og:description",
        content:
          "Athlete, core team, institute sports head and super admin desks for KhelSankalp at SGSITS Indore.",
      },
      {
        property: "og:type",
        content: "website",
      },
      {
        name: "twitter:card",
        content: "summary_large_image",
      },
    ],
  }),
  component: AuthPage,
});

const BRANCHES = [
  "Computer Engineering",
  "Information Technology",
  "Electronics & Telecommunication",
  "Electrical Engineering",
  "Mechanical Engineering",
  "Civil Engineering",
  "Electronics & Instrumentation",
  "Biomedical Engineering",
  "Industrial & Production",
  "MCA",
  "MBA",
  "Applied Sciences & Humanities",
];

const YEARS = [
  "1st year",
  "2nd year",
  "3rd year",
  "4th year",
  "Post graduate",
];

const DESIGNATIONS = [
  "Institute Sports Head",
  "Head of Department",
  "Sports President / Co-ordinator",
];

type Desk = {
  role: RegistrableRole;
  title: string;
  blurb: string;
  icon: typeof Trophy;
  kind: "student" | "faculty";
  idLabel: string;
  idPlaceholder: string;
  emailLabel: string;
  emailPlaceholder: string;
  note: string;
  tone: {
    chip: string;
    ring: string;
    glow: string;
  };
};

const DESKS: Desk[] = [
  {
    role: "athlete",
    title: "Athlete",
    blurb:
      "SGSITS students who play for their branch or the institute team.",
    icon: Trophy,
    kind: "student",
    idLabel: "SGSITS roll number",
    idPlaceholder: "0801CS221001",
    emailLabel: "Student email",
    emailPlaceholder: "you@sgsits.ac.in",
    note:
      "Athlete dashboards are activated immediately after registering.",
    tone: {
      chip: "bg-gold/25 text-gold-foreground",
      ring: "ring-gold",
      glow: "from-gold/30",
    },
  },
  {
    role: "core_team",
    title: "Sports Core Team",
    blurb:
      "Student organisers running fixtures, scoring and match day operations.",
    icon: Users,
    kind: "student",
    idLabel: "SGSITS roll number",
    idPlaceholder: "0801ME221014",
    emailLabel: "Student email",
    emailPlaceholder: "you@sgsits.ac.in",
    note:
      "Core team access is activated once the institute sports head approves it.",
    tone: {
      chip: "bg-royal/20 text-royal",
      ring: "ring-royal",
      glow: "from-royal/30",
    },
  },
  {
    role: "sports_head",
    title: "Institute Sports Head",
    blurb:
      "Faculty in charge of institute sports — signs in with the official faculty email.",
    icon: GraduationCap,
    kind: "faculty",
    idLabel: "Faculty / employee ID",
    idPlaceholder: "SGSITS-FAC-1042",
    emailLabel: "Official faculty email",
    emailPlaceholder: "name@sgsits.ac.in",
    note:
      "Faculty access is activated once the super admin approves it.",
    tone: {
      chip: "bg-success/20 text-success",
      ring: "ring-success",
      glow: "from-success/30",
    },
  },
  {
    role: "superadmin",
    title: "Super Admin",
    blurb:
      "Sports council administrator for the full KhelSankalp ecosystem.",
    icon: ShieldCheck,
    kind: "faculty",
    idLabel: "Staff / employee ID",
    idPlaceholder: "SGSITS-ADM-001",
    emailLabel: "Official email",
    emailPlaceholder: "sports@sgsits.ac.in",
    note:
      "The first super admin is activated instantly; later requests need approval.",
    tone: {
      chip: "bg-live/20 text-live",
      ring: "ring-live",
      glow: "from-live/30",
    },
  },
];

function AuthPage() {
  const navigate = useNavigate();
  const router = useRouter();

  const [desk, setDesk] = useState<Desk>(DESKS[0]!);

  const [signInBusy, setSignInBusy] = useState(false);
  const [identifier, setIdentifier] = useState("");
  const [password, setPassword] = useState("");

  const [regBusy, setRegBusy] = useState(false);
  const [branch, setBranch] = useState<string>(BRANCHES[0]!);
  const [year, setYear] = useState<string>(YEARS[2]!);

  // Faculty designation
  const [designation, setDesignation] = useState<string>(
    DESIGNATIONS[0]!,
  );

  // Core Team designation
  const [coreTeamDesignation, setCoreTeamDesignation] =
    useState<string>("");

  const isFaculty = desk.kind === "faculty";
  const isCoreTeam = desk.role === "core_team";

  function pickDesk(next: Desk) {
    setDesk(next);
    setIdentifier("");
    setPassword("");

    /*
     * Reset Core Team designation whenever the user
     * changes the selected desk.
     */
    setCoreTeamDesignation("");
  }

  async function finishSignIn(
    accessToken: string,
    refreshToken: string,
  ) {
    const { error } = await supabase.auth.setSession({
      access_token: accessToken,
      refresh_token: refreshToken,
    });

    if (error) {
      toast.error(
        "Could not start your session. Please try again.",
      );
      return;
    }

    toast.success("Welcome back to KhelSankalp");

    await router.invalidate();

    void navigate({
      to: "/my-dashboard",
    });
  }

  async function handleSignIn(
    e: React.FormEvent,
  ) {
    e.preventDefault();

    const id = identifier.trim();

    if (!id) {
      toast.error(
        isFaculty
          ? "Enter your official email."
          : "Enter your roll number.",
      );
      return;
    }

    setSignInBusy(true);

    try {
      const res = await signInWithIdentifier({
        data: {
          identifier: id,
          password,
        },
      });

      if (!res.ok) {
        toast.error(res.error);
        return;
      }

      await finishSignIn(
        res.accessToken,
        res.refreshToken,
      );
    } catch {
      toast.error(
        "Something went wrong. Please try again.",
      );
    } finally {
      setSignInBusy(false);
    }
  }

  async function handleRegister(
    e: React.FormEvent,
  ) {
    e.preventDefault();

    /*
     * Core Team must select a designation.
     */
    if (
      isCoreTeam &&
      !coreTeamDesignation
    ) {
      toast.error(
        "Please select your Core Team designation.",
      );
      return;
    }

    const form = new FormData(
      e.target as HTMLFormElement,
    );

    setRegBusy(true);

    try {
      const res = await registerMember({
        data: {
          fullName: String(
            form.get("fullName") ?? "",
          ),

          rollNumber: String(
            form.get("memberId") ?? "",
          ),

          email: String(
            form.get("email") ?? "",
          ),

          password: String(
            form.get("password") ?? "",
          ),

          phone: String(
            form.get("phone") ?? "",
          ),

          year: isFaculty
            ? designation
            : year,

          branch,

          role: desk.role,

          /*
           * Send Core Team designation
           * only when registering as Core Team.
           */
          ...(isCoreTeam
            ? {
                designation:
                  coreTeamDesignation as
                    | (typeof CORE_TEAM_DESIGNATIONS)[number]
                    | undefined,
              }
            : {}),
        },
      });

      if (!res.ok) {
        toast.error(res.error);
        return;
      }

      if (res.status === "approved") {
        toast.success(
          `${desk.title} account created. Sign in to open your dashboard.`,
        );
      } else {
        toast.success(
          desk.role === "core_team"
            ? "Request sent. The institute sports head will approve your access."
            : "Request sent. The super admin will approve your access.",
        );
      }

      /*
       * Reset the form after successful registration.
       */
      (e.target as HTMLFormElement).reset();

      setCoreTeamDesignation("");
    } catch (err) {
      toast.error(
        err instanceof Error &&
          err.message.includes("Password")
          ? "Password must be at least 8 characters."
          : "Please check the details and try again.",
      );
    } finally {
      setRegBusy(false);
    }
  }

  async function handleForgot() {
    const id = identifier.trim();

    if (!id) {
      toast.error(
        "Enter your roll number or official email first.",
      );
      return;
    }

    await requestPasswordReset({
      data: {
        identifier: id,
        origin: window.location.origin,
      },
    });

    toast.success(
      "If that account exists, a reset link is on its way by email.",
    );
  }

  return (
    <div className="relative overflow-hidden">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 -top-40 h-[28rem] bg-[radial-gradient(60%_60%_at_20%_20%,var(--royal),transparent_70%),radial-gradient(50%_50%_at_80%_10%,var(--gold),transparent_70%)] opacity-20 blur-3xl"
      />

      <div className="relative">
        <PageHeader
          eyebrow="KhelSankalp Accounts"
          title="Choose your desk"
          description="Every role has its own KhelSankalp desk — register or sign in below and land straight on the dashboard built for you."
        />
      </div>

      <div className="relative mx-auto max-w-5xl space-y-8 px-4 py-10">
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {DESKS.map((d) => {
            const Icon = d.icon;
            const active = d.role === desk.role;

            return (
              <button
                key={d.role}
                type="button"
                onClick={() => pickDesk(d)}
                aria-pressed={active}
                className={`group relative overflow-hidden rounded-2xl p-5 text-left transition glass-card card-hover ${
                  active
                    ? `ring-2 shadow-elevated ${d.tone.ring}`
                    : "opacity-85 hover:opacity-100"
                }`}
              >
                <span
                  aria-hidden="true"
                  className={`pointer-events-none absolute -right-10 -top-10 h-28 w-28 rounded-full bg-gradient-to-br to-transparent blur-2xl transition-opacity ${d.tone.glow}${
                    active
                      ? "opacity-100"
                      : "opacity-50 group-hover:opacity-90"
                  }`}
                />

                <span
                  className={`relative mb-3 inline-flex h-10 w-10 items-center justify-center rounded-xl ${d.tone.chip}`}
                >
                  <Icon
                    className="h-5 w-5"
                    aria-hidden="true"
                  />
                </span>

                <p className="relative font-semibold">
                  {d.title}
                </p>

                <p className="relative mt-1 text-xs text-muted-foreground">
                  {d.blurb}
                </p>

                {active ? (
                  <span className="relative mt-3 inline-block rounded-full bg-primary px-2.5 py-0.5 text-[11px] font-medium text-primary-foreground">
                    Selected desk
                  </span>
                ) : null}
              </button>
            );
          })}
        </div>

        <Tabs defaultValue="signin">
          <TabsList className="w-full bg-secondary/70">
            <TabsTrigger
              value="signin"
              className="flex-1"
            >
              {desk.title} sign in
            </TabsTrigger>

            <TabsTrigger
              value="register"
              className="flex-1"
            >
              {desk.title} registration
            </TabsTrigger>
          </TabsList>

          {/* =========================
              SIGN IN
          ========================= */}
          <TabsContent
            value="signin"
            className="mt-6"
          >
            <Card className="glass-card mx-auto max-w-xl overflow-hidden p-0">
              <div className="gradient-royal px-6 py-4">
                <p className="text-sm font-semibold text-primary-foreground">
                  {desk.title} sign in
                </p>

                <p className="text-xs text-primary-foreground/80">
                  {desk.note}
                </p>
              </div>

              <div className="p-6">
                <form
                  className="space-y-4"
                  onSubmit={handleSignIn}
                >
                  <div className="space-y-2">
                    <Label htmlFor="identifier">
                      {isFaculty
                        ? desk.emailLabel
                        : desk.idLabel}
                    </Label>

                    <Input
                      id="identifier"
                      value={identifier}
                      onChange={(e) =>
                        setIdentifier(
                          e.target.value,
                        )
                      }
                      placeholder={
                        isFaculty
                          ? desk.emailPlaceholder
                          : desk.idPlaceholder
                      }
                      required
                      maxLength={255}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="password">
                      Password
                    </Label>

                    <Input
                      id="password"
                      type="password"
                      value={password}
                      onChange={(e) =>
                        setPassword(
                          e.target.value,
                        )
                      }
                      required
                      maxLength={72}
                    />
                  </div>

                  <div className="flex flex-wrap items-center justify-between gap-3">
                    <Button
                      type="submit"
                      disabled={signInBusy}
                      className="gradient-royal text-primary-foreground"
                    >
                      {signInBusy
                        ? "Signing in…"
                        : "Sign in"}
                    </Button>

                    <Button
                      type="button"
                      variant="link"
                      onClick={handleForgot}
                    >
                      Forgot password?
                    </Button>
                  </div>
                </form>
              </div>
            </Card>
          </TabsContent>

          {/* =========================
              REGISTRATION
          ========================= */}
          <TabsContent
            value="register"
            className="mt-6"
          >
            <Card className="glass-card border-t-4 border-t-gold p-6">
              <form
                className="space-y-4"
                onSubmit={handleRegister}
                key={desk.role}
              >
                <div className="grid gap-4 sm:grid-cols-2">
                  {/* Full Name */}
                  <div className="space-y-2">
                    <Label htmlFor="fullName">
                      Full name
                    </Label>

                    <Input
                      id="fullName"
                      name="fullName"
                      required
                      maxLength={80}
                    />
                  </div>

                  {/* ID */}
                  <div className="space-y-2">
                    <Label htmlFor="memberId">
                      {desk.idLabel}
                    </Label>

                    <Input
                      id="memberId"
                      name="memberId"
                      required
                      maxLength={30}
                      placeholder={
                        desk.idPlaceholder
                      }
                    />
                  </div>

                  {/* Email */}
                  <div className="space-y-2">
                    <Label htmlFor="email">
                      {desk.emailLabel}
                    </Label>

                    <Input
                      id="email"
                      name="email"
                      type="email"
                      required
                      maxLength={255}
                      placeholder={
                        desk.emailPlaceholder
                      }
                    />
                  </div>

                  {/* Password */}
                  <div className="space-y-2">
                    <Label htmlFor="regPassword">
                      Password
                    </Label>

                    <Input
                      id="regPassword"
                      name="password"
                      type="password"
                      required
                      minLength={8}
                      maxLength={72}
                    />
                  </div>

                  {/* Branch */}
                  <div className="space-y-2">
                    <Label>
                      {isFaculty
                        ? "Department"
                        : "Branch"}
                    </Label>

                    <Select
                      value={branch}
                      onValueChange={setBranch}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>

                      <SelectContent>
                        {BRANCHES.map((b) => (
                          <SelectItem
                            key={b}
                            value={b}
                          >
                            {b}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  {/* ==================================
                      DESIGNATION / YEAR
                  ================================== */}
                  <div className="space-y-2">
                    <Label>
                      {isCoreTeam
                        ? "Core Team Designation"
                        : isFaculty
                          ? "Designation"
                          : "Year of study"}
                    </Label>

                    {/* CORE TEAM DESIGNATION */}
                    {isCoreTeam ? (
                      <Select
                        value={coreTeamDesignation}
                        onValueChange={
                          setCoreTeamDesignation
                        }
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select designation" />
                        </SelectTrigger>

                        <SelectContent>
                          {CORE_TEAM_DESIGNATIONS.map(
                            (item) => (
                              <SelectItem
                                key={item}
                                value={item}
                              >
                                {item}
                              </SelectItem>
                            ),
                          )}
                        </SelectContent>
                      </Select>
                    ) : isFaculty ? (
                      /* FACULTY DESIGNATION */
                      <Select
                        value={designation}
                        onValueChange={
                          setDesignation
                        }
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>

                        <SelectContent>
                          {DESIGNATIONS.map(
                            (d) => (
                              <SelectItem
                                key={d}
                                value={d}
                              >
                                {d}
                              </SelectItem>
                            ),
                          )}
                        </SelectContent>
                      </Select>
                    ) : (
                      /* ATHLETE YEAR */
                      <Select
                        value={year}
                        onValueChange={setYear}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>

                        <SelectContent>
                          {YEARS.map((y) => (
                            <SelectItem
                              key={y}
                              value={y}
                            >
                              {y}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    )}
                  </div>

                  {/* Phone */}
                  <div className="space-y-2 sm:col-span-2">
                    <Label htmlFor="phone">
                      Contact number
                    </Label>

                    <Input
                      id="phone"
                      name="phone"
                      required
                      maxLength={20}
                      placeholder="+91 98xxxxxxx"
                    />
                  </div>
                </div>

                {/* Core Team information */}
                {isCoreTeam ? (
                  <div className="rounded-xl border border-royal/20 bg-royal/5 p-4">
                    <p className="text-sm font-semibold text-royal">
                      Sports Core Team
                    </p>

                    <p className="mt-1 text-xs leading-5 text-muted-foreground">
                      Select the responsibility you will
                      handle within the KhelSankalp Core Team.
                      Your designation will be displayed on
                      your dashboard after approval.
                    </p>
                  </div>
                ) : null}

                <p className="text-xs text-muted-foreground">
                  {desk.note}
                </p>

                <Button
                  type="submit"
                  disabled={
                    regBusy ||
                    (isCoreTeam &&
                      !coreTeamDesignation)
                  }
                >
                  {regBusy
                    ? "Creating account…"
                    : `Create ${desk.title.toLowerCase()} account`}
                </Button>
              </form>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}