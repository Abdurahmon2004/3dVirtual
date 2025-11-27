import { createSubscription, getSubscription, getSubscriptionList, updateSubscription } from "@/server/modules/owners.subscription.endpoit";
import { useMutation, useQuery } from "@tanstack/react-query";

export const useCreateSubscription = () => {
    return useMutation({
        mutationKey: ['create-subscription'],
        mutationFn: async (payload: any) => {
            const { data } = await createSubscription(payload);
            return data;
        },
    })
}
export const useSubscription = (params: any) => {
    return useQuery({
        queryKey: ['subscription'],
        queryFn: async () => {
            const { data } = await getSubscription(params);
            return data;
        },
        enabled: !!params,
    })
}

export const useSubscriptionAll = (params: any) => {
    return useQuery({
        queryKey: ['subscription-all'],
        queryFn: async () => {
            const { data } = await getSubscriptionList(params);
            return data;
        },
    })
}
export const useUpdateSubscription = () => {
    return useMutation({
        mutationKey: ['update-subscription'],
        mutationFn: async (payload: any) => {
            const { data } = await updateSubscription(payload);
            return data;
        },
    })
}