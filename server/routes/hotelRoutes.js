import express from "express";
import { protect } from "../middleware/authMiddleware.js";
import upload from "../middleware/uploadMiddleware.js";

import { registerHotel, getAllHotels, getPendingHotels } from "../controllers/hotelController.js";

const hotelRouter = express.Router();

hotelRouter.post("/", upload.array("images", 5), protect, registerHotel);
hotelRouter.get("/", getAllHotels);
hotelRouter.get("/owner", protect, getPendingHotels);


export default hotelRouter;
