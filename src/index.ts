import express, { Request, Response } from "express"; 
import cors from "cors"; 
import "dotenv/config"; 
import mongoose from "mongoose"; 
import myUserRoute from "./routes/MyUserRoute"; 
import { v2 as cloudinary } from "cloudinary"; 
import myRestaurantRoute from "./routes/MyRestaurantRoute"; 
import restaurantRoute from "./routes/RestaurantRoute"; 
import orderRoute from "./routes/OrderRoute"; 

// Keeps your connection matching Option A (Render Dashboard variable configuration)
mongoose
  .connect(process.env.MONGODB_CONNECTION_STRING as string) 
  .then(() => console.log("Connected to database!"))
  .catch((err) => console.error("Database connection error:", err));

cloudinary.config({ 
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME, 
  api_key: process.env.CLOUDINARY_API_KEY, 
  api_secret: process.env.CLOUDINARY_API_SECRET
}); //  Fixed the missing closing syntax here

const app = express(); 
app.use(cors()); 

app.use("/api/order/checkout/webhook", express.raw({ type: "*/*" })); 
app.use(express.json()); 

app.get("/health", async (req: Request, res: Response) => {   
  res.send({ message: "health OK!" }); 
});

app.use("/api/my/user", myUserRoute); 
app.use("/api/my/restaurant", myRestaurantRoute); 
app.use("/api/restaurant", restaurantRoute); 
app.use("/api/order", orderRoute); 

// Fallback to Render's dynamic port environment setup
const PORT = process.env.PORT || 7000;
app.listen(PORT, () => {   
  console.log(`Server started on port ${PORT}`); 
});