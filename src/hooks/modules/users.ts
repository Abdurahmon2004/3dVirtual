import { blockUser, createUser, getUsers, updateUser } from "@/server/modules/users.endpoints";
import { useMutation, useQuery } from "@tanstack/react-query";

export const useCreateUser = () => {
    return useMutation({
        mutationKey: ['create-user'],
        mutationFn: async (payload: any) => {
            const { data } = await createUser(payload);
            return data;
        },
    })
}
export const useGetUsers = (params:any) => {
    return useQuery({
        queryKey: ['users'],
        queryFn: async () => {
            const { data } = await getUsers(params);
            return data;
        },
    })
}

export const useUpdateUser = () => {
    return useMutation({
        mutationKey: ['update-user'],
        mutationFn: async (payload: any) => {
            const { data } = await updateUser(payload);
            return data;
        },
    })
}
export const useBlockUser = () => {
    return useMutation({
        mutationKey: ['delete-user'],
        mutationFn: async (id: number) => {
            const { data } = await blockUser(id);
            return data;
        },
    })
}