import mongoose from "mongoose";
import movieSchema from "./schema";
const model = mongoose.model("movies", movieSchema);
export default model;