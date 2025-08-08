require('dotenv').config(); // Carica le variabili d'ambiente dal file .env nella root folder del progetto
const express = require('express');
const mongoose = require('mongoose');
const cookieParser = require('cookie-parser');
const http = require('http');
const cors = require('cors');

//routers
const authRoutes = require('./routes/authRoutes');
const orderRoutes = require('./routes/orderRoutes');
const deliveryRoutes = require('./routes/deliveryRoutes');
const locationRoutes = require('./routes/locationRoutes')


const app = express(); // creazione dell'app con il framework express
const server = http.createServer(app);

const PORT = process.env.PORT || 5000;

//middleware definiti in ordine di esecuzione
app.use(cors({
    origin: 'http://localhost:3000',
    credentials: true
}));

app.use(express.json())
app.use(express.urlencoded({extended: true}));
app.use(cookieParser());

//routes API
app.use('/api/auth', authRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/deliveries', deliveryRoutes);
app.use('/api/locations', locationRoutes);

// Route di base per test
app.get('/',(req, res) => {
    res.send('Benvenuto nel backend di StockPilot')
});

// Semplice gestore di errori globale
app.use((err, req, res, next) => {
    console.error("Errore nella richiesta:");
    res.status(500).send('Qualcosa è andato storto!');
});

//collegamento del database MongoDB
mongoose.connect(process.env.DB_CONNECTION_STRING)
const db = mongoose.connection

//apertura connessione con il database e avvio del server
db.once('open', () => server.listen(PORT, () => console.log(`App connessa a DB e in ascolto sulla porta ${PORT}`)))