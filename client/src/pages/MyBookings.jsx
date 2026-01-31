import React, { useEffect, useState } from 'react'
import Title from '../components/Title'
import { assets } from '../assets/assets'
import { useAppContext } from '../context/AppContext'
import toast from 'react-hot-toast'


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

  const handleReschedule = (bookingId) => {
  setActiveBookingId(bookingId);
  setCheckInDate(null);
  setCheckOutDate(null);
  setShowReschedule(true);
};

  

    useEffect(() => {
        if (user) {
            fetchUserBookings();
        }
    }, [user]);

    return (
        <div className='py-28 md:pb-35 md:pt-32 px-4 md:px-16 lg:px-24 xl:px-32'>
            <Title title='My Bookings' subTitle='Easily manage your past, current, and upcoming hotel reservations in one place. Plan your trips seamlessly with just a few clicks' align='left' />
            <div className="max-w-6xl mt-8 w-full text-gray-800">
                <div className="hidden md:grid md:grid-cols-[3fr_2fr_1fr] w-full border-b border-gray-300 font-medium text-base py-3">
                    <div className="w-1/3">Hotels</div>
                    <div className="w-1/3">Date & Timings</div>
                    <div className="w-1/3">Payment</div>
                </div>

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
        alt="hotel-img"
      />
      <div className="flex flex-col gap-1.5 max-md:mt-3 min-md:ml-4">
        <p className="font-playfair text-2xl">
          {booking.hotel.name}
          <span className="font-inter text-sm">
            {" "}
            ({booking.room.roomType})
          </span>
        </p>

        <div className="flex items-center gap-1 text-sm text-gray-500">
          <img src={assets.locationIcon} alt="location-icon" />
          <span>{booking.hotel.address}</span>
        </div>

        <div className="flex items-center gap-1 text-sm text-gray-500">
          <img src={assets.guestsIcon} alt="guests-icon" />
          <span>Guests: {booking.guests}</span>
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
    <div className="flex flex-row items-start justify-center pt-3 gap-2">
  <StatusBadge
    status={booking.status}
    paymentStatus={booking.paymentStatus}
  />

  <div className="flex items-center gap-2">
    <div
      className={`h-3 w-3 rounded-full ${
        booking.paymentStatus === "paid"
          ? "bg-green-500"
          : "bg-red-500"
      }`}
    ></div>

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
      className="px-4 py-1.5 mt-2 text-xs border border-gray-400 rounded-full hover:bg-gray-50 transition-all"
    >
      Pay Now
    </button>
  )}

{/* CANCEL + REFUND */}
{booking.paymentStatus === "paid" &&
  booking.status !== "cancelled" &&
  booking.status !== "refunded" && (
    <div className="flex gap-2 mt-2">
      <button
        onClick={() => handleCancel(booking._id)}
        className="px-4 py-1.5 text-xs border border-red-400 text-red-500 rounded-full hover:bg-red-50 transition-all"
      >
        Cancel Booking
      </button>

      <button
        onClick={() => handleReschedule(booking._id)}
        className="px-4 py-1.5 text-xs border border-amber-400 text-amber-600 rounded-full hover:bg-amber-50 transition-all"
      >
        Reschedule Date
      </button>
    </div>
  )}

{/* REBOOK */}
{(booking.status === "cancelled" ||
  booking.status === "refunded") && (
  <button
    onClick={() => handleRebook(booking.room._id)}
    className="px-4 py-1.5 mt-2 text-xs border border-blue-400 text-blue-500 rounded-full hover:bg-blue-50 transition-all"
  >
    Rebook Room
  </button>
)}

</div>
  </div>
))}

            </div>
      {showReschedule && (
  <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
    <div className="bg-white rounded-lg w-full max-w-md p-5">
      <h3 className="text-lg font-semibold mb-3">Reschedule Booking</h3>

      <DatePicker
        selected={checkInDate}
        onChange={(date) => {
          setCheckInDate(date);
          setCheckOutDate(null);
        }}
        minDate={new Date()}
        maxDate={new Date(new Date().setFullYear(new Date().getFullYear() + 1))}
        excludeDates={disabledDates}
        placeholderText="Check-In"
        className="w-full rounded border border-gray-300 px-3 py-2 mt-1.5 outline-none"
      />

      <div className="flex justify-end gap-2 mt-4">
        <button
          onClick={() => setShowReschedule(false)}
          className="px-4 py-1.5 text-xs border rounded-full hover:bg-gray-50"
        >
          Cancel
        </button>

        <button
          disabled={!checkInDate}
          onClick={() => {
            submitReschedule(activeBookingId, checkInDate);
            setShowReschedule(false);
          }}
          className="px-4 py-1.5 text-xs border border-blue-500 text-blue-600 rounded-full hover:bg-blue-50 disabled:opacity-50"
        >
          Confirm
        </button>
      </div>
    </div>
  </div>
)}  
      </div>

      
    )
}

export default MyBookings
