import React, { useEffect, useState } from 'react';
import {
    AppBar,
    Toolbar,
    Box,
    Button,
    Typography,
    Grid,
    Paper,
    CircularProgress,
} from '@mui/material';
import axios from 'axios';
import {useNavigate} from "react-router-dom";

import Meteo from './Meteo';
import News from './News';
import Bar from './Bar';


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
        <Box>
            <Bar />
            <Box sx={{ p: 3 }}>
                <Typography variant="h4" gutterBottom sx={{ m: 3}}>
                    Benvenuto{user?.nome ?`, ${user.nome}` : ''}!
                </Typography>

                <Grid container spacing={2} mt={2} sx={{display: "flex", justifyContent: "space-evenly"}}>

                    <Grid item xs={12} md={9} xl={9} container direction="column" spacing={2} sx={{ width: "60vw" }}>
                        <Grid item>
                            <Meteo />
                        </Grid>

                        <Grid item>
                            <News />
                        </Grid>
                    </Grid>

                    <Grid item xs={12} sm={3} xl={9} sx={{ display: 'flex', flexDirection: 'column' , gap:2}}>
                        <Button
                            variant="contained"
                            onClick={() => navigate('/profile')}
                            size="large"
                            sx={{ fontSize: "1.2rem", paddingY: 1.5 }}
                        >
                            Area Riservata
                        </Button>

                        <Button
                            variant="contained"
                            onClick={() => navigate('/orders')}
                            size="large"
                            sx={{ fontSize: "1.2rem", paddingY: 1.5 }}
                        >
                            Ordini
                        </Button>

                        <Button
                            variant="contained"
                            onClick={() => navigate('/deliveries')}
                            size="large"
                            sx={{ fontSize: "1.2rem", paddingY: 1.5 }}
                        >
                            Consegne
                        </Button>

                        <Button
                            variant="contained"
                            onClick={() => navigate('/catalogue')}
                            size="large"
                            sx={{ fontSize: "1.2rem", paddingY: 1.5 }}
                        >
                            Catalogo
                        </Button>

                        <Button
                            variant="contained"
                            onClick={() => navigate('/chat')}
                            size="large"
                            sx={{ fontSize: "1.2rem", paddingY: 1.5 }}
                        >
                            Chat
                        </Button>

                        <Button
                            variant="contained"
                            onClick={handleLogout}
                            size="large"
                            sx={{ fontSize: "1.2rem", paddingY: 1.5, backgroundColor:"red" }}
                        >
                            Logout
                        </Button>
                    </Grid>
                </Grid>
            </Box>
        </Box>
    );
};

export default User;