import server from "@/server/server"
import { IBlock } from "@/types"

export const addBlock = (data: IBlock) => {
    return server(`v1/setting-page/block/add`, 'post', data)
}
export const getBlocks = (p: any) => {
    const query = [
        p.company_id ? `company_id=${p.company_id}` : null,
        p.search ? `search=${p.search}` : null,
        p.object_id ? `object_id=${p.object_id}` : null,
        p.is_active ? `is_active=${p.is_active}` : null,
        p.sort ? `sort=${p.sort}` : null,
        p.order ? `order=${p.order}` : null,
        p.page ? `page=${p.page}` : null,
        p.per_page ? `per_page=${p.per_page}` : null,
    ].filter(Boolean).join('&')
    return server(`v1/setting-page/block/list?${query}`)
}
export const getBlockById = (id: number) => {
    return server(`v1/setting-page/block/get?id=${id}`)
}
export const updateBlock = (data: IBlock) => {
    return server(`v1/setting-page/block/update`, 'put', data)
}
export const deleteBlock = (id: number) => {
    return server(`v1/setting-page/block/delete?block_id=${id}`, 'delete')
}
export const settingPageBlockHomes = (id:number) => {
    return server(`v1/setting-page/block/get/by/homes?block_id=${id}`)
}