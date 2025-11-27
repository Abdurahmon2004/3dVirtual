import { addHome, addHomeList, deleteHome, getHomeById, getHomes, updateHome, updateHomeList } from "@/server/modules/home.endpoints";
import { useMutation, useQuery } from "@tanstack/react-query"

export const useHomes = (params: any) => {
    return useQuery({
        queryKey: ["homes", params],
        queryFn: async () => {
            const { data } = await getHomes(params);
            return data;
        }
    })
}
export const useCrateHome = () => {
    return useMutation({
        mutationKey: ["create-home"],
        mutationFn: async (payload: any) => {
            const { data } = await addHome(payload);
            return data;
        }
    })
}
export const useUpdateHome = () => {
    return useMutation({
        mutationKey: ["update-home"],
        mutationFn: async (payload: any) => {
            const { data } = await updateHome(payload);
            return data;
        }
    })
}
export const useDeleteHome = () => {
    return useMutation({
        mutationKey: ["delete-home"],
        mutationFn: async (id: number) => {
            const { data } = await deleteHome(id);
            return data;
        }
    })
}
export const useGetByIdHome = (id: number | null) => {
    return useQuery({
        queryKey: ["home", id],
        queryFn: async () => {
            const { data } = await getHomeById(id);
            return data;
        },
        enabled: !!id
    })
}
export const useCreateHomeList = () => {
    return useMutation({
        mutationKey: ["create-home-list"],
        mutationFn: async (payload: any) => {
            const { data } = await addHomeList(payload)
        }
    })
}
export const useUpdateHomeList = () => {
    return useMutation({
        mutationKey: ["update-home-list"],
        mutationFn: async (payload: any) => {
            const { data } = await updateHomeList(payload)
        }
    })
}