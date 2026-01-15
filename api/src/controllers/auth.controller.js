import bcrypt from "bcrypt";
import User from "../models/User.js";

export const register = async (req, res) => {
  const { username, password } = req.body;
  const exists = await User.findOne({ where: { username } });
  if (exists) return res.status(400).json({ message: "User exists" });

  const hashed = await bcrypt.hash(password, 10);
  await User.create({ username, password: hashed });
  res.json({ message: "User registered" });
};

export const login = async (req, res) => {
  const { username, password } = req.body;
  const user = await User.findOne({ where: { username } });
  if (!user) return res.status(400).json({ message: "Invalid credentials" });

  const match = await bcrypt.compare(password, user.password);
  if (!match) return res.status(400).json({ message: "Invalid credentials" });

  req.session.userId = user.id;
  res.json({ message: "Login successful" });
};

export const logout = (req, res) => {
  req.session.destroy(() => {
    res.json({ message: "Logged out" });
  });
};
