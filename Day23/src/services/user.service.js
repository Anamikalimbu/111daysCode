import User from "../models/User.js";

const createUser = async () => {
  return await User.create({
    name: "Ram",
    email: "hari+5@gmail.com",
    password: "Aasdfasd123@",
    phone: 98765431245,
    address: {
      city: "Itahari",
    },
    roles: ["CUSTOMER", "MERCHANT"],
  });
};

export default { createUser };
