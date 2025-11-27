import server from "../server"

export const getRegions = ()=>{
    return server(`v1/region/list`)
}
export const getDistrict = (id:number)=>{
    return server(`v1/district/list/${id}`)
}