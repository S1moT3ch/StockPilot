import React, {useEffect, useState} from 'react';
import {
    Alert,
    Box,
    Button,
    FormControl,
    InputLabel,
    MenuItem,
    Select, Typography
} from '@mui/material';
import axios from 'axios';

const Options = ({productId}) => {
    const [locations, setLocations] = useState([]);
    const [selectedLocation, setSelectedLocation] = useState('');
    const [successMessage, setSuccessMessage] = useState('');
    const [errorMessage, setErrorMessage] = useState('');

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

    const handleUpdateProductLocation = async (productId, locationId) => {
        try{
            const token = localStorage.getItem('accessToken');
            const response = await axios.put(`http://localhost:5000/api/products/location/${productId}`, {locationId}, {
                headers :{
                    Authorization: `Bearer ${token}`,
                },
                withCredentials: true,
            })
            setSuccessMessage('Ubicazione prodotto aggiunta con successo!');
        } catch (error) {
            console.error("Errore nell'update dell'ubicazione del prodotto", error);
            const message = error.response?.data?.error?.message;
            setErrorMessage(message);
        }
    }

    return (
        <Box>
            <Typography>Prodotto non in magazzino. Scegli un posto dove riporlo:</Typography>
            <FormControl sx={{ width:300 }}>
                <InputLabel id="select-label">Ubicazione</InputLabel>
                <Select
                    labelId="selected-label"
                    value={selectedLocation}
                    label="Ubicazione"
                    onChange={handleChange}
                >
                    {locations.map((location) => (
                        <MenuItem key={location._id} value={location._id}>
                            Corridoio&nbsp;<strong>{location.corridoio}</strong>,
                            Scaffale&nbsp;<strong>{location.scaffale}</strong>,
                            Mensola&nbsp;<strong>{location.mensola}</strong>
                        </MenuItem>
                    ))}
                </Select>
            </FormControl>

            {errorMessage && (
                <Alert severity="error">
                    {errorMessage}
                </Alert>
            )}

            {successMessage && (
                <Alert severity="success">
                    {successMessage}
                </Alert>
            )}

            <Button
                variant="contained"
                onClick={() => handleUpdateProductLocation(productId, selectedLocation)}
            >
                Aggiungi prodotto in magazzino
            </Button>


        </Box>
    )
}

export default Options;