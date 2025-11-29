import express from "express";
import { protect } from "../middleware/authMiddleware.js";
import upload from "../middleware/uploadMiddleware.js";

import { registerHotel, getAllHotels } from "../controllers/hotelController.js";

const hotelRouter = express.Router();

hotelRouter.post("/", upload.array("images", 5), protect, registerHotel);
hotelRouter.get("/", getAllHotels);
hotelRouter.get("/owner", protect, async (req, res) => {
    try {
        const hotels = await Hotel.find({ owner: req.user._id });
        res.json({ success: true, hotels });
    } catch (error) {
        res.json({ success: false, message: error.message });
    }
});


export default hotelRouter;
