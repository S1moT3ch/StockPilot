import { useEffect, useState} from 'react';
import {Navigate, Outlet } from 'react-router-dom';
import {checkAuth} from '../services/authService';
import App from "../App";

function ProtectedRoute() {
    const [isAuth, setIsAuth] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const verify = async() => {
            const result = await checkAuth();
            setIsAuth(result);
            setLoading(false);
        };

        verify();
    }, []);

    if (loading) return <p>Caricamento</p>;
}

export default ProtectedRoute;