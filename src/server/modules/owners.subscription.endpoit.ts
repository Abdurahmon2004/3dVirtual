import server from "../server";

export const createSubscription = (data: any) => {
    return server(`owner/owner-subscription/add`, "post", data);

}
export const getSubscriptionList = (p: any) => {
    const query = [
        p.owner_id ? `owner_id=${p.owner_id}` : 0,
    ]
    return server(`owner/owner-subscription/list?${query}`);
}
export const getSubscription = (p: any) => {
    const query = [
        p.owner_id ? `owner_id=${p.owner_id}` : 0,
    ]
    return server(`owner/owner-subscription/current?${query}`);
}

export const updateSubscription = (data: any) => {
    return server(`owner/owner-subscription/update`, "put", data);
}
