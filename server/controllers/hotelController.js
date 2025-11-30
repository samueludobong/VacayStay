import Hotel from "../models/Hotel.js";
import Booking from "../models/Booking.js";
import HotelTemp from "../models/HotelTemp.js";
import User from "../models/User.js";
import { v2 as cloudinary } from "cloudinary";


export const registerHotel = async (req, res) => {
  try {
    const { name, address, contact, city } = req.body;
    const owner = req.user._id;

    const existingHotel = await Hotel.findOne({ owner });
    if (existingHotel) {
      return res.json({ success: false, message: "Hotel already registered" });
    }

    const uploadedImages = await Promise.all(
      req.files.map(async (file) => {
        const result = await cloudinary.uploader.upload(file.path);
        return result.secure_url;
      })
    );

    await HotelTemp.create({
      name,
      address,
      contact,
      city,
      owner,
      images: uploadedImages,
    });

    // await User.findByIdAndUpdate(owner, { role: "hotelOwner" });

    res.json({ success: true, message: "Hotel registered successfully" });

  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};


export const getAllHotels = async (req, res) => {
  try {
    const hotels = await Hotel.find();

    res.json({
      success: true,
      hotels,
    });
  } catch (error) {
    res.json({
      success: false,
      message: error.message,
    });
  }
};

export const getAllPending = async (req, res) => {
  try {
    const hotels_pending = await HotelTemp.find();

    res.json({
      success: true,
      hotels_pending,
    });
  } catch (error) {
    res.json({
      success: false,
      message: error.message,
    });
  }
};
export const approvePending = async (req, res) => {
    try {
        const { id } = req.params;

        const pending = await HotelTemp.findById(id);
        if (!pending) return res.status(404).json({ success: false, message: "Payment not found" });

        await Hotel.create(pending.toObject());

        await pending.remove();

        res.json({ success: true, message: "Payment approved and moved." });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

export const declinePending = async (req, res) => {
    try {
        const { id } = req.params;

        const pending = await HotelTemp.findById(id);
        if (!pending) return res.status(404).json({ success: false, message: "Payment not found" });

        await pending.remove();

        res.json({ success: true, message: "Payment declined and deleted." });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};


export const getPending = async (req, res) => {
  try {
    const hotelsP = await HotelTemp.find();

    res.json({
      success: true,
      hotelsP,
    });
  } catch (error) {
    res.json({
      success: false,
      message: error.message,
    });
  }
};

export const getAllPendingPayments = async (req, res) => {
  try {
    const pendingBookings = await Booking.find({ isPaid: false });

    res.json({
      success: true,
      pendingBookings,
    });
  } catch (error) {
    res.json({
      success: false,
      message: error.message,
    });
  }
};

export const getPendingHotels = async (req, res) => {
    try {
        const hotelTemp = await HotelTemp.find({ owner: req.user._id });
        res.json({ success: true, hotelTemp });
    } catch (error) {
      res.json({ success: false, message: error.message });
      console.log(error);
    }
};
