import React, { useEffect, useState } from 'react'
import Title from '../components/Title'
import { assets } from '../assets/assets'
import { useAppContext } from '../context/AppContext'
import toast from 'react-hot-toast'
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";


const MyBookings = () => {

    const { axios, getToken, user, currency, navigate } = useAppContext();
  const [bookings, setBookings] = useState([]);
  const [showReschedule, setShowReschedule] = useState(false);
  const [activeBookingId, setActiveBookingId] = React.useState(null);

  const [checkInDate, setCheckInDate] = React.useState(null);
  const [checkOutDate, setCheckOutDate] = React.useState(null);


    const StatusBadge = ({ status, paymentStatus }) => {
  let label = "Pending";
  let style = "bg-yellow-100 text-yellow-700";

  if (status === "cancelled") {
    label = "Cancelled";
    style = "bg-gray-200 text-gray-700";
  }

  if (status === "refunded") {
    label = "Refunded";
    style = "bg-red-100 text-red-700";
  }

  if (paymentStatus === "paid" && status === "confirmed") {
    label = "Confirmed";
    style = "bg-green-100 text-green-700";
  }

  if (paymentStatus === "paid" && status !== "confirmed") {
    label = "Paid";
    style = "bg-blue-100 text-blue-700";
  }

  return (
    <span
      className={`px-3 py-1 rounded-full text-xs font-medium ${style}`}
    >
      {label}
    </span>
  );
  };
  
  const disabledDates = React.useMemo(() => {
    const dates = [];

    bookings.forEach((b) => {
      if (b.status === "cancelled" || b.status === "refunded") return;

      const start = new Date(b.checkInDate);
      const end = new Date(b.checkOutDate);
      let current = new Date(start);

      while (current <= end) {
        dates.push(new Date(current));
        current.setDate(current.getDate() + 1);
      }
    });

    return dates;
  }, [bookings]);


  const handleReschedule = (bookingId) => {
    setActiveBookingId(bookingId);
    setCheckInDate(null);
    setCheckOutDate(null);
    setShowReschedule(true);
  };

  const submitReschedule = (bookingId, newDate) => {
    if (!bookingId || !newDate) return;

    console.log("Reschedule booking:", bookingId, newDate);

    // API CALL
    // api.rescheduleBooking(bookingId, newDate);
  };

    const fetchUserBookings = async () => {
        try {
            const { data } = await axios.get('/api/bookings/user', { headers: { Authorization: `Bearer ${await getToken()}` } })
            if (data.success) {
                setBookings(data.bookings)
            }
            else {
                toast.error(data.message)
            }
        } catch (error) {
            toast.error(error.message)
        }
    }

    const handlePayment = async (bookingId) => {
        try {
            const { data } = await axios.post('/api/bookings/stripe-payment', { bookingId }, { headers: { Authorization: `Bearer ${await getToken()}` } })
            if (data.success) {
                window.location.href = data.url
            } else {
                toast.error(data.message)
            }
        } catch (error) {
            toast.error(error.message)
        }
  }
  
  const handleRebook = (roomId) => {
    navigate(`/rooms/${roomId}`);
  }


  
  

    useEffect(() => {
        if (user) {
            fetchUserBookings();
        }
    }, [user]);

return (
    <div className="py-28 md:pb-35 md:pt-32 px-4 md:px-16 lg:px-24 xl:px-32">
      <div className="max-w-6xl mt-8 w-full text-gray-800">

        {bookings.map((booking) => (
          <div
            key={booking._id}
            className="grid grid-cols-1 md:grid-cols-[3fr_2fr_1fr] w-full border-b border-gray-300 py-6 first:border-t"
          >
            {/* LEFT */}
            <div className="flex flex-col md:flex-row">
              <img
                className="min-md:w-44 rounded shadow object-cover"
                src={booking.room.images[0]}
                alt="hotel"
              />

              <div className="flex flex-col gap-1.5 max-md:mt-3 min-md:ml-4">
                <p className="text-2xl">
                  {booking.hotel.name}{" "}
                  <span className="text-sm">({booking.room.roomType})</span>
                </p>

                <div className="flex items-center gap-1 text-sm text-gray-500">
                  <img src={assets.locationIcon} alt="" />
                  {booking.hotel.address}
                </div>

                <div className="flex items-center gap-1 text-sm text-gray-500">
                  <img src={assets.guestsIcon} alt="" />
                  Guests: {booking.guests}
                </div>

                <p className="text-base">
                  Total: {currency}
                  {booking.totalPrice}
                </p>
              </div>
            </div>

            {/* MIDDLE */}
            <div className="flex flex-row md:items-center md:gap-12 mt-3 gap-8">
              <div>
                <p>Check-In:</p>
                <p className="text-gray-500 text-sm">
                  {new Date(booking.checkInDate).toDateString()}
                </p>
              </div>
              <div>
                <p>Check-Out:</p>
                <p className="text-gray-500 text-sm">
                  {new Date(booking.checkOutDate).toDateString()}
                </p>
              </div>
            </div>

            {/* RIGHT */}
            <div className="flex flex-col items-start pt-3 gap-2">
              <div className="flex items-center gap-2">
                <div
                  className={`h-3 w-3 rounded-full ${
                    booking.paymentStatus === "paid"
                      ? "bg-green-500"
                      : "bg-red-500"
                  }`}
                />
                <p
                  className={`text-sm ${
                    booking.paymentStatus === "paid"
                      ? "text-green-500"
                      : "text-red-500"
                  }`}
                >
                  {booking.paymentStatus === "paid" ? "Paid" : "Unpaid"}
                </p>
              </div>

              {/* PAY NOW */}
              {booking.paymentStatus !== "paid" &&
                booking.status !== "cancelled" &&
                booking.status !== "refunded" && (
                  <button
                    onClick={() => handlePayment(booking._id)}
                    className="px-4 py-1.5 text-xs border rounded-full"
                  >
                    Pay Now
                  </button>
                )}

              {/* CANCEL + RESCHEDULE */}
              {booking.paymentStatus === "paid" &&
                booking.status !== "cancelled" &&
                booking.status !== "refunded" && (
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleCancel(booking._id)}
                      className="px-4 py-1.5 text-xs border border-red-400 text-red-500 rounded-full"
                    >
                      Cancel
                    </button>

                    <button
                      onClick={() => handleReschedule(booking._id)}
                      className="px-4 py-1.5 text-xs border border-amber-400 text-amber-600 rounded-full"
                    >
                      Reschedule
                    </button>
                  </div>
                )}

              {/* REBOOK */}
              {(booking.status === "cancelled" ||
                booking.status === "refunded") && (
                <button
                  onClick={() => handleRebook(booking.room._id)}
                  className="px-4 py-1.5 text-xs border border-blue-400 text-blue-500 rounded-full"
                >
                  Rebook Room
                </button>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* ------------------ RESCHEDULE MODAL ------------------ */}
      {showReschedule && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/40"
          onClick={() => setShowReschedule(false)}
        >
          <div
            className="bg-white rounded-lg w-full max-w-md p-5"
            onClick={(e) => e.stopPropagation()}
          >
            <h3 className="text-lg font-semibold mb-3">
              Reschedule Booking
            </h3>

            <DatePicker
              selected={checkInDate}
              onChange={(date) => {
                setCheckInDate(date);
                setCheckOutDate(null);
              }}
              minDate={new Date()}
              maxDate={new Date(
                new Date().setFullYear(new Date().getFullYear() + 1)
              )}
              excludeDates={disabledDates}
              placeholderText="Check-In"
              className="w-full rounded border px-3 py-2 mt-1.5"
            />

            <div className="flex justify-end gap-2 mt-4">
              <button
                onClick={() => setShowReschedule(false)}
                className="px-4 py-1.5 text-xs border rounded-full"
              >
                Cancel
              </button>

              <button
                disabled={!checkInDate || !activeBookingId}
                onClick={() => {
                  submitReschedule(activeBookingId, checkInDate);
                  setShowReschedule(false);
                }}
                className="px-4 py-1.5 text-xs border border-blue-500 text-blue-600 rounded-full disabled:opacity-50"
              >
                Confirm
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MyBookings
