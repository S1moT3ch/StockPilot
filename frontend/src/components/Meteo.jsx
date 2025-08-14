import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Box, Typography, Paper } from '@mui/material';

const Meteo = () => {
    const [meteo, setMeteo] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error,setError] = useState(null);

    const API_KEY = "f46d15f626fe39b6a374c49015244d21";
    const CITY = "Bari,it";

    useEffect(() => {
        const fetchMeteo = async () => {
            try {
                const res = await axios.get(
                    `https://api.openweathermap.org/data/2.5/weather?q=${CITY}&units=metric&appid=${API_KEY}`
                );
                setMeteo(res.data);
            } catch (err) {
                setError("Impossibile caricare il meteo");
            } finally {
                setLoading(false);
            }
        };

        fetchMeteo();
    }, []);

    if (loading) return <Typography>Caricamento meteo...</Typography>;
    if (error) return <Typography color="error">{error}</Typography>;

    const iconUrl = `https://openweathermap.org/img/wn/${meteo.weather[0].icon}@2x.png`;

    return (
        <Paper
            sx={{
                p: 3,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
            }}
        >
            <Box>
                <Typography variant="h6">Meteo</Typography>
                <Typography variant="h6">{meteo.name}</Typography>
                <Typography>Temperatura: {meteo.main.temp}°C</Typography>
                <Typography>Descrizione: {meteo.weather[0].description}</Typography>
                <Typography>Umidità: {meteo.main.humidity}%</Typography>
                <Typography>Vento: {meteo.wind.speed} m/s</Typography>
            </Box>
            <Box>
                <img src={iconUrl} alt={meteo.weather[0].description} />
            </Box>
        </Paper>
    );
};

export default Meteo;