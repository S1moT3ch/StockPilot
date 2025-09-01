//import dei componenti necessari
import React, { useEffect, useState } from 'react';
import {
    Box,
    Button,
    Typography,
    Paper,
    Dialog,
    DialogTitle,
    DialogContent,
    CircularProgress
} from '@mui/material';
import axios from 'axios';
import {BACKEND_URL} from "../config/config";

import Options from "./Options";
import Bar from "./Bar";
import './style/Deliveries.css';

const Deliveries = () => {
    const [deliveries, setDeliveries] = useState([]);
    const [selectedDelivery, setSelectedDelivery] = useState(null);
    const [loading, setLoading] = useState(false);
    const [open, setOpen] = useState(false);

    useEffect(() => {
        //chiamata http con Axios con autenticazione per recuperare la lista di tutte le consegne
        const fetchDeliveries = async () => {
            const token = localStorage.getItem('accessToken');
            try {
                const res = await axios.get(`${BACKEND_URL}/api/deliveries/all`, {
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

    //chiamata http con Axios con autenticazione per recuperare tutti i dettagli della consegna selezionata
    const handleViewDetails = async (deliveryId) => {
        setLoading(true);
        setOpen(true);
        const token = localStorage.getItem('accessToken');
        try {
            const res = await axios.get(`${BACKEND_URL}/api/deliveries/${deliveryId}`, {
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

    //funzione gestore chiusura dialog
    const handleClose = () => {
        setOpen(false);
        setSelectedDelivery(null)
    };

    //chiamata http con Axios con autenticazione per registare la consegna selezionata
    //e aggiornare la relativa quantità in magazzino
    const handleDelete = async (deliveryId) => {
        const token = localStorage.getItem('accessToken')
        const delivery = deliveries.find(d => d._id === deliveryId);
        try {
            await axios.delete(`${BACKEND_URL}/api/deliveries/${deliveryId}`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
                withCredentials: true,
            });

            await axios.put(`http://localhost:5000/api/products/delivery/${delivery.prodotto._id}`, {
                quantita: delivery.quantita,
            },{
                headers: {
                    Authorization: `Bearer ${token}`,
                }
            });
            setDeliveries(prevDeliveries => prevDeliveries.filter(delivery => delivery._id !== deliveryId));
            handleClose();
        } catch (error) {
            console.log("Errore nell'evasione dell'ordine selezionato", error);
        }
    }

    //componente per gestire la registrazione delle consegne
    return (
        <Box>
            <Bar />
            <Box>

                <Typography variant="h4" gutterBottom align="center" sx={{my: 3, fontWeight: "bold",}}>Registrazione consegne</Typography>

                {deliveries.map((delivery) => (
                    <Paper sx={{ boxShadow: "none", border: "none" }}
                        key={delivery._id}
                    >
                        <Box className="containerDeliveries">
                            <Typography variant="h6" sx={{fontWeight:"bold", fontSize:"20px"}}>Consegna #{delivery._id}</Typography>
                            <Typography className="details"><strong>Azienda:</strong> {delivery.vettore.azienda}</Typography>
                            <Typography className="details"><strong>Corriere:</strong> {delivery.vettore.trasportatore}</Typography>
                            <Typography className="details"><strong>Prodotto:</strong> {delivery.prodotto.nome}</Typography>
                            <Typography className="details"><strong>Data:</strong> {delivery.data.split('T')[0]}</Typography>
                        </Box>
                        <Button variant="outlined" onClick={() => handleViewDetails(delivery._id)}
                                sx={{marginLeft:"30px", bgcolor:"primary.main", color:"white", fontSize:"15px",
                                    "&:hover": {
                                        bgcolor: "primary.main",
                                        boxShadow: "inset 0px 4px 8px rgba(0,0,0,0.4)"
                                    },}}>
                            Dettagli
                        </Button>
                    </Paper>
                ))}

                {/* dialog per visualizzare i dettagli della consegna selezionata */}
                <Dialog open={open} onClose={handleClose} fullWidth maxWidth="sm">
                    <DialogTitle sx={{ fontWeight:"bold"}}>Dettagli Consegna</DialogTitle>
                    <DialogContent>
                        {loading ? (<Box sx={{display: 'flex', justifyContent: 'center', p: 2}}>
                                <CircularProgress/>
                            </Box>
                        ) : selectedDelivery ? (
                            <Box>
                                <Typography><strong>Azienda:</strong> {selectedDelivery.vettore.azienda}</Typography>
                                <Typography><strong>Corriere:</strong> {selectedDelivery.vettore.trasportatore}</Typography>
                                <Typography><strong>Prodotto</strong></Typography>
                                <Typography><strong>Nome:</strong> {selectedDelivery.prodotto.nome}</Typography>
                                <Typography><strong>Descrizione:</strong> {selectedDelivery.prodotto.descrizione}</Typography>
                                <Typography><strong>Categoria:</strong> {selectedDelivery.prodotto.categoria.nome}</Typography>
                                <Typography><strong>Quantità in arrivo:</strong> {selectedDelivery.quantita}</Typography>
                                <Typography><strong>Data dell'ordine:</strong> {selectedDelivery.data.split('T')[0]}</Typography>
                                <Box>
                                    <Typography><strong>Ubicazione</strong></Typography>
                                    <Box>
                                        {selectedDelivery.prodotto.inMagazzino ? (
                                            <Box>
                                                <Typography><strong>Corridoio:</strong> {selectedDelivery.prodotto.ubicazione.corridoio}</Typography>
                                                <Typography><strong>Scaffale:</strong> {selectedDelivery.prodotto.ubicazione.scaffale}</Typography>
                                                <Typography><strong>Mensola:</strong> {selectedDelivery.prodotto.ubicazione.mensola}</Typography>
                                            </Box>
                                        ) : (
                                            <Options productId={selectedDelivery.prodotto._id} />
                                        )
                                        }
                                    </Box>
                                </Box>
                                <Button variant='outlined' onClick={() => { handleDelete(selectedDelivery._id); handleClose()}}
                                        sx={{bgcolor:"primary.main", color:"white",
                                            "&:hover": {
                                                bgcolor: "primary.main",
                                                boxShadow: "inset 0px 4px 8px rgba(0,0,0,0.4)"
                                            },}}>
                                    Registra consegna
                                </Button>
                            </Box>
                        ) : (
                            <Typography>Errore nel caricamento dell'ordine.</Typography>
                        )}
                    </DialogContent>
                </Dialog>
            </Box>
        </Box>
    )
}

export default Deliveries;