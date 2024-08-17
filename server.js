
// server.js
const express = require('express');
const cors = require('cors'); // Import cors for handling cross-origin requests
const mongoose = require('mongoose');
require('dotenv').config();

const tokenRoutes = require('./router/tokenRouter');
const walletRoutes = require('./router/walletRouter');
const authRoutes = require('./router/authRouter'); // Import auth routes

const app = express();
const port = process.env.PORT || 3000;

// Middleware
app.use(express.json()); // Parse JSON bodies
app.use(cors({
  origin: 'http://example.com', // Replace with your frontend origin
  methods: ['GET', 'POST','PUT','DELETE','PATCH'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

// Simple GET route
app.get('/', (req, res) => {
    res.send('Hello, world!');
});

// Routes
app.use('/api/token', tokenRoutes);
app.use('/api/wallet', walletRoutes);
app.use('/api/auth', authRoutes); // Use Auth Routes



// Start the server
mongoose.connect(process.env.MONGO_URI, {
}).then(() => {
    console.log('MongoDB connected');
    app.listen(port, () => {
        console.log(`Server is running on http://localhost:${port}`);
    });
}).catch(err => console.log(err));
