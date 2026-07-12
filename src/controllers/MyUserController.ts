import { Request, Response } from "express";
import User from "../models/user";

const getCurrentUser = async (req: Request, res: Response) => {
  try {
    const currentUser = await User.findOne({ _id: req.userId });
    if (!currentUser) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json(currentUser);
  } catch (error) {
    console.error("Error in getCurrentUser:", error); // Use console.error for actual errors
    return res.status(500).json({ message: "Something went wrong fetching user" });
  }
};

const createCurrentUser = async (req: Request, res: Response) => {
  try {
    const { auth0Id } = req.body;
    
    // Defensive check: ensure data exists
    if (!auth0Id) {
      return res.status(400).json({ message: "auth0Id is required" });
    }

    const existingUser = await User.findOne({ auth0Id });
    if (existingUser) {
      return res.status(200).send();
    }

    const newUser = new User(req.body);
    await newUser.save();

    res.status(201).json(newUser.toObject());
  } catch (error) {
    // This logs the full error to your Render dashboard
    console.error("Error in createCurrentUser:", error); 
    res.status(500).json({ message: "Error creating user" });
  }
};

const updateCurrentUser = async (req: Request, res: Response) => {
  try {
    const { name, addressLine1, country, city } = req.body;
    const user = await User.findById(req.userId);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    user.name = name;
    user.addressLine1 = addressLine1;
    user.city = city;
    user.country = country;

    await user.save();

    res.status(200).json(user);
  } catch (error) {
    console.error("Error in updateCurrentUser:", error);
    res.status(500).json({ message: "Error updating user" });
  }
};

export default {
  getCurrentUser,
  createCurrentUser,
  updateCurrentUser,
};