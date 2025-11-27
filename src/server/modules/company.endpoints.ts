import server from "@/server/server";
import { ICompany } from "@/types";
export const addCompny = (data: ICompany) => {
    return server(`v1/setting-page/company/add`, "post", data);
}
export const getCompanies = (p: any) => {
    const query = [
        `page=${p.page || 1}`,
        `per_page=${p.per_page || 15}`,
        p.search ? `search=${p.search}` : null,
        p.is_active ? `is_active=${p.is_active}` : null,
        p.sort ? `sort=${p.sort}` : null,
        p.order ? `order=${p.order}` : null,
    ].filter(Boolean).join("&");
    return server(`v1/setting-page/company/list?${query}`);
}
export const getCompanyById = (id: number) => {
    return server(`v1/setting-page/company/get?company_id=${id}`);
}
export const updateCompany = (data: ICompany & { company_id: number }) => {
    return server(`v1/setting-page/company/update`, "put", data);
}
export const deleteCompany = (id: number) => {
    return server(`v1/setting-page/company/delete?company_id=${id}`, "delete");
}