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


  const updateUser = async (req, res) => {
    const { userId } = req.params;
    const status = await dao.updateUser(userId, req.body);
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

  const addFollowing = async (req, res) => {
    try {
      const { usernameToAdd, currentUser } = req.body;
      // const currentUser = res.json(req.session['currentUser']); // Retrieve current user from session
  
      if (!currentUser) {
        return res.status(401).json({ message: 'No current user' });
      }

  
      // Check if the user is not already in the following list
      // if (!currentUser.following.includes(usernameToAdd)) {
        currentUser.following.push(usernameToAdd);
        await currentUser.save();
      // }
      
      res.json(currentUser);
    } catch (error) {
      console.error('Error adding following:', error);
      res.status(500).json({ message: 'Internal Server Error' });
    }
  }


  app.post("/api/users", createUser);
  app.get("/api/users", findAllUsers);
  app.get("/api/USERusers", findAllUSERUsers);
  app.get("/api/users/:userId", findUserById);
  app.put("/api/users/:userId", updateUser);
  app.delete("/api/users/:userId", deleteUser);
  app.post("/api/users/signup", signup);
  app.post("/api/users/signin", signin);
  app.post("/api/users/signout", signout);
  app.post("/api/users/account", account);

  app.get("/api/users/:userId", findUserById);
  app.get("/api/users/profile/:username", findUserByUsername)

  app.post("/api/users/profile/addFollowing", addFollowing);
}
export default UserRoutes;