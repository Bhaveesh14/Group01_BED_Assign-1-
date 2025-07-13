const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const userRoutes = require('./routes/userRoutes');
const db = require('./db'); // Ensures DB connection is tested on startup

const app = express();
const PORT = 3000;

// Middleware
app.use(cors());
app.use(bodyParser.json());

// Routes
app.use('/api', userRoutes);

// Health check route (optional)
app.get('/', (req, res) => {
  res.send('✅ API is running. Welcome to the Settings App!');
});

// Global Error Handler (optional)
app.use((err, req, res, next) => {
  console.error('🔥 Uncaught error:', err.stack);
  res.status(500).json({ message: 'Server Error', error: err.message });
});

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Server running at http://localhost:${PORT}`);
});
