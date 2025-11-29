import Hotel from "../models/Hotel.js";
import User from "../models/User.js";

export const registerHotel = async (req, res) => {
  try {
    const { name, address, contact, city } = req.body;
    const owner = req.user._id;

    // Check if owner already has a hotel
    const existingHotel = await Hotel.findOne({ owner });
    if (existingHotel) {
      return res.json({ success: false, message: "Hotel already registered" });
    }

    // Upload images to Cloudinary
    const uploadedImages = await Promise.all(
      req.files.map(async (file) => {
        const result = await cloudinary.uploader.upload(file.path);
        return result.secure_url;
      })
    );

    // Create hotel
    await Hotel.create({
      name,
      address,
      contact,
      city,
      owner,
      images: uploadedImages,
    });

    // Update user role
    await User.findByIdAndUpdate(owner, { role: "hotelOwner" });

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
