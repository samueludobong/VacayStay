import express from "express";
import { protect } from "../middleware/authMiddleware.js";
import { registerHotel, getAllHotels } from "../controllers/hotelController.js";

const hotelRouter = express.Router();

hotelRouter.post("/", protect, registerHotel, getAllHotels);

export default hotelRouter;
