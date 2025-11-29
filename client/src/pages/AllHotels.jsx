import React from 'react'
import { useAppContext } from '../context/AppContext';
import Title from './Title';
import HotelCard from './HotelCard';


const FeaturedDestination = () => {
    const { hotels, navigate } = useAppContext();
    return hotels.length > 0 && (
        <div className='flex flex-col items-center px-6 md:px-16 lg:px-24 bg-slate-50 py-20'>
            <Title title="Hotels" subTitle="Discover our handpicked selection of exceptional properties around the world, offering unparalleled luxury and unforgettable experiences." />
            <div className='flex flex-wrap items-center justify-center gap-6 mt-20'>
                {rooms.slice(0, 4).map((room, index) => (
                    <HotelCard key={hotels._id} room={room} index={index} />
                ))}
            </div>
        </div>
    )
}

export default FeaturedDestination