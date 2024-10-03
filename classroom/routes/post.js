const express = require("express");
const app = express();
const router = express.Router();

router.get("/", (req, res) => {
    res.send("post route running");
});

router.get("/:id/", (req, res) => {
    res.send("post new route");
});

router.post("/", (req, res) => {
    res.send("post post route");
});

router.delete("/:id", (req, res) => {
    res.send("post delete route");
});

module.exports = router;