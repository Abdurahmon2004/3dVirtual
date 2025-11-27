import server from "../server";

export const createUser = (data: any) => {
    return server(`owner/company-owner/add`, "post", data);

}

export const getUsers = (p: any) => {
    const query = [
        `page=${p.page || 1}`,
        `per_page=${p.per_page || 15}`,
        p.sort ? `sort=${p.sort}` : null,
        p.order ? `order=${p.order}` : null,
        p.search ? `name=${p.search}` : null,
    ].filter(Boolean).join('&');
    return server(`owner/company-owner/list?${query}`);
}

export const updateUser = (data: any) => {
    return server(`owner/company-owner/update`, "put", data);
}

export const blockUser = (id: number) => {
    return server(`owner/company-owner/block?owner_id=${id}`, "put");
}   