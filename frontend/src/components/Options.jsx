import React, {useEffect, useState} from 'react';
import {
    Box,
    Button,
    FormControl,
    InputLabel,
    MenuItem,
    Select, Typography
} from '@mui/material';
import axios from 'axios';

const Options = () => {
    const [locations, setLocations] = useState([]);
    const [selectedLocation, setSelectedLocation] = useState(null);

    useEffect(() => {
        const fetchLocations = async () => {
            const token = localStorage.getItem('accessToken');

            try{
                const res = await axios.get('http://localhost:5000/api/locations/all', {
                    headers :{
                        Authorization: `Bearer ${token}`,
                    },
                    withCredentials: true,
                })
                setLocations(res.data)
            } catch (error) {
                console.error("Errore nel recupero delle ubicazioni:", error);
            }
        }

        fetchLocations()
    }, [])

    const handleChange = (event) => {
        setSelectedLocation(event.target.value);
    }

    return (
        <Box>
            <Typography>Prodotto non in magazzino. Scegli un posto dove riporlo:</Typography>
            <FormControl sx={{ width:200 }}>
                <InputLabel id="select-label">Ubicazione</InputLabel>
                <Select
                    labelId="selected-label"
                    value={selectedLocation}
                    label="Ubicazione"
                    onChange={handleChange}
                >
                    {locations.map((location) => (
                        <MenuItem key={location.id} value={location.id}>
                            Corridoio&nbsp;<strong>{location.corridoio}</strong>,
                            Scaffale&nbsp;<strong>{location.scaffale}</strong>,
                            Mensola&nbsp;<strong>{location.mensola}</strong>
                        </MenuItem>
                    ))}
                </Select>
            </FormControl>
            <Button variant="contained">Aggiungi prodotto in magazzino</Button>
        </Box>
    )
}

export default Options;