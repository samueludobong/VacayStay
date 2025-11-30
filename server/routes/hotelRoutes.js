import express from "express";
import { protect } from "../middleware/authMiddleware.js";
import upload from "../middleware/uploadMiddleware.js";

import { registerHotel, getAllHotels, getAllPending, getPendingHotels, getAllPendingPayments, approvePending, declinePending, toggleRoomAvailability } from "../controllers/hotelController.js";

const hotelRouter = express.Router();

hotelRouter.post("/", upload.array("images", 5), protect, registerHotel);
hotelRouter.get("/", getAllHotels);
hotelRouter.get("/pending", protect, getPendingHotels);
hotelRouter.post("/pending/approve/:id", approvePending);
hotelRouter.delete("/pending/decline/:id", declinePending);
hotelRouter.get("/payment", getAllPendingPayments);
hotelRouter.get("/pending_hotels", getAllPending);
hotelRouter.post("/toggle-availability", protect, toggleRoomAvailability);



export default hotelRouter;
