const express = require("express");
const router = express.Router();

router.get("/", (req, res, next) => {
  res.json("No methods here, you need to specify the exact route.");
});

module.exports = router;
