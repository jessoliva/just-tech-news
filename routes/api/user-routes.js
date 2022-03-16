// create five routes that will work with the User model to perform Create Read Update Delete operations

const router = require('express').Router();
const { User } = require('../../models');

// These endpoints for the server are going to be accessible at the /api/users URL

// GET /api/users
router.get('/', (req, res) => {});

// GET /api/users/1
router.get('/:id', (req, res) => {});

// POST /api/users
router.post('/', (req, res) => {});

// PUT /api/users/1
router.put('/:id', (req, res) => {});

// DELETE /api/users/1
router.delete('/:id', (req, res) => {});

module.exports = router;