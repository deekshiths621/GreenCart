import React, { useEffect, useState } from 'react'
import { useAppContext } from '../../context/AppContext'
import toast from 'react-hot-toast'

const SellerOrders = () => {
    const { axios } = useAppContext()
    const [orders, setOrders] = useState([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        const fetchOrders = async () => {
            try {
                // Add your seller orders API endpoint here
                setOrders([])
                setLoading(false)
            } catch (error) {
                toast.error(error.message)
                setLoading(false)
            }
        }

        fetchOrders()
    }, [])

    if (loading) {
        return <div className='text-center py-10'>Loading orders...</div>
    }

    return (
        <div className='space-y-6'>
            <h2 className='text-2xl font-bold text-gray-800'>Orders</h2>
            
            {orders.length === 0 ? (
                <div className='bg-white rounded-lg shadow border border-gray-200 p-8 text-center'>
                    <p className='text-gray-500'>No orders found</p>
                </div>
            ) : (
                <div className='bg-white rounded-lg shadow border border-gray-200 overflow-hidden'>
                    <div className='overflow-x-auto'>
                        <table className='w-full'>
                            <thead className='bg-gray-50 border-b border-gray-200'>
                                <tr>
                                    <th className='text-left p-4 text-gray-700 font-semibold'>Order ID</th>
                                    <th className='text-left p-4 text-gray-700 font-semibold'>Customer</th>
                                    <th className='text-left p-4 text-gray-700 font-semibold'>Amount</th>
                                    <th className='text-left p-4 text-gray-700 font-semibold'>Status</th>
                                    <th className='text-left p-4 text-gray-700 font-semibold'>Date</th>
                                </tr>
                            </thead>
                            <tbody>
                                {orders.map((order) => (
                                    <tr key={order._id} className='border-b border-gray-100 hover:bg-gray-50'>
                                        <td className='p-4 text-sm'>{order._id}</td>
                                        <td className='p-4 text-sm'>{order.customerName}</td>
                                        <td className='p-4 text-sm font-semibold'>₹{order.amount}</td>
                                        <td className='p-4 text-sm'>
                                            <span className='bg-yellow-100 text-yellow-800 px-3 py-1 rounded-full text-xs font-medium'>
                                                {order.status}
                                            </span>
                                        </td>
                                        <td className='p-4 text-sm'>{new Date(order.date).toLocaleDateString()}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}
        </div>
    )
}

export default SellerOrders
