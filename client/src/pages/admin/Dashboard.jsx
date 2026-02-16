import React, { useEffect, useState } from 'react'
import { useAppContext } from '../../context/AppContext'

const Dashboard = () => {
    const { axios } = useAppContext();
    const [stats, setStats] = useState({
        totalUsers: 0,
        totalProducts: 0,
        totalOrders: 0,
        totalRevenue: 0,
        totalDeliveryPersons: 0
    });

    const fetchStats = async () => {
        try {
            const { data } = await axios.get('/api/admin/stats', { withCredentials: true });
            if (data.success) {
                setStats(data.stats);
            }
        } catch (error) {
            console.log(error);
        }
    };

    useEffect(() => {
        fetchStats();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    return (
        <div>
            <h2 className='text-2xl font-semibold mb-6'>Dashboard Overview</h2>
            
            <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6'>
                <div className='bg-white p-6 rounded-lg shadow border border-gray-200'>
                    <div className='flex items-center justify-between'>
                        <div>
                            <p className='text-gray-500 text-sm'>Total Users</p>
                            <p className='text-3xl font-bold text-gray-800 mt-2'>{stats.totalUsers}</p>
                        </div>
                        <div className='w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center text-2xl'>
                            👥
                        </div>
                    </div>
                </div>

                <div className='bg-white p-6 rounded-lg shadow border border-gray-200'>
                    <div className='flex items-center justify-between'>
                        <div>
                            <p className='text-gray-500 text-sm'>Total Products</p>
                            <p className='text-3xl font-bold text-gray-800 mt-2'>{stats.totalProducts}</p>
                        </div>
                        <div className='w-12 h-12 bg-green-100 rounded-full flex items-center justify-center text-2xl'>
                            📦
                        </div>
                    </div>
                </div>

                <div className='bg-white p-6 rounded-lg shadow border border-gray-200'>
                    <div className='flex items-center justify-between'>
                        <div>
                            <p className='text-gray-500 text-sm'>Total Orders</p>
                            <p className='text-3xl font-bold text-gray-800 mt-2'>{stats.totalOrders}</p>
                        </div>
                        <div className='w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center text-2xl'>
                            🛒
                        </div>
                    </div>
                </div>

                <div className='bg-white p-6 rounded-lg shadow border border-gray-200'>
                    <div className='flex items-center justify-between'>
                        <div>
                            <p className='text-gray-500 text-sm'>Total Revenue</p>
                            <p className='text-3xl font-bold text-gray-800 mt-2'>₹{stats.totalRevenue.toLocaleString()}</p>
                        </div>
                        <div className='w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center text-2xl'>
                            💰
                        </div>
                    </div>
                </div>

                <div className='bg-white p-6 rounded-lg shadow border border-gray-200'>
                    <div className='flex items-center justify-between'>
                        <div>
                            <p className='text-gray-500 text-sm'>Delivery Staff</p>
                            <p className='text-3xl font-bold text-gray-800 mt-2'>{stats.totalDeliveryPersons}</p>
                        </div>
                        <div className='w-12 h-12 bg-teal-100 rounded-full flex items-center justify-center text-2xl'>
                            🚚
                        </div>
                    </div>
                </div>
            </div>

            <div className='mt-8 bg-white p-6 rounded-lg shadow border border-gray-200'>
                <h3 className='text-xl font-semibold mb-4'>Welcome to Admin Panel</h3>
                <p className='text-gray-600'>
                    From here you can manage all aspects of your grocery store including users, products, orders, categories, delivery persons, and ratings.
                </p>
            </div>
        </div>
    )
}

export default Dashboard
