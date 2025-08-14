import React, {useState} from 'react';
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

import {
    Box,
    Button,
    Typography,
    Paper,
} from "@mui/material";
import 'bootstrap/dist/css/bootstrap.min.css';
import './style/Login.css';


//import componenti
import LoginForm from "./LoginForm";
import RegisterForm from "./RegisterForm";
import {checkAuth} from "../services/authService";


const Login = () => {
    const navigate = useNavigate()

    const [isLogin, setIsLogin] = useState(true);
    const [isAuth, setIsAuth] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {

        const verify = async() => {
            const result = await checkAuth();
            setIsAuth(result);
            setLoading(false);
        };

        verify();
    }, [navigate]);

    if (isAuth) {
        navigate('/user', {replace: true});
    }

    const toggleForm = () => {
        setIsLogin(prev => !prev);
    }
    return (
        <Box className = "login-container container mt-4 p-4 shadow rounded">

            <div className="logo-container">
                <img src="/StockPilot_icon_full_no_bg.png" alt="Logo StockPilot" className="logo"/>
            </div>
            {isLogin ? (<LoginForm />) : (<RegisterForm setIsLogin={setIsLogin} />)}
            <Typography
                variant="body1"
                className="custom-text text-center my-3"
            >
                {isLogin ? 'Sei un nuovo utente ?': 'Hai già un account?'}
            </Typography>

            <div className="d-flex justify-content-center">
                <Button
                    type="submit"
                    variant="contained"
                    onClick={toggleForm}
                    className="submit-button"
                >
                    {isLogin ? 'Registrati' : 'Accedi'}
                </Button>
            </div>
        </Box>
    )
};

export default Login;