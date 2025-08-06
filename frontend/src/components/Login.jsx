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

import axios from 'axios';
import { useNavigate } from 'react-router-dom';


const Login = () => {
    const navigate = useNavigate();

    const [isLogin, setIsLogin] = useState(true);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [errorMsg, setErrorMsg] = useState('');
    const [successMsg, setSuccessMsg] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        setErrorMsg('');
        setSuccessMsg('');

        const endpoint = isLogin ? 'api/auth/login' : '/api/auth/register';

        try {
            const res = await axios.post(
                `http://localhost:5000/${endpoint}`,
                { email, password },
                { withCredentials: true }
            );

            setSuccessMsg(isLogin ? 'Login effettuato!' : 'Registrazione avvenuta con successo!');

            navigate('/user');
        } catch (err) {
            const message = err.response?.data?.error?.message;
            setErrorMsg(message);
        }
    };

    return (
        <Box>
            <Paper>
                <Typography>
                    {isLogin ? 'Accedi' : 'Registrati'}
                </Typography>
                <form onSubmit = {handleSubmit}>
                    <TextField
                        label="Email"
                        type="email"
                        required
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                    />

                    <TextField
                        label="Password"
                        type="password"
                        required
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                    />

                    {errorMsg && (
                        <Alert severity="error">
                            {errorMsg}
                        </Alert>
                    )}

                    {successMsg && (
                        <Alert severity="success">
                            {successMsg}
                        </Alert>
                    )}

                    <Button
                        type="submit"
                        variant="contained"
                    >
                        {isLogin ? 'Login' : 'Registrati'}
                    </Button>

                    <FormControlLabel
                        control={
                         <Switch
                             checked={isLogin}
                             onChange={() => setIsLogin((prev) => !prev)}
                         />
                        }
                        label={isLogin ? 'Passa a Registrazione' : 'Passa a Login'}
                    />
                </form>
            </Paper>
        </Box>
    );
};

export default Login;