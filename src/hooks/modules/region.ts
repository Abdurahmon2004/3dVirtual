import { getDistrict, getRegions } from "@/server/modules/region.endpoints"
import { useQuery } from "@tanstack/react-query"

export const useRegions = () => {
    return useQuery({
        queryKey: ["regions"],
        queryFn: async () => {
            const { data } = await getRegions();
            return data;
        }
    })
}
export const useDistricts = (id: number) => {
    return useQuery({
        queryKey: ["districts"],
        queryFn: async () => {
            const { data } = await getDistrict(id);
            return data;
        },
        enabled: !!id
    })
}