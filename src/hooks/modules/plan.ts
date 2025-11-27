

import { addPlan, deletePlan, getPlanById, getPlans, updatePlan } from "@/server/modules/plan.endpoints";
import { useInfiniteQuery, useMutation, useQuery } from "@tanstack/react-query"

export const usePlans = (params: any) => {
    return useQuery({
        queryKey: ["plans", params],
        queryFn: async () => {
            const { data } = await getPlans(params);
            return data;
        }
    })
}
export const useGetPlansInfinite = (params?: any) => {
  return useInfiniteQuery({
    queryKey: ["plan-infinite", params],
    queryFn: async ({ pageParam = 1 }) => {
      const { data } = await getPlans({ page: pageParam, ...params });
      return data;
    },
    getNextPageParam: (lastPage: any) => {
      const { current_page, total_pages } = lastPage;
      if (current_page < total_pages) return current_page + 1;
      return undefined;
    },
    initialPageParam: 1,
  });
};
export const useCratePlan = () => {
    return useMutation({
        mutationKey: ["create-plan"],
        mutationFn: async (payload: any) => {
            const { data } = await addPlan(payload);
            return data;
        }
    })
}
export const useUpdatePlan = () => {
    return useMutation({
        mutationKey: ["update-plan"],
        mutationFn: async (payload: any) => {
            const { data } = await updatePlan(payload);
            return data;
        }
    })
}
export const useDeletePlan = () => {
    return useMutation({
        mutationKey: ["delete-plan"],
        mutationFn: async (id: number) => {
            const { data } = await deletePlan(id);
            return data;
        }
    })
}
export const useGetByIdPlan = (id: number) => {
    return useQuery({
        queryKey: ["plan"],
        queryFn: async () => {
            const { data } = await getPlanById(id);
            return data;
        }
    })
}
export const usePlanByUuid = (id: number) => {
    return useQuery({
        queryKey: ["plan-uuid"],
        queryFn: async () => {
            const { data } = await getPlanById(id);
            return data;
        }
    })
}
