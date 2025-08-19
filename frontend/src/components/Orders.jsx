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
import Bar from "./Bar";
import Options from "./Options";

const Orders = () => {
    const [orders, setOrders] = useState([]);
    const [selectedOrder, setSelectedOrder] = useState(null);
    const [loading, setLoading] = useState(false);
    const [open, setOpen] = useState(false);

    useEffect(() => {
        const fetchOrders = async () => {
            const token = localStorage.getItem('accessToken');
            try {
                const res = await axios.get('http://localhost:5000/api/orders/all', {
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


    const handleViewDetails = async (orderId) => {
        setLoading(true);
        setOpen(true);
        const token = localStorage.getItem('accessToken');
        try {
            const res = await axios.get(`http://localhost:5000/api/orders/${orderId}`, {
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

    const handleClose = () => {
        setOpen(false);
        setSelectedOrder(null)
    };


    const handleDelete = async (orderId) => {
        const token = localStorage.getItem('accessToken')
        const order = orders.find(o => o._id === orderId);

        try {
            await axios.delete(`http://localhost:5000/api/orders/${orderId}`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
                withCredentials: true,
            });

            await axios.put(`http://localhost:5000/api/products/order/${order.prodotto._id}`, {
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

    return (
        <Box>
            <Bar />
            <Box>
                <Typography variant="h4" gutterBottom>Tutti gli ordini</Typography>

                {orders.map((order) => (
                    <Paper
                        key={order._id}
                    >
                        <Box>
                            <Typography variant="h6">Ordine #{order._id}</Typography>
                            <Typography>Cliente: {order.cliente.nome} {order.cliente.cognome}</Typography>
                            <Typography>Prodotto: {order.prodotto.nome}</Typography>
                            <Typography>Data: {order.data.split('T')[0]}</Typography>
                        </Box>
                        <Button variant="outlined" onClick={() => handleViewDetails(order._id)}>
                            Dettagli
                        </Button>
                    </Paper>
                ))}

                <Dialog open={open} onClose={handleClose} fullWidth maxWidth="sm">
                    <DialogTitle>Dettagli Ordine</DialogTitle>
                    <DialogContent>
                        {loading ? (<Box sx={{display: 'flex', justifyContent: 'center', p: 2}}>
                                <CircularProgress/>
                            </Box>
                        ) : selectedOrder ? (
                            <Box>
                                <Typography>Cliente: {selectedOrder.cliente.nome} {selectedOrder.cliente.cognome}</Typography>
                                <Typography>Indirizzo: {selectedOrder.cliente.indirizzo}, {selectedOrder.cliente.città}</Typography>
                                <Typography>Prodotto: {selectedOrder.prodotto.nome}</Typography>
                                <Box>
                                    <Typography>Descrizione: {selectedOrder.prodotto.descrizione}</Typography>
                                    <Typography>Categoria: {selectedOrder.prodotto.categoria.nome}</Typography>
                                    <Typography>Quantità ordinata: {selectedOrder.quantita}</Typography>
                                    <Box>
                                        <Typography>Ubicazione</Typography>
                                        <Box>
                                            {selectedOrder.prodotto.inMagazzino ? (
                                                <Box>
                                                    <Typography>Corridoio: {selectedOrder.prodotto.ubicazione.corridoio}</Typography>
                                                    <Typography>Scaffale: {selectedOrder.prodotto.ubicazione.scaffale}</Typography>
                                                    <Typography>Mensola: {selectedOrder.prodotto.ubicazione.mensola}</Typography>
                                                </Box>
                                            ) : (
                                                <Typography>Prodotto non ancora in magazzino. Controlla la sua posizione nel catalogo prodotti</Typography>
                                            )
                                            }
                                        </Box>
                                    </Box>
                                </Box>
                                <Typography>Data dell'ordine: {selectedOrder.data.split('T')[0]}</Typography>
                                <Button variant='outlined' onClick={() => { handleDelete(selectedOrder._id); handleClose()}}>
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