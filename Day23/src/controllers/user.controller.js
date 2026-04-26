import userService from "../services/user.service.js";

const createUser = async (req, res) => {
  try {
    const user = await userService.createUser();

    res.json(user);
  } catch (error) {
    res.status(400).send(error.message);
  }
};

export default { createUser };
