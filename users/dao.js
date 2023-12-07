import model from "./model.js";
export const createUser = (user) => model.create(user);
export const findAllUsers = () => model.find();
export const findAllUSERUsers = () => model.find({ role: "USER" });
export const findUserById = (userId) => model.findById(userId);
export const findUserByUsername = (usr) =>
  model.findOne({username: usr });
export const findUserByCredentials = (username, password) =>
  model.findOne({ username, password });
export const updateUser = (userId, user) =>
  model.updateOne({ _id: userId }, { $set: user });
export const deleteUser = (userId) => model.deleteOne({ _id: userId });
// export const findUserByCredentials = (usr, pass) => model.findOne({ username: usr, password: pass });