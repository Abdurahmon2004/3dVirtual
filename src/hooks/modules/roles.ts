import { createRole, createRolePermission, deleteRole, getRolePermissions, getRoles, updateRole } from "@/server/modules/roles.endpoints"
import { IRole } from "@/types/modules/roles.types"
import { useMutation, useQuery } from "@tanstack/react-query"

export const useRoles = (params: any) => {
    return useQuery({
        queryKey: ["roles", params],
        queryFn: async () => {
            const { data } = await getRoles(params)
            return data;
        }
    })
}

export const useCreateRole = () => {
    return useMutation({
        mutationKey: ["create-role"],
        mutationFn: async (payload: IRole) => {
            const { data } = await createRole(payload)
            return data;
        }
    })
}
export const useUpdateRole = () => {
    return useMutation({
        mutationKey: ["update-role"],
        mutationFn: async (payload: IRole) => {
            const { data } = await updateRole(payload)
            return data;
        }
    })
}
export const useDeleteRole = () => {
    return useMutation({
        mutationKey: ["delete-role"],
        mutationFn: async (payload: number) => {
            const { data } = await deleteRole(payload)
        }
    })
}
export const useRolePermissions = (role_id: number) => {
    return useQuery({
        queryKey: ["role-permissions", role_id],
        queryFn: async () => {
            const { data } = await getRolePermissions(role_id);
            return data;
        }
    })
}
export const useCreateRolePermission = () => {
    return useMutation({
        mutationKey: ["create-role-permission"],
        mutationFn: async (payload) => {
            const { data } = await createRolePermission(payload)
        }
    })
}