import React, { useEffect, useState } from 'react';
import {
    Box,
    Button,
    Typography,
    Grid,
    Paper,
    CircularProgress,
} from '@mui/material';
import axios from 'axios';
import {useNavigate} from "react-router-dom";

import Meteo from './Meteo'
import News from './News'

const User = () => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    const navigate = useNavigate();

    useEffect(() => {
        const fetchUser = async () => {
            const token = localStorage.getItem('accessToken');
            try {
                const res = await axios.get('http://localhost:5000/api/auth/me', {
                    headers: {
                        'Content-Type': 'application/json',
                        Authorization:  `Bearer ${token}`,
                    },
                    withCredentials: true,
                });
                setUser(res.data);
            } catch (err) {
                console.error('Errore nel recupero dati utente:', err);
            } finally {
                setLoading(false);
            }
        };

        fetchUser();
    }, []);

    const handleLogout = async () => {
        try {
            localStorage.removeItem('accessToken');
            await axios.post('http://localhost:5000/api/auth/logout', {}, {
                withCredentials: true,
            });
            navigate('/login');
        } catch (error) {
            console.error("Errore durante il logout: ", error);
        }
    }

    if (loading) {
        return (
            <Box display="flex" justifyContent="center">
                <CircularProgress />
            </Box>
        );
    }

    return (
        <Box sx={{ p: 3 }}>
            <Typography variant="h4" gutterBottom sx={{ m: 3}}>
                Benvenuto{user?.nome ?`, ${user.nome}` : ''}!
            </Typography>

            <Grid container spacing={2} mt={2}>

                <Grid item xs={12} sm={9} container direction="column" spacing={2}>
                    <Grid item>
                        <Meteo />
                    </Grid>

                    <Grid item>
                        <News />
                    </Grid>
                </Grid>

                <Grid item xs={12} sm={3} sx={{ display: 'flex', flexDirection: 'column' , gap:2}}>
                    <Button
                        variant="contained"
                        onClick={() => navigate('/profile')}
                    >
                        Area Riservata
                    </Button>

                    <Button
                        variant="contained"
                        onClick={() => navigate('/orders')}
                    >
                        Ordini
                    </Button>

                    <Button
                        variant="contained"
                        onClick={() => navigate('/deliveries')}
                    >
                        Consegne
                    </Button>

                    <Button
                        variant="contained"
                        onClick={() => navigate('/catalogue')}
                    >
                        Catalogo
                    </Button>

                    <Button
                        variant="contained"
                        onClick={() => navigate('/chat')}
                    >
                        Chat
                    </Button>
                </Grid>

                <Button
                    variant="contained"
                    color="secondary"
                    onClick={handleLogout}
                >
                    Logout
                </Button>
            </Grid>
        </Box>
    );
};

export default User;