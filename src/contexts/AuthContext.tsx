import { ReactNode, createContext, useEffect, useState } from 'react'

import { storageUserSave, storageUserGet, storageUserDelete } from '@storage/storageUser';
import { storageAuthTokenSave, storageAuthTokenGet, storageAuthTokenDelete } from '@storage/storageAuthToken';

import { api } from '@services/api';
import { UserDTO } from '@dtos/UserDTOS';

export type AuthContextDataProps = {
    user: UserDTO;
    signIn: (email: string, password: string) => Promise<void>;
    updateUserProfile: (userUpdated: UserDTO) => void;
    signOut: () => Promise<void>;
    isLoadingUserStorageData: boolean;
}

export const AuthContext = createContext<AuthContextDataProps>({} as AuthContextDataProps);

type AuthContextPRoviderProps = {
    children: ReactNode;
}



export function AuthContextProvider({ children }: AuthContextPRoviderProps) {
    const [user, setUser] = useState<UserDTO>({} as UserDTO);
    const [isLoadingUserStorageData, setIsLoadingUserStorageData] = useState(true);

    async function userAndTokenUpdate(userData: UserDTO, token: string) {
        try {
            api.defaults.headers.common['Authorization'] = `Bearer ${token}`;

            setUser(userData);

        } catch (error) {
            throw error;
        }
    }

    async function updateUserProfile(userUpdated: UserDTO) {
        try {
            setUser(userUpdated);
            await storageUserSave(userUpdated);

        } catch (error) {
            throw error;
        }
    }

    async function storageUserAndTokenSave(userData: UserDTO, token: string) {
        try {
            setIsLoadingUserStorageData(true);

            await storageUserSave(userData);
            await storageAuthTokenSave(token);
        } catch (error) {
            throw error;
        } finally {
            setIsLoadingUserStorageData(false);
        }
    }

    async function signIn(email: string, password: string) {
        try {
            const { data } = await api.post('/sessions', { email, password });
            if (data.user && data.token) {
                await storageUserAndTokenSave(data.user, data.token);

                userAndTokenUpdate(data.user, data.token);

            }
        } catch (error) {
            throw error;
        } finally {
            setIsLoadingUserStorageData(false);
        }
    }

    async function signOut() {
        try {
            setIsLoadingUserStorageData(true);
            
            setUser({} as UserDTO);
            await storageUserDelete();
            await storageAuthTokenDelete();
        } catch (error) {
            throw error;
        } finally {
            setIsLoadingUserStorageData(false);
        }
    }

    async function loadUserData() {
        try {
            setIsLoadingUserStorageData(true);

            const userLogged = await storageUserGet();
            const token = await storageAuthTokenGet();

            if (token && userLogged) {
                userAndTokenUpdate(userLogged, token);
            }
        } catch (error) {
            throw error;
        } finally {
            setIsLoadingUserStorageData(false);
        }
    }

    useEffect(() => {
        loadUserData();
    }, []);

    useEffect(() => {
        const subscribe = api.registerInterceptTokenManager(signOut);

        return () =>{
            subscribe();
        }
    },[signOut]);

    return (
        <AuthContext.Provider value={{
            user,
            signIn,
            updateUserProfile,
            signOut,
            isLoadingUserStorageData
        }}>
            {children}
        </AuthContext.Provider>
    );
}