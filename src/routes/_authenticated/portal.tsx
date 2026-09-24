import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useCallback, useEffect, useState } from "react";
import { toast } from "sonner";

import { PageHeader } from "@/components/common/PageHeader";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { supabase } from "@/integrations/supabase/client";
import { useMember } from "@/hooks/useSession";
import { ROLE_LABELS } from "@/lib/auth.functions";

export const Route = createFileRoute("/_authenticated/portal")({
  head: () => ({
    meta: [
      { title: "Member portal — KhelSankalp SGSITS" },
      {
        name: "description",
        content:
          "Post sports shorts, manage role approvals and track your KhelSankalp membership at SGSITS Indore.",
      },
      { property: "og:title", content: "Member portal — KhelSankalp SGSITS" },
      {
        property: "og:description",
        content: "Share match shorts and manage SGSITS sports memberships.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: PortalPage,
});

type FeedPost = {
  id: string;
  caption: string;
  sport: string | null;
  created_at: string;
  media_path: string | null;
  author_id: string;
  url?: string | null;
  authorName?: string;
};

type PendingRow = {
  id: string;
  user_id: string;
  role: string;
  status: string;
  created_at: string;
  name?: string | undefined;
  roll?: string | undefined;
};

function PortalPage() {
  const navigate = useNavigate();
  const { session, profile, roles, approved, ready, isSuperAdmin, isSportsHead } = useMember();

  const [posts, setPosts] = useState<FeedPost[]>([]);
  const [caption, setCaption] = useState("");
  const [sport, setSport] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [busy, setBusy] = useState(false);
  const [pending, setPending] = useState<PendingRow[]>([]);

  const canModerate = isSuperAdmin || isSportsHead;

  const loadFeed = useCallback(async () => {
    const { data, error } = await supabase
      .from("posts")
      .select("*")
      .order("created_at", { ascending: false })
      .limit(30);
    if (error || !data) return;
    const rows = data as FeedPost[];
    const authorIds = [...new Set(rows.map((r) => r.author_id))];
    const { data: authors } = await supabase
      .from("profiles")
      .select("id, full_name")
      .in("id", authorIds);
    const nameById = new Map((authors ?? []).map((a) => [a.id, a.full_name]));

    const withMedia = await Promise.all(
      rows.map(async (row) => {
        let url: string | null = null;
        if (row.media_path) {
          const { data: signed } = await supabase.storage
            .from("shorts")
            .createSignedUrl(row.media_path, 3600);
          url = signed?.signedUrl ?? null;
        }
        return { ...row, url, authorName: nameById.get(row.author_id) ?? "KhelSankalp member" };
      }),
    );
    setPosts(withMedia);
  }, []);

  const loadPending = useCallback(async () => {
    if (!canModerate) return;
    const { data } = await supabase
      .from("user_roles")
      .select("*")
      .eq("status", "pending")
      .order("created_at", { ascending: false });
    const rows = (data ?? []) as PendingRow[];
    if (rows.length === 0) {
      setPending([]);
      return;
    }
    const { data: people } = await supabase
      .from("profiles")
      .select("id, full_name, roll_number")
      .in("id", [...new Set(rows.map((r) => r.user_id))]);
    const map = new Map((people ?? []).map((p) => [p.id, p]));
    setPending(
      rows.map((r) => ({
        ...r,
        name: map.get(r.user_id)?.full_name,
        roll: map.get(r.user_id)?.roll_number,
      })),
    );
  }, [canModerate]);

  useEffect(() => {
    if (!ready) return;
    void loadFeed();
    void loadPending();
  }, [ready, loadFeed, loadPending]);

  async function handlePost(e: React.FormEvent) {
    e.preventDefault();
    if (!session) return;
    if (!caption.trim() && !file) {
      toast.error("Add a caption or a photo.");
      return;
    }
    setBusy(true);
    try {
      let mediaPath: string | null = null;
      let mediaType = "text";
      if (file) {
        const ext = file.name.split(".").pop() ?? "jpg";
        const path = `${session.user.id}/${crypto.randomUUID()}.${ext}`;
        const { error: upErr } = await supabase.storage.from("shorts").upload(path, file);
        if (upErr) {
          toast.error("Could not upload that file.");
          return;
        }
        mediaPath = path;
        mediaType = file.type.startsWith("video") ? "video" : "image";
      }
      const { error } = await supabase.from("posts").insert({
        author_id: session.user.id,
        caption: caption.trim(),
        sport: sport.trim() || null,
        media_path: mediaPath,
        media_type: mediaType,
      });
      if (error) {
        toast.error("Could not publish your short.");
        return;
      }
      setCaption("");
      setSport("");
      setFile(null);
      toast.success("Posted to the KhelSankalp feed.");
      await loadFeed();
    } finally {
      setBusy(false);
    }
  }

  async function decide(row: PendingRow, status: "approved" | "rejected") {
    const { error } = await supabase
      .from("user_roles")
      .update({ status, approved_by: session?.user.id ?? null })
      .eq("id", row.id);
    if (error) {
      toast.error("You are not allowed to change that request.");
      return;
    }
    toast.success(status === "approved" ? "Access approved." : "Request rejected.");
    await loadPending();
  }

  async function handleSignOut() {
    await supabase.auth.signOut();
    void navigate({ to: "/auth" });
  }

  if (!ready) {
    return <div className="px-4 py-24 text-center text-muted-foreground">Loading your portal…</div>;
  }

  return (
    <div>
      <PageHeader
        eyebrow="KhelSankalp Portal"
        title={profile ? `Namaste, ${profile.full_name}` : "Member portal"}
        description="Share match shorts, follow the SGSITS sports feed and manage access requests."
      />

      <div className="mx-auto max-w-5xl space-y-6 px-4 py-10">
        <Card className="glass-card flex flex-wrap items-center justify-between gap-3 p-5">
          <div>
            <p className="text-sm text-muted-foreground">
              {profile?.roll_number} · {profile?.branch ?? "SGSITS"}
            </p>
            <div className="mt-2 flex flex-wrap gap-2">
              {roles.length === 0 ? (
                <Badge variant="secondary">No role yet</Badge>
              ) : (
                roles.map((r) => (
                  <Badge key={r.id} variant={r.status === "approved" ? "default" : "secondary"}>
                    {ROLE_LABELS[r.role] ?? r.role}
                    {r.status !== "approved" ? ` · ${r.status}` : ""}
                  </Badge>
                ))
              )}
            </div>
          </div>
          <Button variant="outline" onClick={handleSignOut}>
            Sign out
          </Button>
        </Card>

        <Tabs defaultValue="feed">
          <TabsList>
            <TabsTrigger value="feed">Shorts feed</TabsTrigger>
            {canModerate ? <TabsTrigger value="approvals">Approvals</TabsTrigger> : null}
          </TabsList>

          <TabsContent value="feed" className="mt-6 space-y-6">
            <Card className="glass-card p-6">
              <form className="space-y-4" onSubmit={handlePost}>
                <div className="space-y-2">
                  <Label htmlFor="caption">What happened on the field?</Label>
                  <Textarea
                    id="caption"
                    value={caption}
                    onChange={(e) => setCaption(e.target.value)}
                    maxLength={500}
                    placeholder="Eklavya inter-branch cricket final — last over thriller!"
                  />
                </div>
                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="sport">Sport (optional)</Label>
                    <Input
                      id="sport"
                      value={sport}
                      onChange={(e) => setSport(e.target.value)}
                      maxLength={40}
                      placeholder="Cricket"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="media">Photo or clip</Label>
                    <Input
                      id="media"
                      type="file"
                      accept="image/*,video/*"
                      onChange={(e) => setFile(e.target.files?.[0] ?? null)}
                    />
                  </div>
                </div>
                <Button type="submit" disabled={busy}>
                  {busy ? "Posting…" : "Post short"}
                </Button>
              </form>
            </Card>

            {posts.length === 0 ? (
              <p className="text-center text-muted-foreground">
                No shorts yet. Be the first to post a match moment.
              </p>
            ) : (
              <div className="grid gap-5 sm:grid-cols-2">
                {posts.map((post) => (
                  <Card key={post.id} className="glass-card overflow-hidden">
                    {post.url ? (
                      post.media_path?.match(/\.(mp4|webm|mov)$/i) ? (
                        <video src={post.url} controls className="h-56 w-full object-cover" />
                      ) : (
                        <img
                          src={post.url}
                          alt={post.caption || "KhelSankalp sports moment"}
                          className="h-56 w-full object-cover"
                          loading="lazy"
                        />
                      )
                    ) : null}
                    <div className="space-y-2 p-5">
                      <div className="flex items-center justify-between gap-2">
                        <span className="text-sm font-semibold">{post.authorName}</span>
                        {post.sport ? <Badge variant="secondary">{post.sport}</Badge> : null}
                      </div>
                      <p className="text-sm text-muted-foreground">{post.caption}</p>
                      <p className="text-xs text-muted-foreground">
                        {new Date(post.created_at).toLocaleString()}
                      </p>
                    </div>
                  </Card>
                ))}
              </div>
            )}
          </TabsContent>

          {canModerate ? (
            <TabsContent value="approvals" className="mt-6 space-y-4">
              {pending.length === 0 ? (
                <p className="text-muted-foreground">No pending access requests.</p>
              ) : (
                pending.map((row) => (
                  <Card
                    key={row.id}
                    className="glass-card flex flex-wrap items-center justify-between gap-3 p-5"
                  >
                    <div>
                      <p className="font-semibold">{row.name ?? "Member"}</p>
                      <p className="text-sm text-muted-foreground">
                        {row.roll} · requested {ROLE_LABELS[row.role] ?? row.role}
                      </p>
                    </div>
                    <div className="flex gap-2">
                      <Button size="sm" onClick={() => decide(row, "approved")}>
                        Approve
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => decide(row, "rejected")}
                      >
                        Reject
                      </Button>
                    </div>
                  </Card>
                ))
              )}
            </TabsContent>
          ) : null}
        </Tabs>

        {approved.length === 0 ? (
          <p className="text-sm text-muted-foreground">
            Your access request is awaiting approval. You can still browse the feed.
          </p>
        ) : null}
      </div>
    </div>
  );
}
