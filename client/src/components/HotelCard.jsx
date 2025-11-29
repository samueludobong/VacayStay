import React from 'react'
import { Link } from 'react-router-dom'
import { assets } from '../assets/assets'
import { useAppContext } from '../context/AppContext';

const HotelCard = ({ hotel, index }) => {

    return (
        <Link 
            to={'/hotels/' + hotel._id}
            onClick={() => scrollTo(0, 0)}
            className='relative max-w-70 w-full rounded-xl overflow-hidden bg-white text-gray-500/90 shadow-[0px_4px_4px_rgba(0,0,0,0.05)]'
        >
            {/* <img 
                src={hotel.images[0]} 
                alt="hotel-img" 
                draggable="false" 
                className='h-48 w-full object-cover'
            /> */}

            {index % 2 === 0 && (
                <p className='px-3 py-1 absolute top-3 left-3 text-xs bg-white text-gray-800 font-medium rounded-full'>
                    Best Seller
                </p>
            )}

            <div className='p-4 pt-5'>
                <div className='flex items-center justify-between'>
                    <p className='font-playfair text-xl font-medium text-gray-800'>
                        {hotel.name}
                    </p>

                    <div className='flex items-center gap-1'>
                        <img src={assets.starIconFilled} alt="star-icon" /> 4.5
                    </div>
                </div>

                <div className='flex items-center gap-1 text-sm mt-1'>
                    <img src={assets.locationIcon} alt="location-icon" />
                    <span>{hotel.address}</span>
                </div>

                <p className='text-gray-500 text-sm mt-2'>
                    {hotel.city}
                </p>

                <div className='flex items-center justify-between mt-4'>
                    <button className='px-4 py-2 text-sm font-medium border border-gray-300 rounded hover:bg-gray-50 transition-all cursor-pointer'>
                        View Hotel
                    </button>
                </div>
            </div>
        </Link>
    )
}

export default HotelCard;
