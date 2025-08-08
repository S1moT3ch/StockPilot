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


//import componenti
import LoginForm from "./LoginForm";
import RegisterForm from "./RegisterForm";


const Login = () => {

    const [isLogin, setIsLogin] = useState(true);

    const toggleForm = () => {
        setIsLogin(prev => !prev);
    }
    return (
        <Box>
            {isLogin ? (<LoginForm />) : (<RegisterForm setIsLogin={setIsLogin} />)}
            <Typography>
                {isLogin ? 'Sei un nuovo utente ?': 'Hai già un account?'}
            </Typography>
            <Button
                type="submit"
                variant="contained"
                color="secondary"
                onClick={toggleForm}
            >
                {isLogin ? 'Registrati' : 'Accedi'}
            </Button>
        </Box>
    )
};

export default Login;