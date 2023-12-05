import mongoose from "mongoose";
const userSchema = new mongoose.Schema({
    username: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    liked_movies: {
      type: Array,
      items: [
        {
          type: Number
        }
      ]
    },
    rewatched_movies: {
      type: Array,
      items: [
        {
          type: Object,
          properties: {
            id: {
              type: Number
            },
            watches: {
              type: Number
            }
          }
        }
      ]
    },
    firstName: String,
    email: String,
    lastName: String,
    dob: Date,
    role: {
      type: String,
      enum: ["ADMIN", "USER"],
      default: "USER" },
  },
  { collection: "users" });
export default userSchema;