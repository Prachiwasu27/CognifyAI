const express = require("express");
const router = express.Router();
const { generateResponse } = require('./aiController');

router.post("/generate", generateResponse);

module.exports = router;

