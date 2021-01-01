const express = require("express");
const router = express.Router();
const genreModel = require("../data/models/genreModel");

router.get("/", async (req, res) => {
  try {
    const genres = await genreModel.find();
    res.status(200).json(genres);
  } catch (error) {
    res
      .status(500)
      .json({ msg: "An error has occurred while fetching genres, sorry" });
  }
});

module.exports = router;
