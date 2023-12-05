import mongoose from "mongoose";
const movieSchema = new mongoose.Schema({
    id: { type: Number },
    likes: { type: Number },
    title: { type: String },
    year: { type: Number },
    runtime: { type: Number },
    likes: { type: Number },
    genres: {
        type: Array,
        items: [
          {
            type: String
          }
        ]
      },
    director: { type: String },
    actors: { type: String },
    plot: { type: String },
    posterUrl: { type: String },
    imdbID: { type: String},
}, { collection: "movies" });


export default movieSchema;