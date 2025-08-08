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

const RegisterForm = ({setIsLogin}) => {

    const [username, setUsername] = useState('');
    const [nome, setNome] = useState('');
    const [cognome, setCognome] = useState('');
    const [dataNascita, setDataNascita] = useState('');
    const [cellulare, setCellulare] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [errorMsg, setErrorMsg] = useState('');
    const [successMsg, setSuccessMsg] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        setErrorMsg('');
        setSuccessMsg('');

        try{
            const res = await axios.post(
                'http://localhost:5000/api/auth/register',
                { username, nome, cognome, dataNascita, cellulare, email, password },
                {withCredentials: true}
            )

            setSuccessMsg('Registrazione avvenuta con successo');
        } catch (error) {
            const message = error.response?.data?.error?.message;
            setErrorMsg(message);
        }
    };

    return (
        <Box>
            <Paper>
                <Typography>
                    Registrati
                </Typography>

                <form onSubmit={handleSubmit}>

                    <TextField
                        label="Username"
                        type="text"
                        required
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                    />

                    <TextField
                        label="Nome"
                        type="text"
                        required
                        value={nome}
                        onChange={(e) => setNome(e.target.value)}
                    />

                    <TextField
                        label="Cognome"
                        type="text"
                        required
                        value={cognome}
                        onChange={(e) => setCognome(e.target.value)}
                    />

                    <TextField
                        label="Data di Nascita"
                        type="date"
                        required
                        value={dataNascita}
                        onChange={(e) => setDataNascita(e.target.value)}
                        InputLabelProps={{
                            shrink: true,
                        }}
                    />

                    <TextField
                        label="Cellulare"
                        type="tel"
                        required
                        value={cellulare}
                        onChange={(e) => setCellulare(e.target.value.replace(/\D/g, ''))}
                    />

                    <TextField
                        label="Email"
                        type="text"
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
                            {successMsg && setIsLogin(true)}
                        </Alert>
                    )}

                    <Button
                        type="submit"
                        variant="contained"
                    >
                        Registrati
                    </Button>
                </form>
            </Paper>
        </Box>
    )
}

export default RegisterForm;