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
import './style/LoginForm.css';

import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const LoginForm = () => {
    const navigate = useNavigate();

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [errorMsg, setErrorMsg] = useState('');
    const [successMsg, setSuccessMsg] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        setErrorMsg('');
        setSuccessMsg('');


        try {
            const res = await axios.post(
                `http://localhost:5000/api/auth/login`,
                { email, password },
                { withCredentials: true }
            );

            localStorage.setItem('accessToken', res.data.accessToken)
            setSuccessMsg('Login effettuato!');
            navigate('/user');
        } catch (err) {
            const message = err.response?.data?.error?.message;
            setErrorMsg(message);
        }
    };

    return (
        <Box className="container mt-5">
            <Paper className="login-form-container p-4 shadow rounded">
                <Typography variant="h5" className="mb-4 text-center access-title">
                    Accedi
                </Typography>
                <form onSubmit = {handleSubmit} className="d-flex flex-column gap-3">
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
                        className="btn btn-primary login-button"
                    >
                        Login
                    </Button>

                </form>
            </Paper>
        </Box>
    );
};

export default LoginForm;