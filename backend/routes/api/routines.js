const express = require('express');
const router = express.Router();

/* GET routines listing. */
router.get('/', function (req, res, next) {
    res.json({
        message: "GET /api/routines"
    });
});

module.exports = router;