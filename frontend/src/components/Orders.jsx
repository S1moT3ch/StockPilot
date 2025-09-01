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

import Bar from "./Bar";
import Options from "./Options";
import './style/Orders.css';

const Orders = () => {
    const [orders, setOrders] = useState([]);
    const [selectedOrder, setSelectedOrder] = useState(null);
    const [loading, setLoading] = useState(false);
    const [open, setOpen] = useState(false);

    useEffect(() => {
        //chiamata http con Axios con autenticazione per recuperare la lista di tutti gli ordini
        const fetchOrders = async () => {
            const token = localStorage.getItem('accessToken');
            try {
                const res = await axios.get(`${BACKEND_URL}/api/orders/all`, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                    withCredentials: true,
                });
                setOrders(res.data);
            } catch (error) {
                console.error("Errore nel recupero ordini:", error);
            }
        };

        fetchOrders();
    }, [])

    //chiamata http con Axios con autenticazione per recuperare tutti i dettagli dell'ordine selezionato
    const handleViewDetails = async (orderId) => {
        setLoading(true);
        setOpen(true);
        const token = localStorage.getItem('accessToken');
        try {
            const res = await axios.get(`${BACKEND_URL}/api/orders/${orderId}`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
                withCredentials: true,
            });
            setSelectedOrder(res.data);
        } catch (error) {
            console.error("Errore nel recupero dettagli ordine:", error);
        } finally {
            setLoading(false);
        }
    };

    //funzione gestore chiusura dialog
    const handleClose = () => {
        setOpen(false);
        setSelectedOrder(null)
    };

    //chiamata http con Axios con autenticazione per evadere l'ordine selezionato
    //e aggiornare la relativa quantità in magazzino
    const handleDelete = async (orderId) => {
        const token = localStorage.getItem('accessToken')
        const order = orders.find(o => o._id === orderId);

        try {
            await axios.delete(`${BACKEND_URL}/api/orders/${orderId}`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
                withCredentials: true,
            });

            await axios.put(`${BACKEND_URL}/api/products/order/${order.prodotto._id}`, {
                quantita: order.quantita,
            },{
                headers: {
                    Authorization: `Bearer ${token}`,
                }
            });

            setOrders(prevOrders => prevOrders.filter(order => order._id !== orderId));
            handleClose();
        } catch (error) {
            console.log("Errore nell'evasione dell'ordine selezionato", error);
        }
    }

    //componente per gestire l'evasione degli ordini
    return (
        <Box>
            <Bar />
            <Box>
                <Typography variant="h4" gutterBottom align="center"
                            sx={{my: 3, fontWeight: "bold"}}
                >
                    Tutti gli ordini
                </Typography>

                {orders.map((order) => (
                    <Paper sx={{ boxShadow: "none", border: "none" }}
                        key={order._id}
                    >
                        <Box className="containerOrders">
                            <Typography variant="h6"  sx={{fontWeight:"bold", fontSize:"20px"}}>Ordine #{order._id}</Typography>
                            <Typography className="details"><strong>Cliente:</strong> {order.cliente.nome} {order.cliente.cognome}</Typography>
                            <Typography className="details"><strong>Prodotto:</strong> {order.prodotto.nome}</Typography>
                            <Typography className="details"><strong>Data:</strong> {order.data.split('T')[0]}</Typography>
                        </Box>
                        <Button variant="outlined" onClick={() => handleViewDetails(order._id)}
                        sx={{marginLeft:"30px", bgcolor:"primary.main", color:"white", fontSize:"15px",
                            "&:hover": {
                                bgcolor: "primary.main",
                                boxShadow: "inset 0px 4px 8px rgba(0,0,0,0.4)"
                            },}}>
                            Dettagli
                        </Button>
                    </Paper>
                ))}

                {/* dialog per visualizzare i dettagli dell'ordine selezionato */}
                <Dialog open={open} onClose={handleClose} fullWidth maxWidth="sm">
                    <DialogTitle sx={{ fontWeight:"bold"}}>Dettagli Ordine</DialogTitle>
                    <DialogContent>
                        {loading ? (<Box sx={{display: 'flex', justifyContent: 'center', p: 2}}>
                                <CircularProgress/>
                            </Box>
                        ) : selectedOrder ? (
                            <Box>
                                <Typography><strong>Cliente:</strong> {selectedOrder.cliente.nome} {selectedOrder.cliente.cognome}</Typography>
                                <Typography><strong>Indirizzo:</strong> {selectedOrder.cliente.indirizzo}, {selectedOrder.cliente.città}</Typography>
                                <Typography><strong>Prodotto:</strong> {selectedOrder.prodotto.nome}</Typography>
                                <Box>
                                    <Typography><strong>Descrizione:</strong> {selectedOrder.prodotto.descrizione}</Typography>
                                    <Typography><strong>Categoria:</strong> {selectedOrder.prodotto.categoria.nome}</Typography>
                                    <Typography><strong>Quantità ordinata:</strong> {selectedOrder.quantita}</Typography>
                                    <Box>
                                        <Typography><strong>Ubicazione</strong></Typography>
                                        <Box>
                                            {selectedOrder.prodotto.inMagazzino ? (
                                                <Box>
                                                    <Typography><strong>Corridoio:</strong> {selectedOrder.prodotto.ubicazione.corridoio}</Typography>
                                                    <Typography><strong>Scaffale:</strong> {selectedOrder.prodotto.ubicazione.scaffale}</Typography>
                                                    <Typography><strong>Mensola:</strong> {selectedOrder.prodotto.ubicazione.mensola}</Typography>
                                                </Box>
                                            ) : (
                                                <Typography>Prodotto non ancora in magazzino. Controlla la sua posizione nel catalogo prodotti</Typography>
                                            )
                                            }
                                        </Box>
                                    </Box>
                                </Box>

                                {/* mostra la data dell'ordine senza orario */}
                                <Typography><strong>Data dell'ordine:</strong>Data dell'ordine: {selectedOrder.data.split('T')[0]}</Typography>
                                <Button variant='outlined' onClick={() => { handleDelete(selectedOrder._id); handleClose()}}
                                 sx={{bgcolor:"primary.main", color:"white",
                                    "&:hover": {
                                        bgcolor: "primary.main",
                                        boxShadow: "inset 0px 4px 8px rgba(0,0,0,0.4)"
                                    },}}>
                                    Evadi ordine
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

export default Orders;