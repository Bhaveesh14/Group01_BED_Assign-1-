const { addNote, getNote, getAutoNoteFields } = require("../models/medicationNoteModels"); // fixed file name

async function createNote(req, res) {
    const { medicationId, note_text } = req.body;

    // Use the correct variable name
    if (!medicationId || !note_text) {
        return res.status(400).json({ message: "Missing required fields" });
    }

    const result = await addNote(medicationId, note_text); // pass medicationId

    if (result.success) {
        return res.status(201).json({ message: "Successfully added notes" });
    } else {
        return res.status(500).json({ message: result.message });
    }
}

async function retrieveNote(req, res) {
    const { medicationId } = req.query;

    if (!medicationId) {
        return res.status(400).json({ message: "Missing medicationId in query" });
    }

    try {
        const notes = await getNote(medicationId);
        res.status(200).json(notes);
    } catch (err) {
        console.error("Error fetching notes:", err);
        res.status(500).json({ message: "Server error" });
    }
}

async function getAutoNoteFieldsController(req, res) {
    const id = parseInt(req.params.id);

    if (!id) {
        return res.status(400).json({ message: "Missing medicationId in query" });
    }

    try {
        const rows = await getAutoNoteFields(id);

        if (!rows || rows.length === 0) {
            return res.status(404).json({ message: "No medication found or fields are null" });
        }

        const med = rows[0];
        const notes = [
            `Repeat Times: ${med.repeat_times}`,
            `Start Hour: ${med.start_hour}`,
            `End Hour: ${med.end_hour}`,
            `Repeat Duration: ${med.repeat_duration}`,
            `Frequency Type: ${med.frequency_type}`,
            `Repeat Pattern: ${med.repeat_pattern}`
        ];

        res.status(200).json(notes);
    } catch (err) {
        console.error("Error fetching notes from medication columns: ", err);
        res.status(500).json({ message: "Server error" });
    }
}



module.exports = {
    createNote,
    retrieveNote,
    getAutoNoteFieldsController
};