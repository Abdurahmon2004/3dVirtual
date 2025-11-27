import server from "@/server/server"
import { IObject } from "@/types"
import utils from "@/helpers/utils"
export const addObject = async (data: any) => {
   return server(`v1/setting-page/object/add`, 'post', utils.formData(data))
}
export const getObjects = (p: any) => {
   const query = [
      p.search ? `search=${p.search}` : null,
      p.company_id ? `company_id=${p.company_id}` : null,
      p.province ? `province=${p.province}` : null,
      p.is_active ? `is_active=${p.is_active}` : null,
      p.sort ? `sort=${p.sort}` : null,
      p.order ? `order=${p.order}` : null,
      p.per_page ? `per_page=${p.per_page}` : null,
      p.page ? `page=${p.page}` : null,
   ].filter(Boolean).join('&')
   return server(`v1/setting-page/object/list?${query}`)
}
export const getObjectById = (id: number) => {
   return server(`v1/setting-page/object/get?object_id=${id}`)
}
export const updateObject = (data: IObject) => {
   return server(`v1/setting-page/object/update`, 'post', utils.formData(data))
}
export const deleteObject = (id: number) => {
   return server(`v1/setting-page/object/delete?object_id=${id}`, 'delete')
}
export const getByIdBlockHome = (p: any) => {
   const query = [
      p.search ? `search=${p.search}` : null,
      p.company_id ? `company_id=${p.company_id}` : null,
      p.province ? `province=${p.province}` : null,
      p.is_active ? `is_active=${p.is_active}` : null,
      p.object_id ? `object_id=${p.object_id}` : null,
      p.block_id ? `block_id=${p.block_id}` : null
   ].filter(Boolean).join("&");
   return server(`v1/showroom/get/object/by/blocks/by/homes?${query}`)
}