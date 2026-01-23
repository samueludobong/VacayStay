import React, { useEffect, useMemo, useState } from "react";
import Title from "../../components/Title";
import { useAppContext } from "../../context/AppContext";
import toast from "react-hot-toast";

const ListRoom = () => {
  const { axios, getToken, user } = useAppContext();
  const [rooms, setRooms] = useState([]);
  const [openHotel, setOpenHotel] = useState(null);

  const fetchRooms = async () => {
    try {
      const { data } = await axios.get("/api/rooms/admin");
      if (data.success) {
        setRooms(data.rooms);
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  const toggleAvailability = async (roomId) => {
    const { data } = await axios.post(
      "/api/rooms/toggle-availability",
      { roomId },
      { headers: { Authorization: `Bearer ${await getToken()}` } }
    );

    if (data.success) {
      toast.success(data.message);
      fetchRooms();
    } else {
      toast.error(data.message);
    }
  };

  useEffect(() => {
    if (user) fetchRooms();
  }, [user]);

  // Group rooms by hotel
  const hotels = useMemo(() => {
    const map = {};

    rooms.forEach((room) => {
      const hotelName = room.hotel || "Unknown Hotel";
      if (!map[hotelName]) map[hotelName] = [];
      map[hotelName].push(room);
    });

    return map;
  }, [rooms]);

  return (
    <div>
      <Title
        align="left"
        font="outfit"
        title="Room Listings"
        subTitle="View, edit, or manage all listed rooms. Keep the information up-to-date to provide the best experience for users."
      />

      <p className="text-gray-500 mt-8">Total Hotels: {Object.keys(hotels).length}</p>

      <div className="w-full mt-4">
        {Object.keys(hotels).map((hotelName) => (
          <div key={hotelName} className="mb-4 border rounded-lg p-3">
            <button
              className="w-full text-left font-semibold text-lg"
              onClick={() =>
                setOpenHotel(openHotel === hotelName ? null : hotelName)
              }
            >
              {hotelName}
            </button>

            {openHotel === hotelName && (
              <div className="mt-3 border-t pt-3">
                <table className="w-full">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="py-3 px-4 text-gray-800 font-medium">Name</th>
                      <th className="py-3 px-4 text-gray-800 font-medium max-sm:hidden">
                        Facility
                      </th>
                      <th className="py-3 px-4 text-gray-800 font-medium">
                        Price / night
                      </th>
                      <th className="py-3 px-4 text-gray-800 font-medium text-center">
                        Actions
                      </th>
                    </tr>
                  </thead>

                  <tbody className="text-sm">
                    {hotels[hotelName].map((room) => (
                      <tr key={room._id}>
                        <td className="py-3 px-4 text-gray-700 border-t border-gray-300">
                          {room.roomType}
                        </td>
                        <td className="py-3 px-4 text-gray-400 border-t border-gray-300 max-sm:hidden">
                          {room.amenities.join(", ")}
                        </td>
                        <td className="py-3 px-4 text-gray-400 border-t border-gray-300">
                          {room.pricePerNight}
                        </td>
                        <td className="py-3 px-4 border-t border-gray-300 text-center">
                          <label className="relative inline-flex items-center cursor-pointer text-gray-900 gap-3">
                            <input
                              type="checkbox"
                              className="sr-only peer"
                              onChange={() => toggleAvailability(room._id)}
                              checked={room.isAvailable}
                            />
                            <div className="w-12 h-7 bg-slate-300 rounded-full peer peer-checked:bg-blue-600 transition-colors duration-200"></div>
                            <span className="dot absolute left-1 top-1 w-5 h-5 bg-white rounded-full transition-transform duration-200 ease-in-out peer-checked:translate-x-5"></span>
                          </label>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default ListRoom;
