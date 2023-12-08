import model from "./model.js";
export const createMovie = (movie) => model.create(movie);
export const findAllMovies = () => model.find();
export const findMovieById = (movieId) => model.findById(movieId);
export const fetchMovieByIMDB = (id) => model.findOne({ imdbID: id });
export const findMovieByTitle = (t) =>
  model.findOne({ title: t });
export const updateMovie = (movieId, movie) =>
  model.updateOne({ _id: movieId }, { $set: movie });
// export const incrementLikes = (id) => {
//   model.findOneAndUpdate({ imdbID: id }, { $inc: { likes: 1 } })
// };
export const deleteMovie = (movieId) => model.deleteOne({ _id: movieId });