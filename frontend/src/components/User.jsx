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

    if (loading) {
        return (
            <Box display="flex" justifyContent="center">
                <CircularProgress />
            </Box>
        );
    }

    return (
        <Box>
            <Typography variant="h4" gutterBottom>
                Benvenuto{user?.nome ?`, ${user.nome}` : ''}!
            </Typography>

            <Grid container spacing={2} mt={2}>
                <div>
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
                </div>

                <Grid item xs={12} sm={6}>
                    <Paper>
                        <Typography>Meteo Bari</Typography>
                    </Paper>
                </Grid>

                <Grid item xs={12} sm={6}>
                    <Paper>
                        <Typography>News</Typography>
                    </Paper>
                </Grid>

                <Button
                    variant="contained"
                    color="secondary"
                    onClick={ async () => {
                        try {
                            localStorage.removeItem('accessToken');
                            await axios.post('http://localhost:5000/api/auth/logout', {}, {
                                withCredentials: true,
                            });
                            navigate('/login');
                        } catch (error) {
                            console.error("Errore durante il logout: ", error);
                        }
                    }}
                >
                    Logout
                </Button>
            </Grid>
        </Box>
    );
};

export default User;