import mongoose from "mongoose";
import movieSchema from "./schema.js";
const model = mongoose.model("movies", movieSchema);
export default model;