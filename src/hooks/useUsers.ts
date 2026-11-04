import { keepPreviousData, useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { userService, type UserPayload } from "@/services/userService";
import { authService } from "@/services/authService";
import type { UserQueryParams } from "@/types";

export const useUsers = (p: UserQueryParams) =>
  useQuery({ queryKey: ["users", p], queryFn: () => userService.getUsers(p), placeholderData: keepPreviousData });

function useAction<T>(fn: (v: T) => Promise<unknown>, msg: string) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: fn,
    onSuccess: () => { toast.success(msg); qc.invalidateQueries({ queryKey: ["users"] }); },
    onError: (e) => toast.error(e instanceof Error ? e.message : "Terjadi kesalahan"),
  });
}

export const useSaveUser = () =>
  useAction(({ id, data }: { id?: number; data: UserPayload }) => (id ? userService.updateUser(id, data) : userService.createUser(data)), "Data pengguna disimpan");
export const useDeleteUser = () => useAction((id: number) => userService.deleteUser(id), "Pengguna dihapus");
export const useToggleUserActive = () => useAction((id: number) => userService.toggleUserActive(id), "Status pengguna diperbarui");
export const useResetUserPassword = () =>
  useAction(({ id, password }: { id: number; password: string }) => userService.resetUserPassword(id, { password, password_confirmation: password }), "Password berhasil direset");
export const useUpdateProfile = () => useAction(authService.updateProfile, "Profil berhasil diperbarui");
export const useChangePassword = () => useAction(authService.changePassword, "Password berhasil diubah");
