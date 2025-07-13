const express = require('express');
<<<<<<< HEAD
const cors = require('cors'); 
const sql = require('mssql');
const dotenv = require('dotenv');

dotenv.config();

const {
    getFilteredMedications,
    getMedicationById,
    getAllMedicationByDate,
    deleteMedicationById,
    addMedication,
    updateMedicationController
} = require('./controllers/medicationController');

const notificationController = require("./controllers/medicationNoteController");

const app = express();
const port = process.env.PORT || 3000;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());

// Medication routes
app.get('/medications', getFilteredMedications);
app.get('/medications/by-date', getAllMedicationByDate);
app.get('/medications/:id', getMedicationById);
app.delete('/medications/:id', deleteMedicationById);
app.post('/medications', addMedication);
app.put('/medications/:id', updateMedicationController);

// Medication notes routes
app.post('/medication-notes', notificationController.createNote);
app.get('/medication-notes', notificationController.retrieveNote);
app.get('/medications/:id/notes/auto', notificationController.getAutoNoteFieldsController);


app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});


// Graceful shutdown
process.on("SIGINT", async () => {
  console.log("Server is gracefully shutting down");
  await sql.close();
  console.log("Database connections closed");
  process.exit(0);
=======
const dotenv = require('dotenv');
const cors = require('cors');
const path = require('path');
dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve static files from 'public' folder
app.use(express.static(path.join(__dirname, 'public')));

const loginRoutes = require('./routes/loginRoutes');
const registerRoutes = require('./routes/registerRoutes');
const userRoutes = require('./routes/userRoutes');

app.use('/login', loginRoutes);
app.use('/register', registerRoutes);
app.use('/users', userRoutes);

// 404 handler
app.use((req, res) => {
  res.status(404).json({ message: "Route not found" });
});

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
>>>>>>> 8b947f8b363da71e62304d21507ab4bf683d8882
});
