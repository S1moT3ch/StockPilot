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

const User = () => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchUser = async () => {
            try {
                const res = await axios.get('http://localhost:5000/api/auth/me', {
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
                {['Profilo', 'Impostazioni', 'Statistiche', 'Notifiche', 'Aiuto', 'Logout'].map((label, index) => (
                    <Grid item xs={12} sm={6} md={4} key={index}>
                        <Button
                            fullWidth
                            variant="contained"
                            onClick={() => console.log(`${label} cliccato`)}
                        >
                            {label}
                        </Button>
                    </Grid>
                ))}

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
            </Grid>
        </Box>
    );
};

export default User;