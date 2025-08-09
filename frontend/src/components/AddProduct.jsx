import React, {useState, useEffect} from "react";

import {
    Box,
    Button,
    TextField,
    MenuItem,
    Select,
} from '@mui/material';
import axios from "axios";

const AddProduct = ({ categories, setCategories, handleCloseAdd, setProduct, setFilteredProducts}) => {

    const [locations, setLocations] = useState([]);
    const [nome, setNome] = useState('');
    const [descrizione, setDescrizione] = useState('');
    const [quantità, setQuantità] = useState(0);
    const [categoria, setCategoria] = useState('');
    const [ubicazione, setUbicazione] = useState('');
    const [segnalazione, setSegnalazione] = useState('');

    useEffect(() => {

        const fetchLocations = async () => {
            const token = localStorage.getItem('accessToken');

            try {
                const res = await axios.get('http://localhost:5000/api/locations/all', {
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

    const handleAdd = async () => {
        const token = localStorage.getItem('accessToken');
        try {
            const res = await axios.post(`http://localhost:5000/api/products/new`,
                {nome, descrizione, quantità, ubicazione, categoria, segnalazione},
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                    withCredentials: true,
                }
            )

            const prodotto = res.data.populatedProduct;

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

    return (
        <Box>
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

            <Select
                fullWidth
                value={categoria}
                label="Categoria"
                onChange={(e) => setCategoria(e.target.value)}
            >
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

            <Select
                fullWidth
                value={ubicazione}
                label="Aggiungi Ubicazione"
                onChange = {(e) => setUbicazione(e.target.value)}
            >
                {locations.map((location) => (
                    <MenuItem key={location._id} value={location._id}>
                        Corridoio&nbsp;<strong>{location.corridoio}</strong>,
                        Scaffale&nbsp;<strong>{location.scaffale}</strong>,
                        Mensola&nbsp;<strong>{location.mensola}</strong>
                    </MenuItem>
                ))}
            </Select>

            <TextField
                label="Aggiungi eventuale segnalazione"
                type="text"
                required
                value = {segnalazione}
                onChange={(e) => setSegnalazione(e.target.value)}
            />
            <Button variant="outlined" onClick={() => {handleAdd(); handleCloseAdd()}}>Aggiungi Prodotto</Button>
        </Box>
    )
}

export default AddProduct;