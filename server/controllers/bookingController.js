import resend from "../configs/resend.js";
import Booking from "../models/Booking.js";
import Hotel from "../models/Hotel.js";
import Room from "../models/Room.js";
import stripe from "stripe";

const checkAvailability = async ({ checkInDate, checkOutDate, room }) => {
  try {
    const bookings = await Booking.find({
      room,
      status: { $nin: ["cancelled", "refunded"] },
      checkInDate: { $lte: checkOutDate },
      checkOutDate: { $gte: checkInDate },
    });

    return bookings.length === 0;
  } catch (error) {
    console.error(error.message);
    return false;
  }
};

export const checkAvailabilityAPI = async (req, res) => {
  try {
    const { room, checkInDate, checkOutDate } = req.body;
    const isAvailable = await checkAvailability({
      room,
      checkInDate,
      checkOutDate,
    });

    res.json({ success: true, isAvailable });
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};

/* =====================================================
   CREATE BOOKING
===================================================== */
export const createBooking = async (req, res) => {
  try {
    const { room, checkInDate, checkOutDate, guests } = req.body;
    const user = req.user._id;

    const isAvailable = await checkAvailability({
      room,
      checkInDate,
      checkOutDate,
    });

    if (!isAvailable)
      return res.json({ success: false, message: "Room is not available" });

    const roomData = await Room.findById(room).populate("hotel");

    const checkIn = new Date(checkInDate);
    const checkOut = new Date(checkOutDate);
    const nights = Math.ceil(
      (checkOut.getTime() - checkIn.getTime()) / (1000 * 3600 * 24)
    );

    const totalPrice = roomData.pricePerNight * nights;

    const booking = await Booking.create({
      user,
      room,
      hotel: roomData.hotel._id,
      guests: +guests,
      checkInDate,
      checkOutDate,
      totalPrice,
      status: "pending",
      paymentStatus: "awaiting",
      refundStatus: "none",
    });

    res.json({ success: true, message: "Booking created successfully" });

    await resend.emails.send({
      from: `VacayStay <${process.env.SENDER_EMAIL}>`,
      to: req.user.email,
      subject: "Hotel Booking Details",
      html: `
        <h2>Your Booking Details</h2>
        <p>Hello ${req.user.username},</p>
        <ul>
          <li><b>Booking ID:</b> ${booking._id}</li>
          <li><b>Hotel:</b> ${roomData.hotel.name}</li>
          <li><b>Address:</b> ${roomData.hotel.address}</li>
          <li><b>Check-in:</b> ${booking.checkInDate.toDateString()}</li>
          <li><b>Total:</b> ${booking.totalPrice}</li>
        </ul>
      `,
    });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: "Failed to create booking" });
  }
};

/* =====================================================
   USER BOOKINGS
===================================================== */
export const getUserBookings = async (req, res) => {
  try {
    const bookings = await Booking.find({ user: req.user._id })
      .populate("room hotel")
      .sort({ createdAt: -1 });

    res.json({ success: true, bookings });
  } catch {
    res.json({ success: false, message: "Failed to fetch bookings" });
  }
};

/* =====================================================
   HOTEL BOOKINGS (OWNER)
===================================================== */
export const getHotelBookings = async (req, res) => {
  try {
    const hotel = await Hotel.findOne({ owner: req.auth.userId });
    if (!hotel)
      return res.json({ success: false, message: "No hotel found" });

    const bookings = await Booking.find({ hotel: hotel._id })
      .populate("room hotel user")
      .sort({ createdAt: -1 });

    const totalRevenue = bookings
      .filter((b) => b.status !== "refunded")
      .reduce((acc, b) => acc + b.totalPrice, 0);

    res.json({
      success: true,
      dashboardData: {
        totalBookings: bookings.length,
        totalRevenue,
        bookings,
      },
    });
  } catch {
    res.json({ success: false, message: "Failed to fetch bookings" });
  }
};

