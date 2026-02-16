import React, { useEffect, useState } from 'react'
import { useAppContext } from '../context/AppContext'
import { dummyOrders } from '../assets/assets'
import toast from 'react-hot-toast'

const MyOrders = () => {
    const [myOrders, setMyOrders] = useState([]) 
    const { currency, axios, user } = useAppContext()

    const fetchMyOrders = async () => {
        try {
            const { data } = await axios.get('/api/order/user')
            if (data.success) {
                setMyOrders(data.orders)
            }
        } catch (error) {
            console.error(error)
            setMyOrders(dummyOrders) 
        }
    }

    const handleDeleteOrder = async (orderId) => {
        if (!window.confirm('Are you sure you want to delete this order?')) {
            return;
        }

        try {
            const { data } = await axios.post('/api/order/delete', { orderId });
            if (data.success) {
                toast.success('Order deleted successfully');
                fetchMyOrders(); // Refresh the orders list
            } else {
                toast.error(data.message);
            }
        } catch (error) {
            console.error(error);
            toast.error('Failed to delete order');
        }
    }

    useEffect(() => {
        if (user) {
            fetchMyOrders()
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [user])

    return (
        <div className='mt-16 pb-16 px-4 md:px-0 container mx-auto'>
            <div className='flex flex-col items-start mb-8'>
                <p className='text-2xl font-medium uppercase'>My orders</p>
                <div className='w-16 h-0.5 bg-primary rounded-full'></div>
            </div>

            {myOrders.length > 0 ? (
                myOrders.map((order, index) => (
                    <div key={index} className='border border-gray-300 rounded-lg mb-10 p-4 py-5 max-w-4xl shadow-sm'>
                        <div className='flex justify-between md:items-center text-gray-500 md:font-medium max-md:flex-col border-b border-gray-200 pb-3 mb-3 text-sm'>
                            <span>OrderId: <span className='text-gray-800 font-mono'>{order._id}</span></span>
                            <span>Payment: <span className='text-gray-800'>{order.paymentType}</span></span>
                            <span>Total: <span className='text-primary font-bold'>{currency}{order.amount}</span></span>
                            <button 
                                onClick={() => handleDeleteOrder(order._id)}
                                className='text-red-500 hover:text-red-700 border border-red-500 hover:border-red-700 px-4 py-1.5 rounded text-sm font-medium transition'
                                title='Delete Order'
                            >
                                Delete
                            </button>
                        </div>

                        {order.items.map((item, itemIndex) => (
                            <div key={itemIndex}
                                className={`flex flex-col md:flex-row md:items-center justify-between p-4 py-5 gap-4 w-full ${
                                    order.items.length !== itemIndex + 1 ? "border-b border-gray-100" : ""
                                }`}>
                                
                                <div className='flex items-center'>
                                    <div className='bg-gray-100 p-2 rounded-lg'>
                                        <img 
                                            src={item.product?.image?.[0] || ""} 
                                            alt={item.product?.name || "Product"} 
                                            className='w-16 h-16 object-contain' 
                                        />
                                    </div>
                                    <div className='ml-4'>
                                        <h2 className='text-lg font-medium text-gray-800'>{item.product?.name || "Deleted Product"}</h2>
                                        <p className='text-sm text-gray-500'>Category: {item.product?.category || "N/A"}</p>
                                    </div>
                                </div>

                                <div className='text-sm text-gray-600'>
                                    <p>Quantity: {item.quantity || 1}</p>
                                    <p>Status: <span className='text-green-600 font-medium'>{order.status}</span></p>
                                    <p>Date: {new Date(order.createdAt).toLocaleDateString()}</p>
                                </div>

                                <p className='text-primary text-lg font-semibold'>
                                    {currency}{(item.product?.offerPrice || 0) * (item.quantity || 1)}
                                </p>
                            </div>
                        ))}
                    </div>
                ))
            ) : (
                <div className='text-center py-20'>
                    <p className='text-gray-500'>You have no orders yet.</p>
                </div>
            )}
        </div>
    )
}

export default MyOrders