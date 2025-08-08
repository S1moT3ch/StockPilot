import {useEffect, useState} from 'react';
import axios from "axios";
import { TextField, Button, Box, CircularProgress, Alert } from '@mui/material';

function UserProfile() {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null)

    const [editMode, setEditMode] = useState(false);
    const [email, setEmail] = useState('');
    const [cellulare, setCellulare] = useState('');
    const [saving, setSaving] = useState(false);
    const [saveError, setSaveError] = useState(null);
    const [saveSuccess, setSaveSuccess] = useState(null);

    useEffect(() => {
        const token = localStorage.getItem('accessToken');
        const fetchUser = async () => {
            try {
                const res = await axios.get('http://localhost:5000/api/auth/me', {
                    headers: {
                        'Content-Type': 'application/json',
                        Authorization:  `Bearer ${token}`,
                    },
                    withCredentials: true,
                });

                if (res.status !== 200) {
                    throw new Error('Errore nel recupro dati');
                }

                const data = await res.data;
                setUser(data);

                setEmail(data.email || '');
                setCellulare(data.cellulare || '')
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchUser();
    }, [])

    const handleEditClick = () => {
        setEditMode(true);
        setSaveError(null);
        setSaveSuccess(null);
    };

    const handleSave = async () => {
        setSaving(true);
        setSaveError(null);
        setSaveSuccess(null);

        const token = localStorage.getItem('accessToken');

        try {
            const res = await axios.put(
                'http://localhost:5000/api/auth/editMe',
                {email, cellulare},
                {
                headers: {
                    'content-type': 'application/json',
                    Authorization:  `Bearer ${token}`,
                },
                    withCredentials: true,
            })

            if (res.status !== 200) {
                throw new Error('Errore nel salvataggio dati');
            }

            setUser(res.data);
            setEditMode(false);
            setSaveSuccess('Dati aggiornati con successo');
        } catch (err) {
            setSaveError(err.response?.data?.message || err.message);
        } finally {
            setSaving(false);
        }
    }

    if (loading) return <p>Caricamento dati...</p>;
    if (error) return <p>Errore: {error}</p>;
    if(!user) return <p>Nessun dato utente disponibile</p>;

    return (
        <Box>
            <h2>Profilo Utente</h2>
            <p>Username: {user.username}</p>
            <p>Nome: {user.nome}</p>
            <p>Cognome: {user.cognome}</p>
            <p>Data di Nascita: {user.dataNascita.split('T')[0]}</p>
            <p>Data di Assunzione: {user.dataAssunzione.split('T')[0]}</p>

            <TextField
                label="cellulare"
                type="tel"
                value={cellulare}
                onChange={(e) => setCellulare(e.target.value.replace(/\D/g, ''))}
                disabled={!editMode}
                InputLabelProps={{
                    shrink: true,
                }}
                sx={{
                '& .MuiInputBase-input.Mui-disabled' : {
                    color: 'black',
                    WebkitTextFillColor: 'black'
                },
                }}
            />

            <TextField
                label="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                disabled={!editMode}
                InputLabelProps={{
                    shrink: true,
                }}
                sx={{
                    '& .MuiInputBase-input.Mui-disabled' : {
                        color: 'black',
                        WebkitTextFillColor: 'black'
                    },
                }}
            />

            {saveError && <Alert severity="error" sx={{ mt: 2 }}>{saveError}</Alert>}
            {saveSuccess && <Alert severity="success" sx={{ mt: 2 }}>{saveSuccess}</Alert>}

            {!editMode ? (
                <Button variant="contained" color="primary" onClick={handleEditClick}>Modifica</Button>
            ) : (
                <Button
                    variant="contained"
                    color="secondary"
                    onClick={handleSave}
                >
                    {saving ? <CircularProgress /> : 'Salva'}
                </Button>
            )}
        </Box>
    )
}

export default UserProfile;
