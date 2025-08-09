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
    Paper,
} from '@mui/material';

const socket = io('http://localhost:5000');


const Chat = () => {
    const [users, setUsers] = useState([]);
    const [currentUser, setCurrentUser] = useState(null);
    const [selectedUser, setSelectedUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [messages, setMessages] = useState([]);
    const [text, setText] = useState('');
    const messagesEndRef = useRef(null);

    useEffect(() => {
        const fetchUsers = async () => {
            const token = localStorage.getItem('accessToken');
            try {
                const res = await axios.get('http://localhost:5000/api/auth/all', {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                    withCredentials: true,
                });
                setUsers(res.data);
            } catch (error) {
                console.error("Errore nel recupero ordini:", error);
            }
        };

        const fetchCurrentUser = async () => {
            const token = localStorage.getItem('accessToken');
            if (!token) return console.error("No token found");
            try {
                const res = await axios.get('http://localhost:5000/api/auth/me', {
                    headers: {
                        'Content-Type': 'application/json',
                        Authorization: `Bearer ${token}`,
                    },
                    withCredentials: true,
                });
                setCurrentUser(res.data);
            } catch (err) {
                console.error('Errore nel recupero dati utente:', err);
            }
        };

        fetchUsers();
        fetchCurrentUser();
    }, [])

    useEffect(() => {
        if (!currentUser?._id) return;
        socket.emit('login', currentUser._id);

        socket.on('receiveMessage', (message) => {
            if (
                message.from === currentUser._id ||
                message.to === currentUser._id
        ) {
            setMessages((prev) => [...prev, message]);
            }
        });

        return () => {
            socket.off('receiveMessage');
        };
    }, [currentUser]);

    useEffect(() => {
        if (messagesEndRef.current) {
            messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
        }
    }, [messages]);

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

    return (
        <Box display="flex" p={2} gap={2}>
            <Paper>
                <Typography variant="h6" p={2}>
                    Utenti
                </Typography>
                <List>
                    {users
                        .filter((u) => u._id !==currentUser._id)
                        .map((user) => (
                            <ListItem
                            button
                            key={user._id}
                            selected={selectedUser?._id === user._id}
                            onClick={() => setSelectedUser(user)}
                            >
                                <ListItemText primary={user.username} />
                            </ListItem>
                        ))
                    }
                </List>
            </Paper>

            <Paper sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column' }}>
                <Box p={2} borderBottom="1px solid #ccc">
                    <Typography variant="h6">
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
                                        msg.from === currentUser.id ? 'flex-end' : 'flex-start',
                                    mb: 1,
                                }}
                            >
                                <Paper
                                    sx={{
                                        p: 1,
                                        maxWidth: '70%',
                                        bgcolor: msg.from === currentUser.id ? 'primary.main' : 'grey.300',
                                        color: msg.from === currentUser.id ? 'primary.contrastText' : 'black',
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
                    <Button variant="contained" type="submit" disabled={!selectedUser || !text.trim()}>
                        Invia
                    </Button>
                </Box>
            </Paper>
        </Box>
    )
}

export default Chat;