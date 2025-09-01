//import dei componenti necessari
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
import {BACKEND_URL} from "../config/config";

const Options = ({productId}) => {
    const [locations, setLocations] = useState([]);
    const [selectedLocation, setSelectedLocation] = useState('');
    const [successMessage, setSuccessMessage] = useState('');
    const [errorMessage, setErrorMessage] = useState('');

    useEffect(() => {
        //chiamata http con Axios con autenticazione per recuperare la lista di tutte le ubicazioni
        const fetchLocations = async () => {
            const token = localStorage.getItem('accessToken');

            try{
                const res = await axios.get(`${BACKEND_URL}/api/locations/all`, {
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

    //funzione gestore cambiamenti di valore nel campo ubicazione
    const handleChange = (event) => {
        setSelectedLocation(event.target.value);
    }

    //chiamata http con Axios con autenticazione per aggiornare l'ubicazione di un determinato prodotto
    const handleUpdateProductLocation = async (productId, locationId) => {
        try{
            const token = localStorage.getItem('accessToken');
            const response = await axios.put(`${BACKEND_URL}/api/products/location/${productId}`, {locationId}, {
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

    //componente per scegliere dove riporre un prodotto in magazzino
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
                    {/* menu a tendina delle ubicazioni possibili */}
                    {locations.map((location) => (
                        <MenuItem key={location._id} value={location._id}>
                            Corridoio&nbsp;<strong>{location.corridoio}</strong>,
                            Scaffale&nbsp;<strong>{location.scaffale}</strong>,
                            Mensola&nbsp;<strong>{location.mensola}</strong>
                        </MenuItem>
                    ))}
                </Select>
            </FormControl>

            {/* gestisce eventuali errori provenienti dal backend*/}
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

            <Button  sx={{bgcolor:"primary.main", color:"white", margin:"10px 0",
                            "&:hover": {
                                bgcolor: "primary.main",
                                boxShadow: "inset 0px 4px 8px rgba(0,0,0,0.4)"
                            },
                        }}
                variant="contained"
                onClick={() => handleUpdateProductLocation(productId, selectedLocation)}
            >
                Aggiungi prodotto in magazzino
            </Button>


        </Box>
    )
}

export default Options;