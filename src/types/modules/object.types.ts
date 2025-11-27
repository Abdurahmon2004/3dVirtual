export interface IObject {
    company_id: number,
    name: string,
    region_id: string,
    district_id: string,
    address: string,
    start_date: string,
    end_date: string,
    description: string,
    is_active: boolean,
    cover_path: File | null,
    object_id?: number,
}