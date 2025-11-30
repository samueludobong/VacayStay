import React, { useEffect } from 'react'
import Title from '../../components/Title'
import { useAppContext } from '../../context/AppContext';
import toast from 'react-hot-toast';


const ListRoom = () => {

    const { axios, getToken, user } = useAppContext()
    const [PendingHotels, setPending] = React.useState([])

    const fetchPending = async () => {
        try {
            const { data } = await axios.get('/api/hotels/pending_hotels', { headers: { Authorization: `Bearer ${await getToken()}` } })
            if (data.success) {
                setPending(data.hotels_pending)
            }
            else {
                toast.error(data.message)
            }
        } catch (error) {
            toast.error(error.message)
        }
    }

    const approveHotel = async (id) => {
    try {
        await axios.post(`/api/hotels/pending/approve/${id}`, {}, { headers: { Authorization: `Bearer ${await getToken()}` } });
        toast.success("Hotel approved!");
        fetchPending();
    } catch (error) {
    console.error(error);
    toast.error(
        error.response?.data?.message || 
        error.message || 
        "Failed to approve"
    );
}
};

    const declineHotel = async (id) => {
        try {
            await axios.delete(`/api/hotels/pending/decline/${id}`, { headers: { Authorization: `Bearer ${await getToken()}` } });
            toast.success("Hotel declined!");
            fetchPending();
        } catch (error) {
            console.error(error); // log full error
            toast.error(
                error.response?.data?.message || 
                error.message || 
                "Failed to decline"
            );
}
    };


    useEffect(() => {
        if (user) {
            fetchPending()
        }
    }, [user])

    return (
        <div>
            <Title align='left' font='outfit' title='Hotel Listings' subTitle='View, edit, or manage all listed hotels. Keep the information up-to-date to provide the best experience for users.' />
            <p className='text-gray-500 mt-8'>Pending Hotel Requests</p>
            {/* Table with heads User Name, Room Name, Amount Paid, Payment Status */}
            <div className='w-full text-left border border-gray-300 rounded-lg overflow-y-scroll mt-3'>
                <table className='w-full' >
                    <thead className='bg-gray-50 '>
                        <tr>
                            <th className='py-3 px-4 text-gray-800 font-medium'>Name</th>
                            <th className='py-3 px-4 text-gray-800 font-medium max-sm:hidden'>Address</th>
                            <th className='py-3 px-4 text-gray-800 font-medium'>Contact</th>
                            <th className='py-3 px-4 text-gray-800 font-medium text-center'>Owner</th>
                            <th className='py-3 px-4 text-gray-800 font-medium text-center'>Location</th>
                            <th className='py-3 px-4 text-gray-800 font-medium text-center'>Actions</th>
                        </tr>
                    </thead>
                    <tbody className='text-sm'>
                        {
                            PendingHotels.map((item, index) => (
                                <tr key={index}>
                                    <td className='py-3 px-4 text-gray-700 border-t border-gray-300'>{item.name}</td>
                                    <td className='py-3 px-4 text-gray-400 border-t border-gray-300 max-sm:hidden'>{item.address}</td>
                                    <td className='py-3 px-4 text-gray-400 border-t border-gray-300'>{item.contact}</td>
                                    <td className='py-3 px-4 text-gray-400 border-t border-gray-300'>{item.owner}</td>
                                    <td className='py-3 px-4 text-gray-400 border-t border-gray-300'>{item.city}</td>
                                    <td className='py-3 px-4 border-t border-gray-300 text-center text-sm'>
                                        <div className='flex items-center justify-center gap-2'>
                                            <button
                                                className='px-3 py-1 bg-green-500 text-white rounded-md text-xs hover:bg-green-600 transition'
                                                onClick={() => approveHotel(item._id)}
                                            >
                                                Approve
                                            </button>

                                            <button
                                                className='px-3 py-1 bg-red-500 text-white rounded-md text-xs hover:bg-red-600 transition'
                                                onClick={() => declineHotel(item._id)}
                                            >
                                                Decline
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))
                        }
                    </tbody>
                </table>
            </div>
        </div>
    )
}

export default ListRoom