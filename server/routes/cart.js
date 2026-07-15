/**
 * Cart Routes
 * Cart is now managed client-side in localStorage for guest checkout
 * No backend cart management needed
 */

const express = require("express");
const router = express.Router();

// Cart is handled entirely on the client-side with localStorage
// This route file is kept for backwards compatibility but has no endpoints

module.exports = router;

