import axios, { AxiosInstance } from "axios";

import { AppError } from "@utils/AppError";
import { storageAuthTokenGet } from '@storage/storageAuthToken';

type SignOut = () => void;

type PromiseType = { 
    resolve: (value?: unknown) => void;
    reject: (reason?: unknown) => void;
}

type APIInstanceProps =  AxiosInstance &{
    registerInterceptTokenManager: (signOut: SignOut) => () => void;
}

const api = axios.create({
    baseURL: 'http://10.0.2.2:3333'
}) as APIInstanceProps;

let isRefreshing = false;
let failedQueue: Array<PromiseType> = [];

api.registerInterceptTokenManager = signOut => {
    const interceptTokenManager = api.interceptors.response.use(response => response, async requestError => {

        if(requestError?.response?.status === 401){
            if(requestError.response.data?.message === 'token.expired' || requestError.response.data?.message === 'token.invalid'){
                const oldToken = await storageAuthTokenGet();

                if(!oldToken){
                    signOut();
                    return Promise.reject(requestError);
                }

                const originalRequest = requestError.config;
                
                if(isRefreshing){
                    return new Promise((resolve, reject) => {
                        failedQueue.push({ resolve, reject });
                    })
                    .then( token => {
                        originalRequest.headers.Authorization = `Bearer ${token}`;
                        return axios(originalRequest);
                    })
                    .catch((error) => {
                        throw error;
                    })
                }
                isRefreshing = true;
            }

            signOut();
        }


        if(requestError.response && requestError.response.data){
            return Promise.reject(new AppError(requestError.response.data.message));
        } else {
            return Promise.reject(requestError);
        }
    });

    return () => {
        api.interceptors.response.eject(interceptTokenManager);
    }
}



export { api }