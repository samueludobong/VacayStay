import React, { useState } from 'react'
import { assets } from '../../assets/assets'
import Title from '../../components/Title'
import toast from 'react-hot-toast'
import { useAppContext } from '../../context/AppContext'
import { cities } from "../../assets/assets";


const AddRoom = () => {

    const { axios, getToken } = useAppContext()

    const [name, setName] = useState("");
    const [address, setAddress] = useState("");
    const [contact, setContact] = useState("");
    const [city, setCity] = useState("");

    const [images, setImages] = useState({ 1: null, 2: null, 3: null, 4: null })
    const [loading, setLoading] = useState(false);

    const [inputs, setInputs] = useState({
        roomType: '',
        pricePerNight: 0,
        amenities: {
            'Free WiFi': false,
            'Free Breakfast': false,
            'Room Service': false,
            'Mountain View': false,
            'Pool Access': false
        }
    })

    const onSubmitHandler = async (e) => {
    e.preventDefault();

    const hotelRes = await axios.post(
        `/api/hotels/`,
        { name, contact, address, city },
        { headers: { Authorization: `Bearer ${await getToken()}` } }
    );

    const hotel = hotelRes.data?.hotel;
    if (!hotel?._id) {
        toast.error("Unable to create hotel");
        return;
    }

    if (!inputs.roomType || !inputs.pricePerNight || !inputs.amenities || !Object.values(images).some(image => image)) {
        toast.error("Please fill in all the details");
        return;
    }

    setLoading(true);

    try {
        const formData = new FormData();
        formData.append("roomType", inputs.roomType);
        formData.append("pricePerNight", inputs.pricePerNight);

        const amenities = Object.keys(inputs.amenities).filter(key => inputs.amenities[key]);
        formData.append("amenities", JSON.stringify(amenities));

        formData.append("hotelId", hotel._id);

        Object.keys(images).forEach((key) => {
            if (images[key]) formData.append("images", images[key]);
        });

        // 4️⃣ SAVE ROOM
        const { data } = await axios.post(
            "/api/rooms/",
            formData,
            { headers: { Authorization: `Bearer ${await getToken()}` } }
        );

        if (data.success) {
            toast.success(data.message);

            // RESET FIELDS
            setInputs({
                roomType: "",
                pricePerNight: 0,
                amenities: {
                    "Free WiFi": false,
                    "Free Breakfast": false,
                    "Room Service": false,
                    "Mountain View": false,
                    "Pool Access": false
                }
            });

            setImages({ 1: null, 2: null, 3: null, 4: null });

            setName("");
            setAddress("");
            setContact("");
            setCity("");
        } else {
            toast.error(data.message);
        }

    } catch (err) {
        toast.error(err.message);
    } finally {
        setLoading(false);
    }
};


    return (

        <form onSubmit={onSubmitHandler}>

            <Title align='left' font='outfit' title='Add Room' subTitle='Fill in the details carefully and accurate room details, pricing, and amenities, to enhance the user booking experience.' />
                            <div className="relative flex flex-col items-center md:w-1/2 p-8 md:p-10">
                                <div className="w-full mt-4">
                                    <label htmlFor="name" className="font-medium text-gray-500">Hotel Name</label>
                                    <input onChange={(e) => setName(e.target.value)} value={name} placeholder="Type here" className="border border-gray-200 rounded w-full px-3 py-2.5 mt-1 outline-indigo-500 font-light" type="text" required />
                                </div>
            
                                <div className="w-full mt-4">
                                    <label htmlFor="contact" className="font-medium text-gray-500">Phone</label>
                                    <input id="contact" onChange={(e) => setContact(e.target.value)} value={contact} placeholder="Type here" className="border border-gray-200 rounded w-full px-3 py-2.5 mt-1 outline-indigo-500 font-light" type="text" required />
                                </div>
            
                                <div className="w-full mt-4">
                                    <label htmlFor="address" className="font-medium text-gray-500">Address</label>
                                    <textarea id="address" rows="2" onChange={(e) => setAddress(e.target.value)} value={address} placeholder="Type here" className="border border-gray-200 rounded w-full px-3 py-2.5 mt-1 outline-indigo-500 font-light resize-none" type="text" required />
                                </div>
        
                                <div className="w-full mt-4 max-w-60 mr-auto">
                                    <label htmlFor="city" className="font-medium text-gray-500">City</label>
                                    <select id="city" onChange={(e) => setCity(e.target.value)} value={city} className="border border-gray-200 rounded w-full px-3 py-2.5 mt-1 outline-indigo-500 font-light" required>
                                        <option value="">Select City</option>
                                        {cities.map((city) => (
                                            <option key={city} value={city}>{city}</option>
                                        ))}
                                    </select>
                                </div>
                            </div>
            {/* Upload Area For Images */}
            <p className='text-gray-800 mt-10'>Images</p>
            <div className='grid grid-cols-2 sm:flex gap-4 my-2 flex-wrap'>
                {Object.keys(images).map((key) => (
                    <label key={key} htmlFor={`roomImage${key}`}>
                        <img className='max-h-13 cursor-pointer opacity-80' src={images[key] ? URL.createObjectURL(images[key]) : assets.uploadArea} alt="" />
                        <input type="file" accept='image/*' id={`roomImage${key}`} hidden
                            onChange={e => setImages({ ...images, [key]: e.target.files[0] })} />
                    </label>
                ))}
            </div>

            <div className='w-full flex max-sm:flex-col sm:gap-4 mt-4'>

                <div className='flex-1 max-w-48'>
                    <p className='text-gray-800 mt-4'>Room Type</p>
                    <select className='border opacity-70 border-gray-300 mt-1 rounded p-2 w-full' value={inputs.roomType} onChange={(e) => setInputs({ ...inputs, roomType: e.target.value })}>
                        <option value=''>Select Room Type</option>
                        <option value='Single Bed'>Single Bed</option>
                        <option value='Double Bed'>Double Bed</option>
                        <option value='Luxury Room'>Luxury Room</option>
                        <option value='Family Suite'>Family Suite</option>
                    </select>
                </div>

                <div>
                    <p className='mt-4 text-gray-800'>Price <span className='text-xs'>/night</span></p>
                    <input type="number" placeholder='0' className='border border-gray-300 mt-1 rounded p-2 w-24' value={inputs.pricePerNight} onChange={(e) => setInputs({ ...inputs, pricePerNight: e.target.value })} />
                </div>

            </div>

            <p className='text-gray-800 mt-4'>Amenities</p>
            <div className='flex flex-col flex-wrap mt-1 text-gray-400 max-w-sm'>
                {Object.keys(inputs.amenities).map((amenity, index) => (
                    <div key={index}>
                        <input type='checkbox' id={`amenities${index + 1}`} checked={inputs.amenities[amenity]}
                            onChange={() => setInputs({ ...inputs, amenities: { ...inputs.amenities, [amenity]: !inputs.amenities[amenity] } })}
                        />
                        <label htmlFor={`amenities${index + 1}`}> {amenity} </label>
                    </div>
                ))}
            </div>

            <button className='bg-primary text-white px-8 py-2 rounded mt-8 cursor-pointer' disabled={loading}>
                {loading ? "Adding..." : "Add Room"}
            </button>
        </form>
    )
}

export default AddRoom
