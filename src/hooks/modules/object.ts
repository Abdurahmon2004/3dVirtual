import { addObject, deleteObject, getByIdBlockHome, getObjectById, getObjects, updateObject } from "@/server/modules/object.endpoints"
import { IObject } from "@/types";
import { useInfiniteQuery, useMutation, useQuery } from "@tanstack/react-query"

export const useObjects = (params: any) => {
    return useQuery({
        queryKey: ["objects", params],
        queryFn: async () => {
            const { data } = await getObjects(params);
            return data;
        }
    })
}
export const useGetObjectsInfinite = (params?: any) => {
    return useInfiniteQuery({
        queryKey: ["objects-infinite", params],
        queryFn: async ({ pageParam = 1 }) => {
            const { data } = await getObjects({ page: pageParam, ...params });
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
export const useCrateObject = () => {
    return useMutation({
        mutationKey: ["create-object"],
        mutationFn: async (payload: any) => {
            const { data } = await addObject(payload);
            return data;
        }
    })
}
export const useUpdateObject = () => {
    return useMutation({
        mutationKey: ["update-object"],
        mutationFn: async (payload: IObject) => {
            const { data } = await updateObject(payload);
            return data;
        }
    })
}
export const useDeleteObject = () => {
    return useMutation({
        mutationKey: ["delete-object"],
        mutationFn: async (id: number) => {
            const { data } = await deleteObject(id);
            return data;
        }
    })
}
export const useGetByIdObject = (id: number) => {
    return useQuery({
        queryKey: ["object"],
        queryFn: async () => {
            const { data } = await getObjectById(id);
            return data;
        }
    })
}
export const useGetByIdBlockHome = (id: number | null) => {
    return useQuery({
        queryKey: ["get-by-id-block-home", id],
        queryFn: async () => {
            const { data } = await getByIdBlockHome({ object_id: id });
            return data;
        },
        enabled: !!id,
        refetchOnMount: false,
        refetchOnReconnect: false,
        refetchOnWindowFocus: false,
    });
};
