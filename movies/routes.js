import * as dao from "./dao.js";

function MovieRoutes(app) {
  const createMovie = async (req, res) => {
    const movie = await dao.createMovie(req.body);
    res.json(movie);
  };
  const deleteMovie = async (req, res) => {
    const status = await dao.deleteMovie(req.params.movieId);
    res.json(status);
  };
  const findAllMovies = async (req, res) => {
    const movies = await dao.findAllMovies();
    res.json(movies);
  };
  const findMovieById = async (req, res) => {
    const movie = await dao.findMovieById(req.params.movieId);
    res.json(movie);
  };

  const findMovieByTitle = async (req, res) => {
    const movie = await dao.findMovieByTitle(req.params.movieTitle);
    res.json(movie);
  };
  const fetchMovieByIMDBLocal = async (req, res) => {
    const movie = await dao.fetchMovieByIMDBLocal(req.params.movieIMDB);
    res.json(movie);
  };

  const updateMovie = async (req, res) => {
    const { movieId } = req.params;
    const status = await dao.updateMovie(movieId, req.body);
    const currentMovie = await dao.findMovieById(movieId);
    req.session['currentMovie'] = currentMovie;
    res.json(status);
  };
  // const updateLikes = async (req, res) => {
  //   const { movieId } = req.params;
  //   const status = await dao.updateMovie(movieId, req.body);
  //   const currentMovie = await dao.incrementLikes(movieId);
  //   req.session['currentMovie'] = currentMovie;
  //   res.json(status);
  // };


  app.post("/api/movies", createMovie);
  app.get("/api/movies", findAllMovies);
  app.get("/api/movies/:movieId", findMovieById);
  app.get("/api/movies/title/:movieTitle", findMovieByTitle);
  app.get("/api/movies/id/:movieIMDB", fetchMovieByIMDBLocal);
  app.put("/api/movies/:movieId", updateMovie);
  app.delete("/api/movies/:movieId", deleteMovie);
}
export default MovieRoutes;