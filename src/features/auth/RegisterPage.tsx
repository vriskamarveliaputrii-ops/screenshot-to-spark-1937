import type { ReactNode } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { Link, useNavigate } from "@tanstack/react-router";
import { Loader2 } from "lucide-react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";
import { FieldError, PasswordInput } from "@/components/PasswordInput";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useMockAuth } from "@/hooks/useMockAuth";
import { AuthLayout } from "@/layouts/AuthLayout";
import { authService } from "@/services/authService";

const schema = z
  .object({
    name: z.string().min(3, "Nama minimal 3 karakter"),
    email: z.string().min(1, "Email wajib diisi").email("Format email tidak valid"),
    phone: z.string().regex(/^(\+62|0)8\d{7,12}$/, "Nomor HP tidak valid (contoh: 081234567890)"),
    password: z.string().min(8, "Password minimal 8 karakter"),
    password_confirmation: z.string().min(1, "Konfirmasi password wajib diisi"),
  })
  .refine((v) => v.password === v.password_confirmation, { message: "Konfirmasi password tidak cocok", path: ["password_confirmation"] });
type Values = z.infer<typeof schema>;

export function RegisterPage() {
  const { setUser } = useMockAuth();
  const navigate = useNavigate();
  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<Values>({ resolver: zodResolver(schema) });

  const onSubmit = async (v: Values) => {
    const { user } = await authService.register(v);
    setUser(user);
    toast.success("Pendaftaran berhasil! Selamat bergabung.");
    navigate({ to: "/dashboard" });
  };

  const field = (name: keyof Values, label: string, el: ReactNode) => (
    <div className="space-y-1.5">
      <Label htmlFor={name}>{label}</Label>
      {el}
      <FieldError msg={errors[name]?.message} />
    </div>
  );

  return (
    <AuthLayout>
      <div className="rounded-2xl border bg-card p-6 shadow-soft sm:p-8">
        <h1 className="text-2xl font-bold tracking-tight">Buat akun baru</h1>
        <p className="mt-1 text-sm text-muted-foreground">Gratis, dan hanya butuh satu menit.</p>
        <form onSubmit={handleSubmit(onSubmit)} className="mt-6 space-y-4" noValidate>
          {field("name", "Nama lengkap", <Input id="name" placeholder="Budi Santoso" {...register("name")} />)}
          {field("email", "Email", <Input id="email" type="email" placeholder="nama@email.com" {...register("email")} />)}
          {field("phone", "Nomor HP", <Input id="phone" inputMode="tel" placeholder="081234567890" {...register("phone")} />)}
          <div className="grid gap-4 sm:grid-cols-2">
            {field("password", "Password", <PasswordInput id="password" {...register("password")} />)}
            {field("password_confirmation", "Konfirmasi password", <PasswordInput id="password_confirmation" {...register("password_confirmation")} />)}
          </div>
          <Button type="submit" className="h-10 w-full" disabled={isSubmitting}>
            {isSubmitting && <Loader2 className="animate-spin" />} Daftar
          </Button>
        </form>
      </div>
      <p className="mt-6 text-center text-sm text-muted-foreground">
        Sudah punya akun? <Link to="/login" className="font-semibold text-primary hover:underline">Masuk</Link>
      </p>
    </AuthLayout>
  );
}
