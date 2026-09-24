import { useEffect, useState } from "react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { supabase } from "@/integrations/supabase/client";
import type { Profile } from "@/hooks/useSession";

type Props = { profile: Profile | null; onSaved?: () => void };

export function ProfileEditor({ profile, onSaved }: Props) {
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [branch, setBranch] = useState("");
  const [year, setYear] = useState("");
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    setFullName(profile?.full_name ?? "");
    setEmail(profile?.email ?? "");
    setPhone(profile?.phone ?? "");
    setBranch(profile?.branch ?? "");
    setYear(profile?.year ?? "");
  }, [profile]);

  if (!profile) return null;

  async function save(e: React.FormEvent) {
    e.preventDefault();
    if (!profile) return;
    const name = fullName.trim();
    const mail = email.trim();
    if (name.length < 2 || name.length > 80) {
      toast.error("Enter a valid full name.");
      return;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(mail) || mail.length > 255) {
      toast.error("Enter a valid email address.");
      return;
    }
    setBusy(true);
    try {
      const { error } = await supabase
        .from("profiles")
        .update({
          full_name: name,
          email: mail,
          phone: phone.trim().slice(0, 20) || null,
          branch: branch.trim().slice(0, 80) || null,
          year: year.trim().slice(0, 30) || null,
        })
        .eq("id", profile.id);
      if (error) {
        toast.error("Could not save your details. Please try again.");
        return;
      }
      if (mail !== profile.email) {
        const { error: authError } = await supabase.auth.updateUser({ email: mail });
        toast[authError ? "error" : "info"](
          authError
            ? "Details saved, but the sign-in email could not be changed."
            : "Check your new inbox to confirm the sign-in email.",
        );
      }
      toast.success("Profile updated.");
      onSaved?.();
    } finally {
      setBusy(false);
    }
  }

  return (
    <Card className="glass-card overflow-hidden p-0">
      <div className="gradient-royal px-6 py-4">
        <h2 className="text-base font-semibold text-primary-foreground">Edit my profile</h2>
        <p className="text-xs text-primary-foreground/80">
          Keep your name, email and contact number up to date.
        </p>
      </div>
      <form className="grid gap-4 p-6 sm:grid-cols-2" onSubmit={save}>
        <div className="space-y-2">
          <Label htmlFor="pe-name">Full name</Label>
          <Input
            id="pe-name"
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            maxLength={80}
            required
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="pe-email">Email</Label>
          <Input
            id="pe-email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            maxLength={255}
            required
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="pe-phone">Contact number</Label>
          <Input
            id="pe-phone"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            maxLength={20}
            placeholder="+91 98xxxxxxx"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="pe-branch">Branch / department</Label>
          <Input
            id="pe-branch"
            value={branch}
            onChange={(e) => setBranch(e.target.value)}
            maxLength={80}
          />
        </div>
        <div className="space-y-2 sm:col-span-2">
          <Label htmlFor="pe-year">Year of study / designation</Label>
          <Input
            id="pe-year"
            value={year}
            onChange={(e) => setYear(e.target.value)}
            maxLength={30}
          />
        </div>
        <div className="sm:col-span-2">
          <Button type="submit" disabled={busy} className="gradient-royal text-primary-foreground">
            {busy ? "Saving…" : "Save changes"}
          </Button>
        </div>
      </form>
    </Card>
  );
}
