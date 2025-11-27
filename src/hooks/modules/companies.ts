import { addCompny, deleteCompany, getCompanies, updateCompany } from "@/server/modules/company.endpoints";
import { useInfiniteQuery, useMutation, useQuery } from "@tanstack/react-query";

export const useGetCompanies = (params:any) => {
    return useQuery({
        queryKey: ['companies',params],
        queryFn: async () => {
            const { data } = await getCompanies(params);
            return data;
        },
    });
}

export const useGetCompaniesInfinite = (params?: any) => {
  return useInfiniteQuery({
    queryKey: ["companies", params],
    queryFn: async ({ pageParam = 1 }) => {
      const { data } = await getCompanies({ ...params, page: pageParam, per_page: 15 });
      return data;
    },
    initialPageParam: 1, 
    getNextPageParam: (lastPage) => {
      const { page, per_page, total } = lastPage;
      const totalPages = Math.ceil(total / per_page);
      return page < totalPages ? page + 1 : undefined;
    },
  });
};


export const useAddCompany = () => {
    return useMutation({
        mutationKey: ['add-company'],
        mutationFn: async (payload: any) => {
            const { data } = await addCompny(payload);
            return data;
        },
    })
}
export const useUpdateCompany = () => {
    return useMutation({
        mutationKey: ['update-company'],
        mutationFn: async (payload: any) => {
            const { data } = await updateCompany(payload);
            return data;
        },
    })
}
export const useDeleteCompany = () => {
    return useMutation({
        mutationKey: ['delete-company'],
        mutationFn: async (id: number) => {
            const { data } = await deleteCompany(id);
            return data;
        },
    })
}