import * as dao from "./dao.js";
// let currentUser = null;
function UserRoutes(app) {
  const createUser = async (req, res) => {
    const user = await dao.createUser(req.body);
    res.json(user);
  };
  const deleteUser = async (req, res) => {
    const status = await dao.deleteUser(req.params.userId);
    res.json(status);
  };
  const findAllUsers = async (req, res) => {
    const users = await dao.findAllUsers();
    console.log(users);
    res.json(users);

  };

  const findAllUSERUsers = async (req, res) => {
    const users = await dao.findAllUSERUsers();
    res.json(users);
  };

  const findUserById = async (req, res) => {
    const user = await dao.findUserById(req.params.userId);
    res.json(user);
  };

  const findUserByUsername = async (req, res) => {
    const user = await dao.findUserByUsername(req.params.username);
    res.json(user);
  };
  
  const updateUserDetails = async (req, res) => {
    const { userId } = req.params;
    const status = await dao.updateUser(userId, req.body);
    const currentUser = await dao.findUserById(userId);
    req.session['currentUser'] = currentUser;
    res.json(status);
  };

  const updateUser = async (req, res) => {
    const { userId } = req.params;
    const status = await dao.updateUserLikes(userId, req.body);
    const currentUser = await dao.findUserById(userId);
    req.session['currentUser'] = currentUser;
    res.json(status);
  };
  const signup = async (req, res) => {
    const user = await dao.findUserByUsername(
      req.body.username);
    if (user) {
      res.status(400).json(
        { message: "Username already taken" });
    }
    const currentUser = await dao.createUser(req.body);
    req.session['currentUser'] = currentUser;
    res.json(currentUser);
  };
  const signin = async (req, res) => {
    const { username, password } = req.body;
    const currentUser = await dao.findUserByCredentials(username, password);
    req.session['currentUser'] = currentUser;
    res.json(currentUser);
  };

  const signout = (req, res) => {
    req.session.destroy();
    res.json(200);
  };
  
  const account = async (req, res) => {
    res.json(req.session['currentUser']);
  };


  const updateUserLikes = async (req, res) => {
    const { userId } = req.params;
    const { movieId } = req.body;
    const currentUser = await dao.findUserById(userId);
    currentUser.liked_movies.push(movieId);
    const status = await dao.updateUser(userId, currentUser);
    res.json(status);
  };

  const removeUserLikes = async (req, res) => {
    const { userId } = req.params;
    const { movieId } = req.body;
    const currentUser = await dao.findUserById(userId);
    currentUser.liked_movies.pop(movieId);
    const status = await dao.updateUser(userId, currentUser);
    res.json(status);
  };

  const addFollowing = async (req, res) => {
    const { usernameToFollow, currentUserName } = req.params;

    try {
      // Find the user being followed
      const userToFollow = await dao.findUserByUsername(usernameToFollow);

      if (!userToFollow) {
        return res.status(404).json({ error: "User to follow not found" });
      }

      // Find the current user
      const currentUser = await dao.findUserByUsername(currentUserName);

      if (!currentUser) {
        return res.status(404).json({ error: "Current user not found" });
      }

      // Check if the current user is already following the user
      if (!currentUser.following.includes(usernameToFollow)) {
        // Add the user being followed to the current user's following list
        currentUser.following.push(usernameToFollow);

        // Check if the user being followed is already a follower of the current user
        if (!userToFollow.followers.includes(currentUserName)) {
          // Add the current user to the followers list of the user being followed
          userToFollow.followers.push(currentUserName);
        } else {
          // Remove the reciprocal relationship if they already follow each other
          userToFollow.followers = userToFollow.followers.filter(follower => follower !== currentUserName);
          currentUser.following = currentUser.following.filter(following => following !== usernameToFollow);
        }

        // Update both users in the database
        const updateCurrentUserStatus = await dao.updateUserByUsername(currentUserName, currentUser);
        const updateUserToFollowStatus = await dao.updateUserByUsername(usernameToFollow, userToFollow);

        res.json({ updateCurrentUserStatus, updateUserToFollowStatus });
      } else {
        // User is already being followed
        res.status(400).json({ error: "User is already being followed" });
      }
    } catch (error) {
      console.error("Error following user:", error);
      res.status(500).json({ error: "Internal Server Error", details: error.message });
    }
  };

  app.put("/api/users/profile/addFollowing/:usernameToFollow/:currentUserName", addFollowing);

  const removeFollowing = async (req, res) => {
    const { usernameToRemove, currentUserName } = req.params;
  
    try {
      const currentUser = await dao.findUserByUsername(currentUserName);
  
      if (!currentUser) {
        return res.status(404).json({ error: "Current user not found" });
      }
  
      // Check if the current user is following the user to be removed
      const indexToRemove = currentUser.following.indexOf(usernameToRemove);
      
      if (indexToRemove !== -1) {
        currentUser.following.splice(indexToRemove, 1); // Remove the user from the following list
        const status = await dao.updateUserByUsername(currentUserName, currentUser);
  
        // Remove the current user from the followers list of the user being unfollowed
        const userToUnfollow = await dao.findUserByUsername(usernameToRemove);
        const indexToRemoveFollower = userToUnfollow.followers.indexOf(currentUserName);
        
        if (indexToRemoveFollower !== -1) {
          userToUnfollow.followers.splice(indexToRemoveFollower, 1);
          await dao.updateUserByUsername(usernameToRemove, userToUnfollow);
        }
  
        res.json(status);
      } else {
        res.status(400).json({ error: "User is not being followed" });
      }
    } catch (error) {
      console.error("Error removing following user:", error);
      res.status(500).json({ error: "Internal Server Error", details: error.message });
    }
  };
  
  app.put("/api/users/profile/removeFollowing/:usernameToRemove/:currentUserName", removeFollowing);

  app.post("/api/users", createUser);
  app.get("/api/users", findAllUsers);
  app.get("/api/USERusers", findAllUSERUsers);
  app.get("/api/users/:userId", findUserById);
  app.put("/api/users/:userId", updateUser);
  app.put("/api/users/likes/:userId", updateUserLikes);
  app.put("/api/users/likes/remove/:userId", removeUserLikes);
  app.delete("/api/users/:userId", deleteUser);
  app.post("/api/users/signup", signup);
  app.post("/api/users/signin", signin);
  app.post("/api/users/signout", signout);
  app.post("/api/users/account", account);

  app.get("/api/users/:userId", findUserById);
  app.get("/api/users/profile/:username", findUserByUsername)

  app.put("/api/users/profile/addFollowing/:usernameToFollow/:currentUserName", addFollowing);
  app.put("/api/users/profile/:userId", updateUserDetails);

}
export default UserRoutes;