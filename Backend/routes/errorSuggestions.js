// routes/errorSuggestions.js

const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');

// Define the Suggestion Schema
const suggestionSchema = new mongoose.Schema({
    errorType: { type: String, required: true },
    category: { type: String, required: true },
    supportiveLink: { type: String, required: true },
});

const Suggestion = mongoose.model('Suggestion', suggestionSchema);

// Route to add a suggestion
router.post('/', async (req, res) => {
    const { errorType, category, supportiveLink } = req.body;

    // Validate request body
    if (!errorType || !category || !supportiveLink) {
        return res.status(400).json({ message: "All fields are required" });
    }

    try {
        const newSuggestion = new Suggestion({ errorType, category, supportiveLink });
        await newSuggestion.save();
        res.status(201).json(newSuggestion);
    } catch (error) {
        res.status(500).json({ message: "Error saving suggestion", error });
    }
});

// Route to get suggestions by error type
router.get('/:errorType', async (req, res) => {
    const { errorType } = req.params;

    try {
        const suggestions = await Suggestion.find({ errorType });
        res.status(200).json(suggestions);
    } catch (error) {
        res.status(500).json({ message: "Error fetching suggestions", error });
    }
});

// Route to get suggestions by error type and category
router.get('/:errorType/:category', async (req, res) => {
    const { errorType, category } = req.params;

    try {
        // Find suggestion by both errorType and category
        const suggestion = await Suggestion.findOne({ errorType, category });

        if (!suggestion) {
            return res.status(404).json({ message: "No suggestion found for the given error type and category" });
        }

        // Return the supportive link for the found suggestion
        res.status(200).json({ supportiveLink: suggestion.supportiveLink });
    } catch (error) {
        res.status(500).json({ message: "Error fetching suggestion", error });
    }
});

//fetch all suggestions
router.get('/', async (req, res) => {
    try {
        const suggestions = await Suggestion.find();
        res.status(200).json(suggestions);
    } catch (error) {
        res.status(500).json({ message: "Error fetching suggestions", error });
    }
});

// Route to update a suggestion by ID
router.put('/:id', async (req, res) => {
    const { id } = req.params;
    const { errorType, category, supportiveLink } = req.body;

    // Validate request body
    if (!errorType || !category || !supportiveLink) {
        return res.status(400).json({ message: "All fields are required" });
    }

    try {
        const updatedSuggestion = await Suggestion.findByIdAndUpdate(id, { errorType, category, supportiveLink }, { new: true });
        if (!updatedSuggestion) {
            return res.status(404).json({ message: "Suggestion not found" });
        }
        res.status(200).json(updatedSuggestion);
    } catch (error) {
        res.status(500).json({ message: "Error updating suggestion", error });
    }
});

// Route to delete a suggestion by ID
router.delete('/:id', async (req, res) => {
    const { id } = req.params;

    try {
        const deletedSuggestion = await Suggestion.findByIdAndDelete(id);
        if (!deletedSuggestion) {
            return res.status(404).json({ message: "Suggestion not found" });
        }
        res.status(200).json({ message: "Suggestion deleted successfully" });
    } catch (error) {
        res.status(500).json({ message: "Error deleting suggestion", error });
    }
});

module.exports = router;
