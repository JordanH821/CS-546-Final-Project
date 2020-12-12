const express = require("express");
const router = express.Router();

router.get("/archive", (req, res) => {
  res.render("archive/home");
});
