import { IRole } from "@/types/modules/roles.types"
import server from "../server"

export const createRole = (data: IRole) => {
    return server(`v1/setting-page/role-permission/role/add`, "post", data)
}
export const updateRole = (data: IRole) => {
    return server(`v1/setting-page/role-permission/role/update`, 'put', data)
}
export const deleteRole = (id: number) => {
    return server(`v1/setting-page/role-permission/role/delete?role_id=${id}`, 'delete')
}
export const getRoles = (p: any) => {
    const query = [
        `page=${p.page || 1}`,
        `per_page=${p.per_page || 15}`,
        p.sort ? `sort=${p.sort}` : '',
        p.order ? `order=${p.order}` : '',
        p.search ? `name=${p.name}` : ''
    ].filter(Boolean).join('&')
    return server(`v1/setting-page/role-permission/role/list?${query}`)
}
export const getRolePermissions = (role_id: number) => {
    return server(`v1/setting-page/role-permission/permission/role/by/list?role_id=${role_id}`)
}
export const createRolePermission = (data: any) => {
    return server(`v1/setting-page/role-permission/permission/add/by/role`, "post", data)
}