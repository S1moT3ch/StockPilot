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
    CircularProgress,
    TextField,
    FormControl,
    InputLabel,
    MenuItem,
    Select, Toolbar, AppBar,
} from '@mui/material';
import axios from 'axios';
import {BACKEND_URL} from "../config/config";

import AddProduct from './AddProduct';
import Bar from "./Bar";
import Options from "./Options";
import './style/Catalog.css';


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
        //chiamata http con Axios con autenticazione per recuperare la lista di tutti prodotti
        const fetchProducts = async () => {
            const token = localStorage.getItem('accessToken');
            try {
                const res = await axios.get(`${BACKEND_URL}/api/products/all`, {
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

        //chiamata http con Axios con autenticazione per recuperare la lista di tutte le categorie
        const fetchCategories = async () => {
            const token = localStorage.getItem('accessToken');
            try {
                const res = await axios.get(`${BACKEND_URL}/api/categories/all`, {
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

        //gestione ricerca prodotti filtrati
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

    //chiamata http con Axios con autenticazione per recuperare tutti i dettagli del prodotto selezionato
    const handleViewDetails = async (productId) => {
        setLoading(true);
        setOpen(true);
        const token = localStorage.getItem('accessToken');
        try {
            const res = await axios.get(`${BACKEND_URL}/api/products/${productId}`, {
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

    //funzione gestore apertura dialog aggiunta prodotto
    const handleViewAdd = () => {
        setOpenAdd(true);
    };

    //funzione gestore chiusura dialog aggiunta prodotto
    const handleCloseAdd = () => {
        setOpenAdd(false);
    };

    //funzione gestore chiusura dialog visualizza dettagli
    const handleClose = () => {
        setOpen(false);
        setSelectedProduct(null)
    };

    //funzione gestore cambiamento valore campo segnalazione
    const handleSegnalazioneChange = (event) => {
        setNewSegnalazione(event.target.value);
    };

    //chiamata http con Axios con autenticazione per aggiungere una segnalazione per un prodotto
    const handleAddSegnalazione = async () => {
        const token = localStorage.getItem('accessToken');
        if (!newSegnalazione.trim()) {
            alert("La segnalazione non può essere vuota.");
            return;
        }

        setIsSubmitting(true);
        try {
            await axios.post(`${BACKEND_URL}/api/products/segnalazione`, {
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

    //chiamata http con Axios con autenticazione per cancellare il prodotto selezionato
    const handleDelete = async (productId) => {
        const token = localStorage.getItem('accessToken')
        try {
            await axios.delete(`${BACKEND_URL}/api/products/${productId}`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
                withCredentials: true,
            });
            setProducts(prevProducts => prevProducts.filter(product => product._id !== productId));
            handleClose();
        } catch (error) {
            console.log("Errore nell'eliminazione del prodotto selezionato", error);
        }
    }

    //componente catalogo prodotti
    return (
        <Box>
            <Bar />
            <Typography variant="h4" gutterBottom align="center"
                        sx={{my: 3, fontWeight: "bold"}}
            >
                Catalogo Prodotti
            </Typography>
                
            <Box sx={{display: "flex", gap: 2, mt: 6, mb: 4, mx: "20px"}}>

                {/* campi per filtrare i prodotti */}
                <TextField
                    fullWidth
                    label="Cerca prodotto"
                    variant="outlined"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                />
                <FormControl fullWidth>
                    <InputLabel sx={{fontSize:"18px", fontWeight:"bold"}}>Categoria</InputLabel>
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
                <Paper sx={{ boxShadow: "none", border: "none" }}
                    key={product._id}
                >
                    <Box className="containerProduct">
                        <Typography variant="h6" sx={{fontWeight:"bold", fontSize:"20px"}}>Prodotto #{product._id}</Typography>
                        <Typography className="details"><strong>Nome:</strong> {product.nome}</Typography>
                        <Typography className="details"><strong>Categoria:</strong> {product.categoria.nome}</Typography>
                    </Box>
                    <Button variant="outlined" onClick={() => handleViewDetails(product._id)}
                            sx={{marginLeft:"30px", bgcolor:"primary.main", color:"white", fontSize:"15px",
                                "&:hover": {
                                    bgcolor: "primary.main",
                                    boxShadow: "inset 0px 4px 8px rgba(0,0,0,0.4)"
                                }
                            }}>
                        Dettagli
                    </Button>
                </Paper>
            ))}

            {/* dialog per visualiizare i dettagli del prodotto selezionato */}
            <Dialog open={open} onClose={handleClose} fullWidth maxWidth="sm">
                <DialogTitle  sx={{ fontWeight:"bold"}}>Dettagli Prodotto</DialogTitle>
                <DialogContent>
                    {loading ? (<Box sx={{display: 'flex', justifyContent: 'center', p: 2}}>
                            <CircularProgress/>
                        </Box>
                    ) : selectedProduct ? (
                        <Box>
                            <Typography><strong>Nome:</strong> {selectedProduct.nome}</Typography>
                            <Typography><strong>Descrizione:</strong> {selectedProduct.descrizione}</Typography>
                            <Typography><strong>Quantità:</strong> {selectedProduct.quantità}</Typography>
                            <Typography><strong>Categoria:</strong> {selectedProduct.categoria.nome}</Typography>
                            <Box>
                                <Typography><strong>Ubicazione:</strong></Typography>
                                <Box>
                                    {selectedProduct.inMagazzino ? (
                                        <Box>
                                            <Typography><strong>Corridoio:</strong> {selectedProduct.ubicazione.corridoio}</Typography>
                                            <Typography><strong>Scaffale:</strong> {selectedProduct.ubicazione.scaffale}</Typography>
                                            <Typography><strong>Mensola:</strong> {selectedProduct.ubicazione.mensola}</Typography>
                                        </Box>
                                    ) : (
                                        <Options productId={selectedProduct._id} />
                                    )
                                    }
                                </Box>
                            </Box>
                            <Box>
                                {selectedProduct.segnalazione && (
                                    <Typography><strong>Segnalazione:</strong> {selectedProduct.segnalazione}</Typography>
                                )}
                            </Box>

                            {/* campi per aggiungere una segnalazione per la consegna selezionata */}
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
                                            sx={{bgcolor:"primary.main", color:"white", marginBottom:"10px",
                                                "&:hover": {
                                                    bgcolor: "primary.main",
                                                    boxShadow: "inset 0px 4px 8px rgba(0,0,0,0.4)"
                                                },}}
                                        >
                                            {isSubmitting ? 'Invio' : 'Aggiungi Segnalazione'}
                                        </Button>
                                    </Box>
                                </Box>
                            )}

                            <Button variant='outlined' onClick={() => { handleDelete(selectedProduct._id); handleClose()}}
                                    sx={{bgcolor:"primary.main", color:"white",
                                        "&:hover": {
                                            bgcolor: "primary.main",
                                            boxShadow: "inset 0px 4px 8px rgba(0,0,0,0.4)"
                                        },}}>
                                Cancella prodotto
                            </Button>
                        </Box>
                    ) : (
                        <Typography>Errore nel caricamento dell'ordine.</Typography>
                    )}
                </DialogContent>
            </Dialog>

            <Button variant='outlined' onClick={ handleViewAdd }
                    sx={{bgcolor:"primary.main", color:"white", margin:"10px 0px 10px 30px",
                        "&:hover": {
                            bgcolor: "primary.main",
                            boxShadow: "inset 0px 4px 8px rgba(0,0,0,0.4)"
                        },}}>
                Aggiungi un prodotto
            </Button>

            <Dialog open={openAdd} onClose={handleCloseAdd} fullWidth maxWidth="sm">
                <DialogTitle sx={{fontWeight:"bold"}}>Aggiungi un Prodotto</DialogTitle>
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