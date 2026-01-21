import React, { useState } from "react";
import { assets } from "../assets/assets";
import { useAppContext } from "../context/AppContext";
import { useNavigate } from "react-router-dom";


const Hero = () => {
  const { axios, rooms } = useAppContext();

  const [destination, setDestination] = useState("");
  const [checkIn, setCheckIn] = useState("");
  const [checkOut, setCheckOut] = useState("");
  const navigate = useNavigate();
  const [guests, setGuests] = useState(1);

  const [availableRooms, setAvailableRooms] = useState([]);
  const [showPopup, setShowPopup] = useState(false);
  const [message, setMessage] = useState("");

  // 📅 Limit calendar to current year
  const currentYear = new Date().getFullYear();
  const minDate = `${currentYear}-01-01`;
  const maxDate = `${currentYear}-12-31`;

  const onSearch = async (e) => {
    e.preventDefault();
    setMessage("");
    setAvailableRooms([]);
    setShowPopup(false);

    if (!destination || !checkIn || !checkOut) return;

    try {
      const res = await axios.post("/api/rooms/search", {
        roomType: destination,
        checkIn,
        checkOut,
        guests,
      });

      if (!res.data.availableRooms.length) {
        setMessage("❌ Room for selected dates is not available");
        return;
      }

      setAvailableRooms(res.data.availableRooms);
      setShowPopup(true);

    } catch (err) {
      console.error(err);
      setMessage("⚠️ Failed to check availability");
    }
  };

  return (
    <section className="bg-[#0a1b43] mt-20 pb-15">

      {/* SEARCH FORM */}
      <form
        onSubmit={onSearch}
        className="bg-white text-black rounded-lg py-4
        flex flex-col md:flex-row max-md:items-center gap-4
        mx-auto justify-center max-w-5xl mb-10"
      >
        {/* ROOM TYPE */}
        <div>
          <label className="flex items-center gap-2">
            <img src={assets.calenderIcon} className="h-4" />
            Room Type
          </label>
          <input
            list="destinations"
            value={destination}
            onChange={(e) => setDestination(e.target.value)}
            className="rounded border px-3 py-1.5 mt-1.5 text-sm outline-none"
            required
          />
          <datalist id="destinations">
            {[...new Set(rooms.map((r) => r.roomType))].map((type) => (
              <option key={type} value={type} />
            ))}
          </datalist>
        </div>

        {/* CHECK IN */}
        <div>
          <label className="flex items-center gap-2">
            <img src={assets.calenderIcon} className="h-4" />
            Check in
          </label>
          <input
            type="date"
            min={minDate}
            max={maxDate}
            value={checkIn}
            onChange={(e) => setCheckIn(e.target.value)}
            className="rounded border px-3 py-1.5 mt-1.5 text-sm outline-none"
            required
          />
        </div>

        {/* CHECK OUT */}
        <div>
          <label className="flex items-center gap-2">
            <img src={assets.calenderIcon} className="h-4" />
            Check out
          </label>
          <input
            type="date"
            min={checkIn || minDate}
            max={maxDate}
            value={checkOut}
            onChange={(e) => setCheckOut(e.target.value)}
            className="rounded border px-3 py-1.5 mt-1.5 text-sm outline-none"
            required
          />
        </div>

        {/* GUESTS */}
        <div className="flex flex-col items-center">
          <label>Guests</label>
          <input
            type="number"
            min={1}
            max={4}
            value={guests}
            onChange={(e) => setGuests(e.target.value)}
            className="rounded border px-3 py-1.5 mt-1.5 text-sm outline-none max-w-16"
          />
        </div>

        <button className="bg-black text-white px-6 py-3 rounded-md">
          Search
        </button>
      </form>

      {/* ERROR MESSAGE */}
      {message && (
        <p className="text-red-500 text-center font-medium">{message}</p>
      )}

      {/* POPUP */}
      {showPopup && (
  <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center">
    <div className="bg-white rounded-lg p-6 w-full max-w-2xl max-h-[85vh] overflow-y-auto">
      <h2 className="text-xl font-semibold mb-4">
        Available Rooms
      </h2>

      {availableRooms.map((room) => (
        <div
          key={room._id}
          className="border rounded-lg mb-4 overflow-hidden"
        >
          {/* IMAGE */}
          {room.images?.length > 0 && (
            <img
              src={room.images[0]}
              alt={room.roomType}
              className="w-full h-48 object-cover"
            />
          )}

          <div className="p-4 space-y-2">
            <h3 className="text-lg font-semibold">{room.roomType}</h3>

            <p className="text-gray-700">
              ₦{room.pricePerNight} <span className="text-sm">/ night</span>
            </p>

            {/* AMENITIES */}
            <div className="flex flex-wrap gap-2">
              {room.amenities?.map((amenity, index) => (
                <span
                  key={index}
                  className="text-xs bg-gray-100 px-2 py-1 rounded"
                >
                  {amenity}
                </span>
              ))}
            </div>

            {/* ACTION */}
            <button
              onClick={() => navigate(`/rooms/${room._id}`)}
              className="mt-3 w-full bg-black text-white py-2 rounded-md hover:bg-gray-900 transition"
            >
              Book Now
            </button>
          </div>
        </div>
      ))}

      <button
        onClick={() => setShowPopup(false)}
        className="w-full mt-2 border py-2 rounded-md"
      >
        Close
      </button>
    </div>
  </div>
)}

    </section>
  );
};

export default Hero;
