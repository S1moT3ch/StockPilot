import React, {useEffect, useState} from 'react';
import axios from "axios";
import {
    Box,
    TextField,
    Button,
    CircularProgress,
    Alert,
    Paper,
    Typography,
    Grid, Toolbar, AppBar
} from '@mui/material';
import Bar from "./Bar";

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
            <Bar />
            <Box sx={{ mx: 'auto', mt: 2}}>
                <Paper elevation={3} sx={{ p: 4 }}>

                    <Typography variant="h5" gutterBottom>
                        Profilo Utente
                    </Typography>

                    <Grid container spacing={2} sx={{ mb: 2, display: "flex", flexDirection: "column" }}>
                        <Grid item xs={12} sm={6}>
                            <Typography><strong>Username:</strong> {user.username}</Typography>
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <Typography><strong>Nome:</strong> {user.nome}</Typography>
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <Typography><strong>Cognome:</strong> {user.cognome}</Typography>
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <Typography><strong>Data di Nascita:</strong> {user.dataNascita.split('T')[0]}</Typography>
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <Typography><strong>Data di Assunzione:</strong> {user.dataAssunzione.split('T')[0]}</Typography>
                        </Grid>
                    </Grid>

                    <Grid container spacing={2} sx={{ mb: 2 }}>
                        {editMode? (
                            <Grid item xs={12} sx={{ display: "flex", flexDirection: "column", gap:2 }}>
                                <TextField
                                    label="Cellulare"
                                    type="tel"
                                    value={cellulare}
                                    onChange={(e) => setCellulare(e.target.value.replace(/\D/g, ''))}
                                    disabled={!editMode}
                                />

                                <TextField
                                    label="Email"
                                    type="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    disabled={!editMode}
                                />
                            </Grid>
                        ) : (
                            <Grid container spacing={2} sx={{ mb: 2, display: "flex", flexDirection: "column"}}>
                                <Grid item xs={12} sm={6}>
                                    <Typography><strong>Cellulare:</strong> {user.cellulare}</Typography>
                                </Grid>
                                <Grid item xs={12} sm={6}>
                                    <Typography><strong>Email:</strong> {user.email}</Typography>
                                </Grid>
                            </Grid>
                        )}
                    </Grid>

                    {saveError && <Alert severity="error" sx={{ mt: 2 }}>{saveError}</Alert>}
                    {saveSuccess && <Alert severity="success" sx={{ mt: 2 }}>{saveSuccess}</Alert>}

                    <Box sx={{ display: 'flex', gap: 2 }}>
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
                </Paper>
            </Box>
        </Box>
    )
}

export default UserProfile;
