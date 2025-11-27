
import { addBlock, deleteBlock, getBlockById, getBlocks, settingPageBlockHomes, updateBlock } from "@/server/modules/blocks.endpoints";
import { IBlock } from "@/types";
import { useInfiniteQuery, useMutation, useQuery } from "@tanstack/react-query"

export const useBlocks = (params: any) => {
    return useQuery({
        queryKey: ["blocks", params],
        queryFn: async () => {
            const { data } = await getBlocks(params);
            return data;
        }
    })
}
export const useGetBlocksInfinite = (params?: any) => {
    return useInfiniteQuery({
        queryKey: ["block-infinite", params],
        queryFn: async ({ pageParam = 1 }) => {
            const { data } = await getBlocks({ page: pageParam, ...params });
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
export const useCrateBlock = () => {
    return useMutation({
        mutationKey: ["create-block"],
        mutationFn: async (payload: any) => {
            const { data } = await addBlock(payload);
            return data;
        }
    })
}
export const useUpdateBlock = () => {
    return useMutation({
        mutationKey: ["update-block"],
        mutationFn: async (payload: any) => {
            const { data } = await updateBlock(payload);
            return data;
        }
    })
}
export const useDeleteBlock = () => {
    return useMutation({
        mutationKey: ["delete-block"],
        mutationFn: async (id: number) => {
            const { data } = await deleteBlock(id);
            return data;
        }
    })
}
export const useGetByIdBlock = (id: number) => {
    return useQuery({
        queryKey: ["block"],
        queryFn: async () => {
            const { data } = await getBlockById(id);
            return data;
        }
    })
}
export const useSettingPageBlockHomes = (id: number) => {
    return useQuery({
        queryKey: ["setting-page-block-homes"],
        queryFn: async () => {
            const { data } = await settingPageBlockHomes(id);
            return data;
        }
    })
}
