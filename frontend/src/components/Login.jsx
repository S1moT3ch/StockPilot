import React, {useState} from 'react';
import {
    Box,
    TextField,
    Button,
    Typography,
    Paper,
    Switch,
    FormControlLabel,
    Alert,
} from "@mui/material";
import 'bootstrap/dist/css/bootstrap.min.css';
import './style/Login.css';


//import componenti
import LoginForm from "./LoginForm";
import RegisterForm from "./RegisterForm";


const Login = () => {

    const [isLogin, setIsLogin] = useState(true);

    const toggleForm = () => {
        setIsLogin(prev => !prev);
    }
    return (
        <Box className = "login-container container mt-5 p-4 shadow rounded">
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