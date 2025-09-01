//import dei componenti necessari
import React, { useEffect, useState, useRef } from 'react';
import io from 'socket.io-client';
import axios from "axios";
import {
    Box,
    List,
    ListItem,
    ListItemText,
    Typography,
    TextField,
    Button,
    Paper
} from '@mui/material';
import {BACKEND_URL} from "../config/config";

import Bar from "./Bar";

const socket = io(`${BACKEND_URL}`);


const Chat = () => {
    const [users, setUsers] = useState([]);
    const [currentUser, setCurrentUser] = useState(null);
    const [selectedUser, setSelectedUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [messages, setMessages] = useState([]);
    const [text, setText] = useState('');
    const messagesEndRef = useRef(null);

    useEffect(() => {
        //chiamata http con Axios con autenticazione per recuperare la lista di tutti gli utenti
        const fetchUsers = async () => {
            const token = localStorage.getItem('accessToken');
            try {
                const res = await axios.get(`${BACKEND_URL}/api/auth/all`, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                    withCredentials: true,
                });
                setUsers(res.data);

            } catch (error) {
                console.error("Errore nel recupero dati di tutti gli utenti:", error);
            }
        };

        //chiamata http con Axios con autenticazione per recuperare l'utente attualmente loggato
        const fetchCurrentUser = async () => {
            const token = localStorage.getItem('accessToken');
            try {
                const res = await axios.get(`${BACKEND_URL}/api/auth/me`, {
                    headers: {
                        'Content-Type': 'application/json',
                        Authorization: `Bearer ${token}`,
                    },
                    withCredentials: true,
                });
                setCurrentUser(res.data);

                setLoading(false);
            } catch (error) {
                console.error("Errore nel recupero dati utente corrente:", error);
                setLoading(false);
            }
        }

        fetchUsers();
        fetchCurrentUser();
    }, [])

    useEffect(() => {
        //uso di socket.io per gestire lo scambio di messaggi real time usando event emit
        if (!currentUser?._id) return;
        socket.emit('login', currentUser._id);

        socket.on('receiveMessage', (message) => {
            if (
                message.from === currentUser._id ||
                message.to === currentUser._id
            ) {
                if (message.from !== currentUser._id && Notification.permission === "granted") {

                    const sender = users.find(u => u._id === message.from);
                    const senderName = sender ? sender.username : "Sconosciuto";

                    //uso notifcìiche
                    new Notification("Nuovo messaggio", {
                        body: `${senderName}`
                    });
                }
                setMessages((prev) => [...prev, message]);
            }
        });

        return () => {
            socket.off('receiveMessage');
        };
    }, [users, currentUser]);

    //funzione gestore lo scroll dei messaggi arrivati
    useEffect(() => {
        if (messagesEndRef.current) {
            messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
        }
    }, [messages]);

    useEffect(() => {
        //richiesta permessi per le notifiche
        if ("Notification" in window && Notification.permission !== "granted") {
            Notification.requestPermission();
        }
    }, []);

    //funzione per inviare i messaggi usando event emit
    const handleSend = () => {
        if (selectedUser && text.trim()) {
            socket.emit('sendMessage', {
                from: currentUser._id,
                to: selectedUser._id,
                text,
            });
            setText('');
        }
    };

    if (loading) {
        return <Typography>Caricamento...</Typography>;
    }

    //componente per inviare e ricevere messaggi
    return (
        <Box>
            <Bar />
            <Box display="flex" p={2} gap={2}>
                <Paper>
                    <Typography variant="h6" p={2}>
                        <strong>Utenti</strong>
                    </Typography>
                    {/* lista utenti */}
                    <List>
                        {users
                            .filter((u) => u._id !==currentUser._id)
                            .map((user) => (
                                <ListItem
                                    button
                                    key={user._id}
                                    selected={selectedUser?._id === user._id}
                                    onClick={() => setSelectedUser(user)}
                                    sx={{ cursor: "pointer", "&:hover .MuiListItemText-primary": {
                                            textDecoration: "underline",
                                        }, }}
                                >
                                    <ListItemText primary={user.username} />
                                </ListItem>
                            ))
                        }
                    </List>
                </Paper>

                {/* mostra chat con l'utente desiderato */}
                <Paper sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column' }}>
                    <Box p={2} borderBottom="1px solid #ccc">
                        <Typography variant="h6" sx={{fontWeight:"bold"}}>
                            Chat con {selectedUser ? selectedUser.username : '...'}
                        </Typography>
                    </Box>

                    <Box
                        sx={{
                            flexGrow: 1,
                            p: 2,
                            overflowY: 'auto',
                            backgroundColor: '#f5f5f5',
                        }}
                    >
                        {messages
                            .filter(
                                (msg) =>
                                    (msg.from === currentUser._id && msg.to === selectedUser?._id) ||
                                    (msg.to === currentUser._id && msg.from === selectedUser?._id)
                            )
                            .map((msg, i) => (
                                <Box
                                    key={i}
                                    sx={{
                                        display: 'flex',
                                        justifyContent:
                                            msg.from === currentUser._id ? 'flex-end' : 'flex-start',
                                        mb: 1,
                                    }}
                                >
                                    <Paper
                                        sx={{
                                            p: 1,
                                            maxWidth: '70%',
                                            bgcolor: msg.from === currentUser._id ? 'primary.main' : 'grey.300',
                                            color: msg.from === currentUser._id ? 'primary.contrastText' : 'black',
                                        }}
                                    >
                                        <Typography variant="body2">{msg.text}</Typography>
                                    </Paper>
                                </Box>
                            ))}
                        <div ref={messagesEndRef} />
                    </Box>

                    <Box
                        p={2}
                        display="flex"
                        gap={1}
                        component="form"
                        onSubmit={(e) => {
                            e.preventDefault();
                            handleSend();
                        }}
                    >
                        <TextField
                            fullWidth
                            variant="outlined"
                            placeholder="Scrivi un messaggio..."
                            value={text}
                            onChange={(e) => setText(e.target.value)}
                            disabled={!selectedUser}
                        />
                        <Button variant="contained" type="submit" disabled={!selectedUser || !text.trim()}
                                sx={{bgcolor:"primary.main", color:"white", fontSize:"15px",
                                    "&:hover": {
                                        bgcolor: "primary.main",
                                        boxShadow: "inset 0px 4px 8px rgba(0,0,0,0.4)"
                                    },}}>
                            Invia
                        </Button>
                    </Box>
                </Paper>
            </Box>
        </Box>
    )
}

export default Chat;