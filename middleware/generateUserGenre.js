const Genres = require("../data/models/genreModel");

const generateUserGenreRelationship = async (req, res, next) => {
  try {
    // User will also input 3 favorite genres
    const genres = req.validUser.genres;
    // Create this relationship between the user and the genres selected in the database

    const newDatabaseItems = genres.map(
      async genre => await Genres.findByName(genre)
    );

    const resolvingItems = (async () => {
      let results = await Promise.all(newDatabaseItems);
      return results;
    })();

    const resolvedItems = await resolvingItems;

    const genreIDs = resolvedItems.map(item => item.tmdbId);

    // Generate User - Genre Relationship
    genreIDs.forEach(async genre => Genres.addUserGenre(res.newUser.id, genre));

    // Add one to total user count of each genre
    const updatedGenreData = genreIDs.map(
      async genre => await Genres.addOne(genre)
    );

    const resolvingAddOne = (async () => {
      const results = await Promise.all(updatedGenreData);
      return results;
    })();

    const resolvedIncrementedGenres = await resolvingAddOne;

    const userData = {
      email: res.newUser.email,
      id: res.newUser.id,
      genres: resolvedIncrementedGenres,
    };

    // Return user and saved genres
    res.status(200).json(userData);
  } catch (error) {
    console.error(error);
    res.status(500).json({
      msg: "Something went wrong on our end, sorry for the inconvenience",
    });
  }
};

module.exports = { generateUserGenreRelationship };
