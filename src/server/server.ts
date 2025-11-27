import axios, { AxiosResponse } from 'axios';
import type { InternalAxiosRequestConfig } from 'axios';
import handleError from './handle';
import utils from '@/helpers/utils';
const baseurl = "https://3dtur.backend-salehouse.uz/api";
const apiClient = axios.create({
    baseURL: baseurl,
});

apiClient.interceptors.request.use((config: InternalAxiosRequestConfig) => {
    const token = localStorage.getItem('user') ? JSON.parse(localStorage.getItem('user') || '').token : null;
    if (token && config.headers) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});



export default async function server<T = any>(
    endpoint = '',
    method: 'get' | 'post' | 'put' | 'patch' | 'delete' = 'get',
    data: any = null
): Promise<AxiosResponse<T>> {
    let result: AxiosResponse<T> | null = null;
    let error: any = null;
    await apiClient
        .request<T>({
            url: endpoint,
            method,
            data,
        })
        .then((res) => {
            result = res;
            if (method !== 'get') {
                //@ts-ignore
                utils.alert('success', res.data?.message || 'Amaliyot bajarildi !')
            }
        })
        .catch((err) => {
            error = err;
            handleError(err);
        })
        .finally(() => {
        });

    return new Promise((resolve, reject) => {
        if (result) resolve(result);
        else reject(error);
    });
}