import { useAuth, useUser } from "@clerk/clerk-react";
import { createContext, useContext, useEffect, useState } from "react";
import axios from "axios";
import { toast } from 'react-hot-toast'
import { useNavigate } from "react-router-dom";
import { assets } from "../assets/assets";

axios.defaults.baseURL = import.meta.env.VITE_BACKEND_URL;

const AppContext = createContext();

export const AppProvider = ({ children }) => {

    const currency = import.meta.env.VITE_CURRENCY || "$";
    const navigate = useNavigate();
    const { user } = useUser();
    const { getToken } = useAuth()

    const [isOwner, setIsOwner] = useState(false);
    const [isAdmin, setAdmin] = useState(false);
    const [isPending, setPending] = useState(false);
    const [Pending, setPendingCurrent] = useState(false);
    const [showHotelReg, setShowHotelReg] = useState(false);
    const [rooms, setRooms] = useState([]);
    const [hotels, setHotels] = useState([]);
    const [searchedCities, setSearchedCities] = useState([]); // max 3 recent searched cities

    const facilityIcons = {
        "Free WiFi": assets.freeWifiIcon,
        "Free Breakfast": assets.freeBreakfastIcon,
        "Room Service": assets.roomServiceIcon,
        "Mountain View": assets.mountainIcon,
        "Pool Access": assets.poolIcon,
    };

    const fetchUser = async () => {
        try {
            const { data } = await axios.get('/api/user', { headers: { Authorization: `Bearer ${await getToken()}` } })
            if (data.success) {
                setIsOwner(data.role === "hotelOwner");
                setAdmin(data.role === "Admin");
                setSearchedCities(data.recentSearchedCities);
                fetchOwnerHotels(data._id)
            } else {
                setTimeout(() => {
                    fetchUser();
                }, 2000);
            }
        } catch (error) {
            toast.error(error.message)
        }
    }

    const fetchRooms = async () => {
        try {
            const { data } = await axios.get('/api/rooms')
            if (data.success) {
                setRooms(data.rooms)
            }
            else {
                toast.error(data.message)
            }
        } catch (error) {
            toast.error(error.message)
        }
    }

    const fetchHotels = async () => {
        try {
            const { data } = await axios.get('/api/hotels')
            if (data.success) {
                setHotels(data.hotels)
            }
            else {
                toast.error(data.message)
            }
        } catch (error) {
            toast.error(error.message)
        }
    }

    const fetchPendingHotels = async () => {
        try {
            const { data } = await axios.get('/api/hotels/pending')
            if (data.success) {
                setPendingCurrent(data.hotelsP)
            }
            else {
                toast.error(data.message)
            }
        } catch (error) {
            toast.error(error.message)
        }
    }

    const fetchOwnerHotels = async () => {
    try {
        const { data } = await axios.get("/api/hotels/owner", {
            headers: { Authorization: `Bearer ${await getToken()}` }
        });

        if (data.success) {
            setPending(data.hotelTemp);
            console.log("FETCHED OWNER HOTELS:", data.hotelTemp);
        }
    } catch (error) {
        console.log("FETCH HOTELS ERROR:", error.response?.data || error);
        toast.error("Unable to fetch your hotels");
    }
};


    useEffect(() => {
        if (user) {
            fetchUser();
        }
    }, [user]);

    useEffect(() => {
        fetchRooms();
    }, []);

    useEffect(() => {
        fetchHotels();
    }, []);

        useEffect(() => {
        fetchPendingHotels();
        }, []);
    
    const value = {
        currency, navigate,
        user, getToken,
        isOwner, setIsOwner,
        isAdmin, setAdmin,
        isPending, setPending,
        Pending, setPendingCurrent,
        axios,
        showHotelReg, setShowHotelReg,
        facilityIcons,
        rooms, setRooms,
        hotels, setHotels,
        searchedCities, setSearchedCities
    };

    return (
        <AppContext.Provider value={value}>
            {children}
        </AppContext.Provider>
    );

};

export const useAppContext = () => useContext(AppContext);