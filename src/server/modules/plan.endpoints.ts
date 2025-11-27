import server from "@/server/server"
import utils from "@/helpers/utils"

export const addPlan = (data: any) => {
    return server(`v1/setting-page/plan/add`, 'post', utils.formData(data))
}
export const getPlans = (p: any) => {
    const query = [
        p.company_id ? `company_id=${p.company_id}` : null,
        p.search ? `search=${p.search}` : null,
        p.sort ? `sort=${p.sort}` : null,
        p.order ? `order=${p.order}` : null,
        p.page ? `page=${p.page}` : null,
        p.per_page ? `per_page=${p.per_page}` : null,
    ].filter(Boolean).join('&')
    return server(`v1/setting-page/plan/list?${query}`)
}
export const getPlanById = (id: number) => {
    return server(`v1/setting-page/plan/get?plan_id=${id}`)
}
export const updatePlan = (data: any) => {
    return server(`v1/setting-page/plan/update`, 'post', utils.formData(data))
}
export const deletePlan = (id: number) => {
    return server(`v1/setting-page/plan/delete?plan_id=${id}`, 'delete')
}
export const getPlanByUuid = (id: number) => {
    return server(`/client/view/plan/${id}`)
}