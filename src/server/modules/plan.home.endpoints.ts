import utils from "@/helpers/utils"
import server from "@/server/server"

export const addPlanHome = (data: any) => {
    return server(`v1/setting-page/plan-item/add`, 'post', data)
}
export const getPlanHomes = (p: any) => {
    const query = [
        p.company_id ? `company_id=${p.company_id}` : null,
        p.plan_id ? `plan_id=${p.plan_id}` : null,
        p.search ? `search=${p.search}` : null,
        p.sort ? `sort=${p.sort}` : null,
        p.order ? `order=${p.order}` : null,
        p.page ? `page=${p.page}` : null,
        p.per_page ? `per_page=${p.per_page}` : null,
    ].filter(Boolean).join('&')
    return server(`v1/setting-page/plan-item/list?${query}`)
}
export const getPlanHomeById = (id: number) => {
    return server(`v1/setting-page/plan-item/get?plan_item_id=${id}`)
}
export const updatePlanHome = (data: any) => {
    return server(`v1/setting-page/plan-item/update`, 'post', data)
}
export const deletePlanHome = (id: number) => {
    return server(`v1/setting-page/plan-item/delete?plan_item_id=${id}`, 'delete')
}