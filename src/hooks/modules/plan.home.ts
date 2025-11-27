import { addPlanHome, deletePlanHome, getPlanHomeById, getPlanHomes, updatePlanHome } from "@/server/modules/plan.home.endpoints";
import { useMutation, useQuery } from "@tanstack/react-query"

export const usePlanHomes = (params: any) => {
    return useQuery({
        queryKey: ["plan-homes", params],
        queryFn: async () => {
            const { data } = await getPlanHomes(params);
            return data;
        }
    })
}
export const useCratePlanHome = () => {
    return useMutation({
        mutationKey: ["create-plan-home"],
        mutationFn: async (payload: any) => {
            const { data } = await addPlanHome(payload);
            return data;
        }
    })
}
export const useUpdatePlanHome = () => {
    return useMutation({
        mutationKey: ["update-plan-home"],
        mutationFn: async (payload: any) => {
            const { data } = await updatePlanHome(payload);
            return data;
        }
    })
}
export const useDeletePlanHome = () => {
    return useMutation({
        mutationKey: ["delete-plan-home"],
        mutationFn: async (id: number) => {
            const { data } = await deletePlanHome(id);
            return data;
        }
    })
}
export const useGetByIdPlanHome = (id: number) => {
    return useQuery({
        queryKey: ["plan", id],
        queryFn: async () => {
            const { data } = await getPlanHomeById(id);
            return data;
        },
        enabled: !!id
    })
}