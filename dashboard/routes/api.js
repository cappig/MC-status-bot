const express = require("express");

const router = express.Router()

// API landing page - documentation
router.get('/', function(req, res) {
    res.send('Work in progress');
});

// API
router.get('/hello', function(req, res) {
    res.json({hello: "world"});
});

module.exports = router;