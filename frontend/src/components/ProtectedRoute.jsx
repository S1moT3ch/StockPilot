import { useEffect, useState} from 'react';
import {Navigate, Outlet } from 'react-router-dom';
import {checkAuth} from '../services/authService';

//funzione per vericare l'autenticazione lato client
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
    if (!isAuth) return <Navigate to ='/login' replace />

    return <Outlet />;
}

export default ProtectedRoute;