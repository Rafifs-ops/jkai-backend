require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 8080;

// Middleware
app.use(cors());
app.use(express.json()); // Parsing body JSON

// Database Connection
mongoose.connect(process.env.MONGO_URI)
    .then(() => console.log('✅ MongoDB Connected'))
    .catch(err => console.error('❌ MongoDB Connection Error:', err));

// Import Routes
const authRoutes = require('./routes/auth');
const aiRoutes = require('./routes/ai');
const contentRoutes = require('./routes/content');
const tripRoutes = require('./routes/trip');
const passRoutes = require('./routes/pass');

// Use Routes
app.use('/api/auth', authRoutes);
app.use('/api/ai', aiRoutes);
app.use('/api/content', contentRoutes);
app.use('/api/trip', tripRoutes);
app.use('/api/pass', passRoutes);

// Routes Placeholder
app.get('/', (req, res) => {
    res.send('Journey with KAI API is Running...');
});

app.listen(PORT, () => {
    console.log(`🚀 Server running on port ${PORT}`);
});