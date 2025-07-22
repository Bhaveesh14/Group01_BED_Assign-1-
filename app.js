const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const path = require('path');
dotenv.config();


const { poolConnect } = require('./dbConfig');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(express.static(path.join(__dirname, 'public')));

const loginRoutes = require('./routes/loginRoutes');
const registerRoutes = require('./routes/registerRoutes');
const userRoutes = require('./routes/userRoutes');
const appointmentRoutes = require('./routes/appointmentRoutes');





const fitnessTrackerRoutes = require('./routes/fitnessTrackerRoutes');

poolConnect.then(() => {
    console.log('SQL Server database connection pool established successfully.');
}).catch(err => {
    console.error('SQL Server database connection pool failed:', err);
    process.exit(1);
});

app.use('/login', loginRoutes);
app.use('/register', registerRoutes);
app.use('/users', userRoutes);
app.use('/appointments', appointmentRoutes);

app.use('/api/fitness-tracker', fitnessTrackerRoutes);

app.use((req, res) => {
  res.status(404).json({ message: "Route not found" });
});

app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send('Something broke on the server!');
});


// Start server
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
  console.log(`Fitness Tracker API available at: http://localhost:${PORT}/api/fitness-tracker/:userId`);
});