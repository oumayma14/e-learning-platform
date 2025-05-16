const express = require('express');
const pool = require('../config/db');
const router = express.Router();

// Formateur requests verification
router.post('/request', async (req, res) => {
    try {
        const { formateur_id } = req.body;
        if (!formateur_id) {
            return res.status(400).json({ message: 'Formateur ID is required.' });
        }

        // Check if a pending request already exists
        const existingRequest = await pool.query(
            'SELECT * FROM formateurverificationrequests WHERE formateur_id = ? AND status = "en attente"',
            [formateur_id]
        );

        if (existingRequest.length > 0) {
            return res.status(400).json({ message: 'You already have a pending verification request.' });
        }

        // Create a new verification request
        const result = await pool.query(
            'INSERT INTO formateurverificationrequests (formateur_id, status, created_at, updated_at) VALUES (?, "en attente", NOW(), NOW())',
            [formateur_id]
        );

        res.status(201).json({
            message: 'Verification request submitted successfully.',
            requestId: result.insertId,
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'An error occurred while submitting the request.' });
    }
});

// Admin views all verification requests
router.get('/requests', async (req, res) => {
    try {
        const requests = await pool.query('SELECT * FROM formateurverificationrequests ORDER BY created_at DESC');
        res.status(200).json(requests);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'An error occurred while fetching requests.' });
    }
});

// Admin accepts or declines a verification request
router.put('/decision/:id', async (req, res) => {
    try {
        const requestId = req.params.id;
        const { status, decision_reason } = req.body;

        if (!['accepté', 'refusé'].includes(status)) {
            return res.status(400).json({ message: 'Invalid status. Use "accepté" or "refusé".' });
        }

        // Update the verification request
        const result = await pool.query(
            'UPDATE formateurverificationrequests SET status = ?, updated_at = NOW() WHERE id = ?',
            [status, requestId]
        );

        if (result.affectedRows === 0) {
            return res.status(404).json({ message: 'Request not found.' });
        }

        res.status(200).json({
            message: `Request ${status} successfully.`,
            requestId,
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'An error occurred while updating the request.' });
    }
});

// Check verification status
router.get('/status/:formateur_id', async (req, res) => {
    try {
        const formateurId = req.params.formateur_id;

        // Fetch the latest verification status
        const result = await pool.query(
            'SELECT status FROM formateurverificationrequests WHERE formateur_id = ? ORDER BY created_at DESC LIMIT 1',
            [formateurId]
        );

        if (result.length === 0) {
            return res.status(200).json({ status: 'non vérifié' });
        }

        res.status(200).json({ status: result[0].status });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'An error occurred while checking the verification status.' });
    }
});


module.exports = router;
