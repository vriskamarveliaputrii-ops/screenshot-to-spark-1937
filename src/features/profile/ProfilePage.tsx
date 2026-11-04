import { Camera, Loader2 } from "lucide-react";
import { useRef, useState } from "react";
import { toast } from "sonner";
import { RoleBadge } from "@/components/Badges";
import { PageHeader } from "@/components/Common";
import { PasswordInput } from "@/components/PasswordInput";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useMockAuth } from "@/hooks/useMockAuth";
import { useChangePassword, useUpdateProfile } from "@/hooks/useUsers";
import { initials } from "@/lib/formatters";
import { cn } from "@/lib/utils";

function strength(pw: string) {
  let s = 0;
  if (pw.length >= 8) s++;
  if (/[A-Z]/.test(pw) && /[a-z]/.test(pw)) s++;
  if (/\d/.test(pw)) s++;
  if (/[^A-Za-z0-9]/.test(pw)) s++;
  return s;
}
const LEVELS = [
  { label: "Sangat lemah", cls: "bg-danger" },
  { label: "Lemah", cls: "bg-danger" },
  { label: "Cukup", cls: "bg-pending" },
  { label: "Kuat", cls: "bg-progress" },
  { label: "Sangat kuat", cls: "bg-success" },
];

export function ProfilePage() {
  const { user, setUser } = useMockAuth();
  const [name, setName] = useState(user!.name);
  const [email, setEmail] = useState(user!.email);
  const [phone, setPhone] = useState(user!.phone ?? "");
  const [avatar, setAvatar] = useState<string | null>(user!.avatar_url);
  const fileRef = useRef<HTMLInputElement>(null);
  const update = useUpdateProfile();
  const change = useChangePassword();
  const [cur, setCur] = useState("");
  const [pw, setPw] = useState("");
  const [conf, setConf] = useState("");
  const st = strength(pw);

  return (
    <div className="mx-auto max-w-2xl">
      <PageHeader title="Profil" description="Kelola informasi akun dan keamananmu." />
      <Tabs defaultValue="profile">
        <TabsList className="mb-4"><TabsTrigger value="profile">Profil</TabsTrigger><TabsTrigger value="password">Ganti Password</TabsTrigger></TabsList>
        <TabsContent value="profile">
          <Card className="rounded-xl shadow-soft">
            <CardContent className="space-y-5 pt-6">
              <div className="flex items-center gap-4">
                <div className="relative">
                  <Avatar className="size-20">{avatar && <AvatarImage src={avatar} className="object-cover" />}<AvatarFallback className="bg-primary text-xl font-bold text-primary-foreground">{initials(name)}</AvatarFallback></Avatar>
                  <button onClick={() => fileRef.current?.click()} aria-label="Ganti foto profil" className="absolute -bottom-1 -right-1 grid size-8 place-items-center rounded-full border-2 border-card bg-secondary text-secondary-foreground hover:bg-accent"><Camera className="size-4" /></button>
                  <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={(e) => { const f = e.target.files?.[0]; if (f) setAvatar(URL.createObjectURL(f)); }} />
                </div>
                <div><p className="text-lg font-semibold">{name}</p><RoleBadge role={user!.role} /></div>
              </div>
              <div className="space-y-1.5"><Label htmlFor="p-name">Nama</Label><Input id="p-name" value={name} onChange={(e) => setName(e.target.value)} /></div>
              <div className="space-y-1.5"><Label htmlFor="p-email">Email</Label><Input id="p-email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} /></div>
              <div className="space-y-1.5"><Label htmlFor="p-phone">Nomor HP</Label><Input id="p-phone" value={phone} onChange={(e) => setPhone(e.target.value)} /></div>
              <div className="flex justify-end">
                <Button disabled={update.isPending} onClick={() => {
                  if (name.trim().length < 3) return toast.error("Nama minimal 3 karakter");
                  update.mutate({ name, email, phone: phone || null }, { onSuccess: () => setUser({ ...user!, name, email, phone: phone || null }) });
                }}>{update.isPending && <Loader2 className="animate-spin" />} Simpan</Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="password">
          <Card className="rounded-xl shadow-soft">
            <CardContent className="space-y-5 pt-6">
              <div className="space-y-1.5"><Label htmlFor="cp">Password saat ini</Label><PasswordInput id="cp" value={cur} onChange={(e) => setCur(e.target.value)} /></div>
              <div className="space-y-1.5">
                <Label htmlFor="np">Password baru</Label>
                <PasswordInput id="np" value={pw} onChange={(e) => setPw(e.target.value)} />
                {pw && (
                  <div className="space-y-1">
                    <div className="flex gap-1">{[0, 1, 2, 3].map((i) => <div key={i} className={cn("h-1.5 flex-1 rounded-full bg-muted transition-colors", i < st && LEVELS[st].cls)} />)}</div>
                    <p className="text-xs text-muted-foreground">Kekuatan: <span className="font-semibold text-foreground">{LEVELS[st].label}</span></p>
                  </div>
                )}
              </div>
              <div className="space-y-1.5"><Label htmlFor="cf">Konfirmasi password baru</Label><PasswordInput id="cf" value={conf} onChange={(e) => setConf(e.target.value)} /></div>
              <div className="flex justify-end">
                <Button disabled={change.isPending} onClick={() => {
                  if (!cur) return toast.error("Password saat ini wajib diisi");
                  if (pw.length < 8) return toast.error("Password baru minimal 8 karakter");
                  if (pw !== conf) return toast.error("Konfirmasi password tidak cocok");
                  change.mutate({ current_password: cur, password: pw, password_confirmation: conf }, { onSuccess: () => { setCur(""); setPw(""); setConf(""); } });
                }}>{change.isPending && <Loader2 className="animate-spin" />} Ubah Password</Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
