import server from "@/server/server"
export const addHome = (data: any) => {
    return server(`v1/setting-page/home/add`, 'post', data)
}
export const getHomes = (p: any) => {
    const query = [
        p.company_id ? `company_id=${p.company_id}` : null,
        p.object_id ? `object_id=${p.object_id}` : null,
        p.block_id ? `block_id=${p.block_id}` : null,
        p.is_active ? `is_active=${p.is_active}` : null,
        p.is_repaired ? `is_repaired=${p.is_repaired}` : null,
        p.is_residential ? `is_residential=${p.is_residential}` : null,
        p.search ? `search=${p.search}` : null,
        p.sort ? `sort=${p.sort}` : null,
        p.order ? `order=${p.order}` : null,
        p.page ? `page=${p.page}` : null,
        p.per_page ? `per_page=${p.per_page}` : null,
    ].filter(Boolean).join('&')
    return server(`v1/setting-page/home/list?${query}`)
}
export const getHomeById = (id: number | null) => {
    return server(`v1/setting-page/home/get?home_id=${id}`)
}
export const updateHome = (data: any) => {
    return server(`v1/setting-page/home/update`, 'put', data)
}
export const deleteHome = (id: number) => {
    return server(`v1/setting-page/home/delete?home_id=${id}`, 'delete')
}
export const addHomeList = (data: any) => {
    return server(`v1/setting-page/home/add-arr`, "post", data)
}
export const updateHomeList = (data: any) => {
    return server(`v1/setting-page/home/update-arr`, "post", data)
}