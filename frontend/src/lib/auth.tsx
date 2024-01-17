import { createContext, useContext, useEffect, useState } from "react";
import { IAuthContext, IUser, IUserRole } from "../types/types";
import { Navigate, useLocation } from "react-router-dom";
import axios from "axios";
import instance from "../api/instance";

const AuthContext = createContext<IAuthContext>({
    user: null,
    isAuthenticated: false,
    roles: [],
    login: (user: IUser, accessToken: string, refreshToken: string) => { },
    logout: () => { },
    getUserRole: () => { },
});

export function useAuth() {
    return useContext(AuthContext);
}

export function AuthProvider({ children }: any) {
    const [user, setUser] = useState<IUser | null>(null);
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [roles, setRoles] = useState<IUserRole[]>([]);

    useEffect(() => {
        const username = localStorage.getItem('username');
        const accessToken = localStorage.getItem('access_token');
        const refreshToken = localStorage.getItem('refresh_token');
        if (username && accessToken && refreshToken) {
            axios.post(`${process.env.REACT_APP_API_HOST}/login/refresh`, {
                refresh: refreshToken
            })
                .then(res => {
                    login({ email: username }, res.data.access, res.data.refresh);
                })
        }
    }, [])

    function login(user: IUser, accessToken: string, refreshToken: string) {
        setIsAuthenticated(true);
        setUser(user);
        localStorage.setItem('username', user.email);
        localStorage.setItem('access_token', accessToken);
        localStorage.setItem('refresh_token', refreshToken);
    }

    const logout = () => {
        setIsAuthenticated(false);
        setUser(null);
        localStorage.setItem('username', '');
        localStorage.setItem('access_token', '');
        localStorage.setItem('refresh_token', '');
    }

    const getUserRole = () => {
        instance.get<IUserRole[]>(`${process.env.REACT_APP_API_HOST}/api/roles`)
            .then(res => {
                setRoles(res.data)
            })
    }

    const auth: IAuthContext = {
        user,
        isAuthenticated,
        roles,
        login,
        logout,
        getUserRole,
    }

    return (
        <AuthContext.Provider value={auth}>
            {children}
        </AuthContext.Provider>
    )
}

export function ProtectedRouter({ children }: any) {
    const { isAuthenticated } = useAuth();
    const location = useLocation();

    if (!isAuthenticated) {
        return <Navigate to="/login" replace state={{ from: location }} />;
    }

    return children;
}