/* =====================================================
   ALL HOTELS BOOKINGS (ADMIN)
===================================================== */
export const getHotelBookingsAll = async (req, res) => {
  try {
    const hotelIds = (await Hotel.find({})).map((h) => h._id);

    const bookings = await Booking.find({ hotel: { $in: hotelIds } })
      .populate("room hotel user")
      .sort({ createdAt: -1 });

    const totalRevenue = bookings
      .filter((b) => b.status !== "refunded")
      .reduce((acc, b) => acc + b.totalPrice, 0);

    res.json({
      success: true,
      dashboardData: {
        totalBookings: bookings.length,
        totalRevenue,
        bookings,
      },
    });
  } catch (error) {
    res.json({ success: false, message: "Failed to fetch bookings" });
  }
};

/* =====================================================
   ORDERS GENERATOR
===================================================== */
function getFinalStatus(b) {
  if (b.status === "refunded") return "Refunded";
  if (b.status === "cancelled")
    return b.paymentStatus === "paid" ? "Cancelled (Paid)" : "Cancelled";
  if (b.paymentStatus === "paid")
    return b.status === "confirmed"
      ? "Paid & Confirmed"
      : "Paid (Pending)";
  if (b.status === "confirmed") return "Confirmed (Unpaid)";
  return "Pending Payment";
}

export const generateOrders = async (req, res) => {
  try {
    const bookings = await Booking.find()
      .populate("room", "name")
      .populate("user", "name");

    const orders = bookings.map((b) => ({
      id: `#${b._id.toString().slice(-6)}`,
      user: b.user?.name || "Unknown",
      date: b.checkInDate.toISOString().split("T")[0],
      checkOutDate: b.checkOutDate.toISOString().split("T")[0],
      name: b.room?.name || "Unknown Room",
      price: `${b.totalPrice} NGN`,
      status: getFinalStatus(b),
    }));

    res.json({ success: true, orders });
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};

/* =====================================================
   STRIPE PAYMENT (SIMULATED SUCCESS)
===================================================== */
export const stripePayment = async (req, res) => {
  try {
    const { bookingId } = req.body;
    const booking = await Booking.findById(bookingId);

    if (!booking)
      return res.json({ success: false, message: "Booking not found" });

    const roomData = await Room.findById(booking.room).populate("hotel");
    const stripeInstance = new stripe(process.env.STRIPE_SECRET_KEY);
    const { origin } = req.headers;

    const session = await stripeInstance.checkout.sessions.create({
      mode: "payment",
      line_items: [
        {
          price_data: {
            currency: "ngn",
            product_data: { name: roomData.hotel.name },
            unit_amount: booking.totalPrice * 100,
          },
          quantity: 1,
        },
      ],
      success_url: `${origin}/loader/my-bookings`,
      cancel_url: `${origin}/my-bookings`,
    });

    // ✅ simulated success
    booking.paymentStatus = "paid";
    booking.status = "confirmed";
    await booking.save();

    res.json({ success: true, url: session.url });
  } catch {
    res.json({ success: false, message: "Payment Failed" });
  }
};

/* =====================================================
   ADMIN ACTIONS
===================================================== */
export const getAllBookings = async (req, res) => {
  try {
    const bookings = await Booking.find().sort({ createdAt: -1 });
    res.json({ success: true, bookings });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const releaseBookingRoom = async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id);
    if (!booking)
      return res.status(404).json({ success: false, message: "Not found" });

    if (booking.paymentStatus === "paid")
      return res
        .status(400)
        .json({ success: false, message: "Paid booking cannot be released" });

    booking.status = "cancelled";
    booking.paymentStatus = "awaiting";
    booking.refundStatus = "none";
    await booking.save();

    res.json({ success: true, message: "Room released" });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const refundBooking = async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id);
    if (!booking)
      return res.status(404).json({ success: false, message: "Not found" });

    if (booking.paymentStatus !== "paid")
      return res
        .status(400)
        .json({ success: false, message: "Only paid bookings refundable" });

    booking.status = "refunded";
    booking.refundStatus = "refunded";
    booking.paymentStatus = "awaiting";
    await booking.save();

    res.json({
      success: true,
      message: "Booking refunded successfully (simulated)",
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
