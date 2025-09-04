import dotenv from "dotenv";
dotenv.config();

import mongoose from "mongoose";
import express from "express";
import bodyParser from "body-parser";
import cors from "cors";
import tempHoldings from "../init/tempHoldings.js";
import tempPositions from "../init/tempPositions.js";
import PositionsModel from "../model/PositionsModel.js";
import HoldingsModel from "../model/HoldingsModel.js";
import OrdersModel from "../model/OrdersModel.js";
import UserModel from "../model/UserModel.js";

const app = express();
app.use(bodyParser.json());
app.use(cors());

const PORT = process.env.PORT || 8000;
const URI = process.env.MONGO_URL || "mongodb://127.0.0.1:27017/zerodha";

// ✅ Test route
app.get("/", (req, res) => {
  res.json({ message: "Zerodha Backend Server is running!" });
});

// ✅ Holdings API
app.get("/allHoldings", async (req, res) => {
  try {
    let allHoldings = await HoldingsModel.find({});
    res.json(allHoldings);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch holdings" });
  }
});

// ✅ Positions API
app.get("/allPositions", async (req, res) => {
  try {
    let allPositions = await PositionsModel.find({});
    res.json(allPositions);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch positions" });
  }
});

// ✅ Place New Order
app.post("/newOrder", async (req, res) => {
  try {
    const { name, qty, price, mode } = req.body;
    if (!name || !qty || !price || !mode) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    let newOrder = new OrdersModel({ name, qty, price, mode });
    await newOrder.save();

    res.json({ message: "Order Placed Successfully", order: newOrder });
  } catch (error) {
    res.status(500).json({ error: "Failed to create order" });
  }
});

// ✅ User Signup
app.post("/signup", async (req, res) => {
  try {
    const { firstName, lastName, email, phone, dateOfBirth, password } = req.body;

    const existingUser = await UserModel.findOne({
      $or: [{ email: email.toLowerCase() }, { phone }]
    });

    if (existingUser) {
      if (existingUser.email === email.toLowerCase()) {
        return res.status(400).json({ error: "Email already registered" });
      }
      if (existingUser.phone === phone) {
        return res.status(400).json({ error: "Phone already registered" });
      }
    }

    const newUser = new UserModel({ firstName, lastName, email, phone, dateOfBirth, password });
    await newUser.save();

    res.status(201).json({
      success: true,
      message: "Account created successfully!",
      user: newUser.getProfile()
    });

  } catch (error) {
    if (error.name === "ValidationError") {
      return res.status(400).json({ error: Object.values(error.errors).map(e => e.message).join(", ") });
    }
    if (error.code === 11000) {
      return res.status(400).json({ error: "Duplicate entry found" });
    }
    res.status(500).json({ error: "Failed to create account" });
  }
});

// ✅ User Signin
app.post("/signin", async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: "Email and password are required" });
    }

    const user = await UserModel.findOne({ email: email.toLowerCase() });

    if (!user) {
      return res.status(401).json({ error: "Invalid email or password" });
    }

    const isPasswordValid = await user.comparePassword(password);

    if (!isPasswordValid) {
      return res.status(401).json({ error: "Invalid email or password" });
    }

    res.json({
      success: true,
      message: "Login successful!",
      user: user.getProfile()
    });

  } catch (error) {
    console.error("Signin error:", error);
    res.status(500).json({ error: "Login failed. Please try again." });
  }
});

// ✅ Get User Profile
app.get("/user/:userId", async (req, res) => {
  try {
    const user = await UserModel.findById(req.params.userId).select("-password");
    if (!user) return res.status(404).json({ error: "User not found" });
    res.json({ user });
  } catch {
    res.status(500).json({ error: "Failed to fetch user profile" });
  }
});

// ✅ Connect to MongoDB
<<<<<<< HEAD
mongoose.connect(URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
=======
mongoose.connect(URI,{
  useNewUrlParser: true,
   useUnifiedTopology: true
>>>>>>> a07837f848217860f3e7dcba58bfcb9a20b5fd98
})
  .then(() => {
    console.log("MongoDB connected successfully");
    // Start server locally only; Vercel will handle requests via exported app
    if (process.env.VERCEL !== '1') {
      app.listen(PORT, () => console.log(`🚀 Server running on http://localhost:${PORT}`));
    }
  })
  .catch((err) => {
    console.error("MongoDB connection error:", err);
  });

// ✅ Export Express app for Vercel serverless function
export default app;
