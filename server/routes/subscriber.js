const express = require("express");
const router = express.Router();
const { subscribe, unsubscribe } = require("../controllers/subscriberController");

router.post("/", subscribe);
router.delete("/:email", unsubscribe);

module.exports = router;
