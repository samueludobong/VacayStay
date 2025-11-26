import React, { useState } from 'react'
import { assets, cities } from '../assets/assets'
import { useAppContext } from '../context/AppContext';

const Hero = () => {

    const { navigate, getToken, axios, setSearchedCities } = useAppContext();
    const [destination, setDestination] = useState("");

    const onSearch = async (e) => {
        e.preventDefault();
        navigate(`/rooms?destination=${destination}`);

        await axios.post('/api/user/store-recent-search', { recentSearchedCity: destination }, {
            headers: { Authorization: `Bearer ${await getToken()}` }
        });

        setSearchedCities((prevSearchedCities) => {
            const updatedSearchedCities = [...prevSearchedCities, destination];
            if (updatedSearchedCities.length > 3) {
                updatedSearchedCities.shift();
            }
            return updatedSearchedCities;
        });
    }

    return (
      <section id="section" class="bg-[url(&quot;/src/assets/heroImage.png&quot;)] bg-no-repeat bg-cover bg-center h-screen mt-20">
    <main
        class="flex flex-col md:flex-row items-center max-md:text-center justify-between mt-16 pb-16 px-6 sm:px-10 md:px-24 max-w-7xl mx-auto w-full">
        <div class="flex flex-col items-center md:items-start">
            <p class="bg-[#49B9FF]/50 px-3.5 py-1 rounded-full mt-20 text-white">The Ultimate Hotel Experience</p>
            <h1 class="text-black font-semibold text-3xl sm:text-4xl md:text-5xl max-w-xl mt-5">
                Discover Your Perfect Gateway Destination
            </h1>
            <p class="mt-4 text-black max-w-md text-sm sm:text-base leading-relaxed">
                Unparalleled luxury and comfort await at the world's most exclusive hotels and resorts. Start your journey today.
            </p>
            <div class="flex flex-col md:flex-row items-center mt-8 gap-3">
                <button
                    class="bg-black text-white px-6 pr-2.5 py-2.5 rounded-full text-sm font-medium flex items-center space-x-2 hover:bg-[#49B9FF] transition"
                    type="button">
                    <span>
                        Visit Rooms
                    </span>
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M4.821 11.999h13.43m0 0-6.714-6.715m6.715 6.715-6.715 6.715" stroke="#fff"
                            stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" />
                    </svg>
                </button>
                <a class="text-black bg-white px-5 py-2 rounded-full text-sm font-medium hover:bg-indigo-200 transition"
                    href="#">
                    Get Started
                </a>
            </div>
        </div>
        <div aria-label="Photos of leaders" class="mt-12 grid grid-cols-2 gap-6 pb-6">
            <img alt="" class="w-36 h-44 rounded-lg hover:scale-105 transition duration-300 object-cover flex-shrink-0 shadow-lg" height="140"
                src="https://images.unsplash.com/flagged/photo-1573740144655-bbb6e88fb18a?q=80&w=735&auto=format&fit=crop"
                width="120" />
            <img alt="" class="w-36 h-44 rounded-lg hover:scale-105 transition duration-300 object-cover flex-shrink-0 shadow-lg" height="140"
                src="https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?q=80&w=687&auto=format&fit=crop"
                width="120" />
            <img alt="" class="w-36 h-44 rounded-lg hover:scale-105 transition duration-300 object-cover flex-shrink-0 shadow-lg" height="140"
                src="https://images.unsplash.com/photo-1560250097-0b93528c311a?q=80&w=687&auto=format&fit=crop"
                width="120" />
            <img alt="" class="w-36 h-44 rounded-lg hover:scale-105 transition duration-300 object-cover flex-shrink-0 shadow-lg" height="140"
                src="https://images.unsplash.com/photo-1546961329-78bef0414d7c?q=80&w=687&auto=format&fit=crop"
                width="120" />
        </div>
            </main>
            </section>
  )
}

export default Hero
