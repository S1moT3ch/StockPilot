//import dei componenti e degli hook necessari
import React, {useState, useEffect} from "react";

import {
    Box,
    Button,
    TextField,
    MenuItem,
    Select,
    FormControl,
    InputLabel
} from '@mui/material';
import axios from "axios";
import './style/AddProduct.css';
import {BACKEND_URL} from "../config/config";

//componente per aggiugere i prodotti, che riceve delle props dal suo componente genitore
const AddProduct = ({ categories, setCategories, handleCloseAdd, setProduct, setFilteredProducts}) => {

    const [locations, setLocations] = useState([]);
    const [nome, setNome] = useState('');
    const [descrizione, setDescrizione] = useState('');
    const [quantità, setQuantità] = useState(0);
    const [categoria, setCategoria] = useState('');
    const [ubicazione, setUbicazione] = useState('');
    const [segnalazione, setSegnalazione] = useState('');

    useEffect(() => {

        //richiesta http con Axios per ottenere i dati delle ubicazioni dal backend
        const fetchLocations = async () => {
            //recupero e uso del token nella richiesta per una maggior sicurezza sull'operazione
            const token = localStorage.getItem('accessToken');

            try {
                const res = await axios.get(`${BACKEND_URL}/api/locations/all`, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                    withCredentials: true,
                })
                setLocations(res.data)
            } catch (error) {
                console.error("Errore nel recupero delle ubicazioni:", error);
            }
        }

        fetchLocations();

    }, []);

    //funzione per modificare l'ubicazione del prodotto
    const handleAdd = async () => {
        //recupero e uso del token nella richiesta per una maggior sicurezza sull'operazione
        const token = localStorage.getItem('accessToken');
        try {
            const res = await axios.post(`${BACKEND_URL}/api/products/new`,
                {nome, descrizione, quantità, ubicazione, categoria, segnalazione},
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                    withCredentials: true,
                }
            )

            const prodotto = res.data.populatedProduct;

            //set degli array per gestire eventualmente la ricerca filtrata di prodotti
            setProduct(prev => [...prev, {
                _id: prodotto._id,
                nome: prodotto.nome,
                descrizione: prodotto.descrizione,
                quantità: prodotto.quantità,
                ubicazione: prodotto.ubicazione,
                categoria: prodotto.categoria.nome,
                segnalazione: prodotto.segnalazione,
            }]);

            setFilteredProducts(prev => [...prev, {
                _id: prodotto._id,
                nome: prodotto.nome,
                descrizione: prodotto.descrizione,
                quantità: prodotto.quantità,
                ubicazione: prodotto.ubicazione,
                categoria: prodotto.categoria ? prodotto.categoria.nome : '',
                segnalazione: prodotto.segnalazione,
            }]);
        } catch (error) {
            console.error("Errore nell'aggiunta del nuovo prootto:", error);
        }
    }

    // box per aggiungere un prodotto con i relativi campi
    return (
        <Box className="containerForm">
            <TextField
                label="Aggiungi nome"
                type="text"
                required
                value = {nome}
                onChange={(e) => setNome(e.target.value)}
            />

            <TextField
                label="Aggiungi descrizione"
                type="text"
                required
                value = {descrizione}
                onChange={(e) => setDescrizione(e.target.value)}
            />

            <TextField
                label="Aggiungi quantità"
                type="number"
                required
                value = {quantità}
                onChange={(e) => setQuantità(e.target.value)}
            />

            <FormControl fullWidth>
                <InputLabel id="categoria-label">Categoria</InputLabel>
                <Select
                    labelId="categoria-label"
                    value={categoria}
                    label="Categoria"
                    onChange={(e) => setCategoria(e.target.value)}
                >
                    {/* visualizza un menù a tendina per visualizzare le categorie disponibili */}
                    <MenuItem value="">Tutte</MenuItem>
                    {categories.map((cat, index) => (
                        <MenuItem
                            key={index}
                            value={cat._id}
                        >
                            {cat.nome}
                        </MenuItem>
                    ))}
                </Select>
            </FormControl>

            <FormControl fullWidth>
                <InputLabel id="ubicazione-label">Ubicazione</InputLabel>
                <Select
                    labelId="ubicazione-label"
                    value={ubicazione}
                    label="Aggiungi Ubicazione"
                    onChange = {(e) => setUbicazione(e.target.value)}
                >
                    {/* visualizza un menù a tendina per visualizzare le ubicazioni disponibili */}
                    {locations.map((location) => (
                        <MenuItem key={location._id} value={location._id}>
                            Corridoio&nbsp;<strong>{location.corridoio}</strong>,
                            Scaffale&nbsp;<strong>{location.scaffale}</strong>,
                            Mensola&nbsp;<strong>{location.mensola}</strong>
                        </MenuItem>
                    ))}
                </Select>
            </FormControl>

            <TextField
                label="Aggiungi eventuale segnalazione"
                type="text"
                value = {segnalazione}
                onChange={(e) => setSegnalazione(e.target.value)}
            />
            <Button variant="outlined" onClick={() => {handleAdd(); handleCloseAdd()}}
                    sx={{bgcolor:"primary.main", color:"white", fontSize:"15px",
                            "&:hover": {
                                bgcolor: "primary.main",
                                boxShadow: "inset 0px 4px 8px rgba(0,0,0,0.4)"
                            }
                        }}>
                Aggiungi Prodotto
            </Button>
        </Box>
    )
}

export default AddProduct;