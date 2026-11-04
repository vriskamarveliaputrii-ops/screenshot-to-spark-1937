import type { User } from "@/types";

export const mockUsers: User[] = [
  { id: 1, name: "Admin SWM", email: "admin@swm.test", role: "admin", phone: "081200000001", avatar_url: null, is_active: true, created_at: "2026-01-05T08:00:00+07:00" },
  { id: 2, name: "Budi Santoso", email: "user@swm.test", role: "user", phone: "081234567890", avatar_url: null, is_active: true, created_at: "2026-02-12T09:30:00+07:00" },
  { id: 3, name: "Siti Rahmawati", email: "siti@swm.test", role: "user", phone: "085712345678", avatar_url: null, is_active: true, created_at: "2026-03-20T10:15:00+07:00" },
  { id: 4, name: "Andi Pratama", email: "andi@swm.test", role: "user", phone: "081398765432", avatar_url: null, is_active: true, created_at: "2026-05-02T13:45:00+07:00" },
  { id: 5, name: "Dewi Lestari", email: "dewi@swm.test", role: "user", phone: null, avatar_url: null, is_active: false, created_at: "2026-07-18T16:20:00+07:00" },
];
