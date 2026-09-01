import { useContext, useEffect } from "react";
import { AuthContext } from "../auth.context";
import { login, logout, register, getMe } from "../services/auth.api";

export const useAuth = () => {
    const context = useContext(AuthContext);

    const { user, setUser, loading, setLoading } = context;

    const handleLogin = async ({ email, password }) => {
        setLoading(true);

        try {
            const data = await login({ email, password });

            setUser(data.user);

            return true;

        } catch (err) {
            console.error("Login error:", err.response?.data || err.message);
            return false;

        } finally {
            setLoading(false);
        }
    };


    const handleRegister = async ({ username, email, password }) => {
        setLoading(true);

        try {
            const data = await register({ username, email, password });

            setUser(data.user);

            return true;

        } catch (err) {
            console.error("Register error:", err.response?.data || err.message);
            return false;

        } finally {
            setLoading(false);
        }
    };


    const handleLogout = async () => {
        setLoading(true);

        try {
            await logout();
            setUser(null);

        } catch (err) {
            console.error("Logout error:", err.response?.data || err.message);

        } finally {
            setLoading(false);
        }
    };


    useEffect(() => {
        const getAndSetUser = async () => {
            setLoading(true);

            try {
                const data = await getMe();
                setUser(data.user);

            } catch (err) {
                // User logged in nahi hai ya token nahi hai
                setUser(null);

            } finally {
                setLoading(false);
            }
        };

        getAndSetUser();
    }, [setUser, setLoading]);


    return {
        user,
        loading,
        handleRegister,
        handleLogin,
        handleLogout
    };
};