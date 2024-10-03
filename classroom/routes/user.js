
const express = require("express");
const router = express.Router();

router.get("/", (req, res) => {
    res.send("users route running");
});

router.get("/:id", (req, res) => {
    res.send("users new route");
});

router.post("/", (req, res) => {
    res.send("users post route");
});

router.delete("/:id", (req, res) => {
    res.send("users delete route");
});

module.exports = router;