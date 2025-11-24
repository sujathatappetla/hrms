import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import db from "../models/index.js";
import dotenv from "dotenv";
dotenv.config();

const { Organisation, User, Log } = db;

export const register = async (req, res) => {
  try {
    const { orgName, adminName, email, password } = req.body;
    if (!orgName || !adminName || !email || !password) {
      return res.status(400).json({ error: "All fields required" });
    }
    if (password.length < 5) {
      return res.status(400).json({ error: "Password is too short" });
    }

    // check if email already exists
    const existing = await User.findOne({ where: { email } });
    if (existing) return res.status(400).json({ error: "User already exists" });

    // create organisation
    const organisation = await Organisation.create({ name: orgName });

    // create user
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await User.create({
      organisation_id: organisation.id,
      email,
      name: adminName,
      password_hash: hashedPassword,
    });

    // log creation
    await Log.create({
      organisation_id: organisation.id,
      user_id: user.id,
      action: `User '${user.id}' created organisation ${organisation.id}`,
      meta: {},
    });

    // optional: generate token immediately
    const token = jwt.sign(
      { userId: user.id, orgId: organisation.id },
      process.env.JWT_SECRET,
      { expiresIn: "8h" }
    );

    return res.status(201).json({ message: "Registered successfully", token });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "Server error" });
  }
};

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) return res.status(400).json({ error: "Email and password required" });

    const user = await User.findOne({ where: { email } });
    if (!user) return res.status(401).json({ error: "Invalid email or password" });

    const isMatch = await bcrypt.compare(password, user.password_hash);
    if (!isMatch) return res.status(401).json({ error: "Invalid email or password" });

    // generate token
    const token = jwt.sign(
      { userId: user.id, orgId: user.organisation_id },
      process.env.JWT_SECRET,
      { expiresIn: "8h" }
    );

    await Log.create({
      organisation_id: user.organisation_id,
      user_id: user.id,
      action: `User '${user.id}' logged in`,
      meta: {},
    });

    return res.json({ message: "Login successful", token });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "Server error" });
  }
};
