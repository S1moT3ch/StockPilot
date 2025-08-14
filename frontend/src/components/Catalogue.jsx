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
    TextField,
    FormControl,
    InputLabel,
    MenuItem,
    Select, Toolbar, AppBar,
} from '@mui/material';
import axios from 'axios';

import AddProduct from './AddProduct';
import Bar from "./Bar";

const Catalogue = () => {
    const [products, setProducts] = useState([]);
    const [selectedProduct, setSelectedProduct] = useState(null);
    const [categories, setCategories] = useState([]);
    const [filteredProducts, setFilteredProducts] = useState([]);
    const [selectedCategory, setSelectedCategory] = useState('');
    const [searchTerm, setSearchTerm] = useState('');
    const [loading, setLoading] = useState(false);
    const [open, setOpen] = useState(false);
    const [openAdd, setOpenAdd] = useState(false);
    const [newSegnalazione, setNewSegnalazione] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);

    useEffect(() => {
        const fetchProducts = async () => {
            const token = localStorage.getItem('accessToken');
            try {
                const res = await axios.get('http://localhost:5000/api/products/all', {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                    withCredentials: true,
                });
                setProducts(res.data);
                setFilteredProducts(res.data)
            } catch (error) {
                console.error("Errore nel recupero prodotti:", error);
            }
        };

        const fetchCategories = async () => {
            const token = localStorage.getItem('accessToken');
            try {
                const res = await axios.get('http://localhost:5000/api/categories/all', {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                    withCredentials: true,
                });
                setCategories(res.data);
            } catch (error) {
                console.error("Errore nel recupero prodotti:", error);
            }
        };

        fetchProducts();
        fetchCategories();
    }, [])

    useEffect(() => {
        let filtered = [...products];

        if (searchTerm.trim()){
            filtered = filtered.filter(product =>
                product.nome.toLowerCase().includes(searchTerm.toLowerCase())
            );
        }

        if (selectedCategory) {
            filtered = filtered.filter(product =>
                product.categoria.nome === selectedCategory
            );
        }

        setFilteredProducts(filtered);
    }, [searchTerm, selectedCategory,products]);

    const handleViewDetails = async (productId) => {
        setLoading(true);
        setOpen(true);
        const token = localStorage.getItem('accessToken');
        try {
            const res = await axios.get(`http://localhost:5000/api/products/${productId}`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
                withCredentials: true,
            });
            setSelectedProduct(res.data);
        } catch (error) {
            console.error("Errore nel recupero dettagli ordine:", error);
        } finally {
            setLoading(false);
        }
    };

    const handleViewAdd = () => {
        setOpenAdd(true);
    };

    const handleClose = () => {
        setOpen(false);
        setSelectedProduct(null)
    };

    const handleCloseAdd = () => {
        setOpenAdd(false);
    };

    const handleSegnalazioneChange = (event) => {
        setNewSegnalazione(event.target.value);
    };

    const handleAddSegnalazione = async () => {
        const token = localStorage.getItem('accessToken');
        if (!newSegnalazione.trim()) {
            alert("La segnalazione non può essere vuota.");
            return;
        }

        setIsSubmitting(true);
        try {
            await axios.post(`http://localhost:5000/api/products/segnalazione`, {
                productId: selectedProduct._id,
                segnalazione: newSegnalazione
            }, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
                withCredentials: true,
            });
            setSelectedProduct((prev) => ({
                ...prev,
                segnalazione: newSegnalazione,
            }));
            setNewSegnalazione('');
        } catch (error) {
            console.error("Errore nell'aggiungere la segnalazione:", error);
        } finally {
            setIsSubmitting(false);
        }
    };


    const handleDelete = async (productId) => {
        const token = localStorage.getItem('accessToken')
        try {
            await axios.delete(`http://localhost:5000/api/products/${productId}`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
                withCredentials: true,
            });
            setProducts(prevProducts => prevProducts.filter(product => product._id !== productId));
            handleClose();
        } catch (error) {
            console.log("Errore nell'evasione dell'ordine selezionato", error);
        }
    }

    return (
        <Box>
            <Bar />

            <Typography variant="h4" gutterBottom>Catalogo Prodotti</Typography>

            <Box display="flex" gap={2} mb={4} mt={6}>
                <TextField
                    fullWidth
                    label="Cerca prodotto"
                    variant="outlined"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                />
                <FormControl fullWidth>
                    <InputLabel>Categoria</InputLabel>
                    <Select
                        value={selectedCategory}
                        label="Categoria"
                        onChange={(e) => setSelectedCategory(e.target.value)}
                    >
                        <MenuItem value="">Tutte</MenuItem>
                        {categories.map((cat, index) => (
                            <MenuItem
                                key={index}
                                value={cat.nome}
                            >
                                {cat.nome}
                            </MenuItem>
                        ))}
                    </Select>
                </FormControl>
            </Box>

            {filteredProducts.map((product) => (
                <Paper
                    key={product._id}
                >
                    <Box>
                        <Typography variant="h6">Prodotto #{product._id}</Typography>
                        <Typography>Nome: {product.nome}</Typography>
                        <Typography>Categoria: {product.categoria.nome}</Typography>
                    </Box>
                    <Button variant="outlined" onClick={() => handleViewDetails(product._id)}>
                        Dettagli
                    </Button>
                </Paper>
            ))}

            <Dialog open={open} onClose={handleClose} fullWidth maxWidth="sm">
                <DialogTitle>Dettagli Prodotto</DialogTitle>
                <DialogContent>
                    {loading ? (<Box sx={{display: 'flex', justifyContent: 'center', p: 2}}>
                            <CircularProgress/>
                        </Box>
                    ) : selectedProduct ? (
                        <Box>
                            <Typography>Nome: {selectedProduct.nome}</Typography>
                            <Typography>Descrizione: {selectedProduct.descrizione}</Typography>
                            <Typography>Quantità: {selectedProduct.quantità}</Typography>
                            <Typography>Categoria: {selectedProduct.categoria.nome}</Typography>
                            <Typography>Ubicazione</Typography>
                            <Typography>Corridoio: {selectedProduct.ubicazione.corridoio}</Typography>
                            <Typography>Scaffale: {selectedProduct.ubicazione.scaffale}</Typography>
                            <Typography>Mensola: {selectedProduct.ubicazione.mensola}</Typography>
                            <Box>
                                {selectedProduct.segnalazione && (
                                    <Typography>Segnalazione: {selectedProduct.segnalazione}</Typography>
                                )}
                            </Box>

                            {!selectedProduct.segnalazione && (
                                <Box>
                                    <TextField
                                        label="Aggiungi Segnalazione"
                                        multiline
                                        rows={4}
                                        fullWidth
                                        value={newSegnalazione}
                                        onChange={handleSegnalazioneChange}
                                    />
                                    <Box sx={{ mt: 2 }}>
                                        <Button
                                            variant="outlined"
                                            onClick={handleAddSegnalazione}
                                            disabled={isSubmitting}
                                        >
                                            {isSubmitting ? 'Invio' : 'Aggiungi Segnalazione'}
                                        </Button>
                                    </Box>
                                </Box>
                            )}

                            <Button variant='outlined' onClick={() => { handleDelete(selectedProduct._id); handleClose()}}>
                                Cancella prodotto
                            </Button>
                        </Box>
                    ) : (
                        <Typography>Errore nel caricamento dell'ordine.</Typography>
                    )}
                </DialogContent>
            </Dialog>

            <Button variant='outlined' onClick={ handleViewAdd }>
                Aggiungi un prodotto
            </Button>

            <Dialog open={openAdd} onClose={handleCloseAdd} fullWidth maxWidth="sm">
                <DialogTitle>Aggiungi un Prodotto</DialogTitle>
                <DialogContent>
                    <AddProduct
                        categories={categories}
                        setCategories={setCategories}
                        handleCloseAdd={handleCloseAdd}
                        setProduct={setProducts}
                        setFilteredProducts={setFilteredProducts}
                    />
                </DialogContent>
            </Dialog>
        </Box>
    )
}

export default Catalogue;