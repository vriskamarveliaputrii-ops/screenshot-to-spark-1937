import { mockUsers } from "@/mocks/users";
import type { User } from "@/types";
import { delay } from "./http";

export const authService = {
  async login({ email }: { email: string; password: string; client: "web" }): Promise<{ user: User; token: string }> {
    await delay();
    const isAdmin = email.toLowerCase().includes("admin");
    const base = mockUsers.find((u) => u.role === (isAdmin ? "admin" : "user"))!;
    return { user: { ...base }, token: "mock-token" };
  },
  async register(payload: { name: string; email: string; phone: string; password: string; password_confirmation: string }): Promise<{ user: User; token: string }> {
    await delay();
    const base = mockUsers.find((u) => u.role === "user")!;
    return { user: { ...base, name: payload.name, email: payload.email, phone: payload.phone }, token: "mock-token" };
  },
  async getMe(): Promise<User> {
    await delay();
    return mockUsers[1];
  },
  async logout(): Promise<void> { await delay(150, 300); },
  async updateProfile(_payload: { name: string; email: string; phone: string | null }): Promise<void> { await delay(); },
  async changePassword(_payload: { current_password: string; password: string; password_confirmation: string }): Promise<void> {
    await delay();
  },
};
