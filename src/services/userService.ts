import { mockReports } from "@/mocks/reports";
import { mockUsers } from "@/mocks/users";
import type { Paginated, Role, User, UserQueryParams } from "@/types";
import { delay, paginate } from "./http";

export interface UserPayload {
  name: string;
  email: string;
  phone?: string | null;
  role: Role;
  password?: string;
}

const withCounts = () =>
  mockUsers.map((u) => ({ ...u, reports_count: mockReports.filter((r) => r.user.id === u.id).length }));

export const userService = {
  async getUsers(p: UserQueryParams = {}): Promise<Paginated<User>> {
    await delay();
    let list = withCounts();
    if (p.search) {
      const q = p.search.toLowerCase();
      list = list.filter((u) => u.name.toLowerCase().includes(q) || u.email.toLowerCase().includes(q));
    }
    if (p.role) list = list.filter((u) => u.role === p.role);
    if (p.active) list = list.filter((u) => u.is_active === (p.active === "active"));
    return paginate(list, p.page, p.per_page ?? 10);
  },
  async createUser(_payload: UserPayload): Promise<void> { await delay(); },
  async updateUser(_id: number, _payload: UserPayload): Promise<void> { await delay(); },
  async deleteUser(_id: number): Promise<void> { await delay(); },
  async toggleUserActive(_id: number): Promise<void> { await delay(200, 400); },
  async resetUserPassword(_id: number, _payload: { password: string; password_confirmation: string }): Promise<void> {
    await delay();
  },
};
