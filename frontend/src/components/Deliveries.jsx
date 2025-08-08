import React, { useEffect, useState } from 'react';
import {
    Box,
    Button,
    Typography,
    Paper,
    Dialog,
    DialogTitle,
    DialogContent,
    CircularProgress,
    FormControl,
    InputLabel,
    MenuItem,
    Select
} from '@mui/material';
import axios from 'axios';
import Options from "./Options";

const Deliveries = () => {
    const [deliveries, setDeliveries] = useState([]);
    const [selectedDelivery, setSelectedDelivery] = useState(null);
    const [loading, setLoading] = useState(false);
    const [open, setOpen] = useState(false);

    useEffect(() => {
        const fetchDeliveries = async () => {
            const token = localStorage.getItem('accessToken');
            try {
                const res = await axios.get('http://localhost:5000/api/deliveries/all', {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                    withCredentials: true,
                });
                setDeliveries(res.data);
            } catch (error) {
                console.error("Errore nel recupero ordini:", error);
            }
        };

        fetchDeliveries();
    }, [])

    const handleViewDetails = async (deliveryId) => {
        setLoading(true);
        setOpen(true);
        const token = localStorage.getItem('accessToken');
        try {
            const res = await axios.get(`http://localhost:5000/api/deliveries/${deliveryId}`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
                withCredentials: true,
            });
            setSelectedDelivery(res.data);
        } catch (error) {
            console.error("Errore nel recupero dettagli ordine:", error);
        } finally {
            setLoading(false);
        }
    };

    const handleClose = () => {
        setOpen(false);
        setSelectedDelivery(null)
    };


    const handleDelete = async (deliveryId) => {
        const token = localStorage.getItem('accessToken')
        try {
            await axios.delete(`http://localhost:5000/api/orders/${deliveryId}`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
                withCredentials: true,
            });
            setDeliveries(prevDeliveries => prevDeliveries.filter(delivery => delivery._id !== deliveryId));
            handleClose();
        } catch (error) {
            console.log("Errore nell'evasione dell'ordine selezionato", error);
        }
    }

    return (
        <Box>
            <Typography variant="h4" gutterBottom>Registrazione consegne</Typography>

            {deliveries.map((delivery) => (
                <Paper
                    key={delivery._id}
                >
                    <Box>
                        <Typography variant="h6">Consegna #{delivery._id}</Typography>
                        <Typography>Azienda: {delivery.vettore.azienda}</Typography>
                        <Typography>Corriere: {delivery.vettore.trasportatore}</Typography>
                        <Typography>Prodotto: {delivery.prodotto.nome}</Typography>
                        <Typography>Data: {delivery.data.split('T')[0]}</Typography>
                    </Box>
                    <Button variant="outlined" onClick={() => handleViewDetails(delivery._id)}>
                        Dettagli
                    </Button>
                </Paper>
            ))}

            <Dialog open={open} onClose={handleClose} fullWidth maxWidth="sm">
                <DialogTitle>Dettagli Consegna</DialogTitle>
                <DialogContent>
                    {loading ? (<Box sx={{display: 'flex', justifyContent: 'center', p: 2}}>
                            <CircularProgress/>
                        </Box>
                    ) : selectedDelivery ? (
                        <Box>
                            <Typography>Azienda: {selectedDelivery.vettore.azienda}</Typography>
                            <Typography>Corriere: {selectedDelivery.vettore.trasportatore}</Typography>
                            <Typography>Prodotto</Typography>
                            <Typography>Nome: {selectedDelivery.prodotto.nome}</Typography>
                            <Typography>Descrizione: {selectedDelivery.prodotto.descrizione}</Typography>
                            <Typography>Categoria: {selectedDelivery.prodotto.categoria.nome}</Typography>
                            <Typography>Data dell'ordine: {selectedDelivery.data.split('T')[0]}</Typography>
                            <Box>
                                <Typography>Ubicazione</Typography>
                                <Box>
                                    {selectedDelivery.prodotto.inMagazzino ? (
                                            <Box>
                                                <Typography>Corridoio: {selectedDelivery.prodotto.ubicazione.corridoio}</Typography>
                                                <Typography>Scaffale: {selectedDelivery.prodotto.ubicazione.scaffale}</Typography>
                                                <Typography>Mensola: {selectedDelivery.prodotto.ubicazione.mensola}</Typography>
                                            </Box>
                                        ) : (
                                            <Options />
                                        )
                                    }
                                </Box>
                            </Box>
                            <Button variant='outlined' onClick={() => { handleDelete(selectedDelivery._id); handleClose()}}>
                                Registra consegna
                            </Button>
                        </Box>
                    ) : (
                        <Typography>Errore nel caricamento dell'ordine.</Typography>
                    )}
                </DialogContent>
            </Dialog>
        </Box>
    )
}

export default Deliveries;