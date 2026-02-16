import React, { useEffect, useState } from 'react'
import { useAppContext } from '../../context/AppContext'
import { assets, dummyOrders } from '../../assets/assets'
import toast from 'react-hot-toast'

const Orders = () => {
    const {currency, axios} = useAppContext()
    const [orders, setOrders] = useState([])
    const [filteredOrders, setFilteredOrders] = useState([])
    const [fromDate, setFromDate] = useState('')
    const [toDate, setToDate] = useState('')

    const fetchOrders = async () =>{
        try {
            const { data } = await axios.get('/api/order/seller');
            if(data.success){
                setOrders(data.orders)
                setFilteredOrders(data.orders)
            }else{
                toast.error(data.message)
            }
        } catch (error) {
            toast.error(error.message)
        }
    };

    const applyDateFilter = () => {
        let filtered = [...orders];

        if (fromDate) {
            const fromDateTime = new Date(fromDate).setHours(0, 0, 0, 0);
            filtered = filtered.filter(order => {
                const orderDate = new Date(order.createdAt).setHours(0, 0, 0, 0);
                return orderDate >= fromDateTime;
            });
        }

        if (toDate) {
            const toDateTime = new Date(toDate).setHours(23, 59, 59, 999);
            filtered = filtered.filter(order => {
                const orderDate = new Date(order.createdAt).getTime();
                return orderDate <= toDateTime;
            });
        }

        setFilteredOrders(filtered);
    };

    const clearFilters = () => {
        setFromDate('');
        setToDate('');
        setFilteredOrders(orders);
    };

    useEffect(() => {
        applyDateFilter();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [fromDate, toDate, orders]);


    useEffect(()=>{
        fetchOrders();
    },[])


  return (
    <div className='no-scrollbar flex-1 h-[95vh] overflow-y-scroll'>
    <div className="md:p-10 p-4 space-y-4">
            <div className="flex justify-between items-center mb-4">
                <h2 className="text-lg font-medium">Orders List</h2>
                <div className="text-sm text-gray-600">
                    Total Orders: <span className="font-semibold">{filteredOrders.length}</span>
                </div>
            </div>

            {/* Date Filter Section */}
            <div className="bg-white p-4 rounded-lg border border-gray-300 mb-4">
                <div className="flex flex-wrap items-end gap-4">
                    <div className="flex-1 min-w-[200px]">
                        <label className="block text-sm font-medium text-gray-700 mb-1">From Date</label>
                        <input
                            type="date"
                            value={fromDate}
                            onChange={(e) => setFromDate(e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                    </div>
                    <div className="flex-1 min-w-[200px]">
                        <label className="block text-sm font-medium text-gray-700 mb-1">To Date</label>
                        <input
                            type="date"
                            value={toDate}
                            onChange={(e) => setToDate(e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                    </div>
                    <button
                        onClick={clearFilters}
                        className="px-4 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300 transition-colors font-medium"
                    >
                        Clear Filters
                    </button>
                </div>
            </div>

            {filteredOrders.length === 0 ? (
                <div className="text-center py-12 text-gray-500">
                    {orders.length === 0 ? 'No orders found' : 'No orders match the selected date range'}
                </div>
            ) : (
                filteredOrders.map((order, index) => (
                    <div key={index} className="flex flex-col md:items-center md:flex-row gap-5 justify-between p-5 max-w-4xl rounded-md border border-gray-300">

                        <div className="flex gap-5 max-w-80">
                            <img className="w-12 h-12 object-cover" src={assets.box_icon} alt="boxIcon" />
                            <div>
                                {order.items && order.items.length > 0 ? (
                                    order.items.map((item, idx) => (
                                        <div key={idx} className="flex flex-col">
                                            <p className="font-medium">
                                                {item.product ? item.product.name : 'Product Deleted'}{" "} 
                                                <span className="text-primary">x {item.quantity}</span>
                                            </p>
                                        </div>
                                    ))
                                ) : (
                                    <p className="text-gray-500">No items</p>
                                )}
                            </div>
                        </div>

                        <div className="text-sm md:text-base text-black/60">
                            {order.address ? (
                                <>
                                    <p className='text-black/80'>
                                        {order.address.firstName} {order.address.lastName}
                                    </p>
                                    <p>{order.address.street}, {order.address.city}</p>
                                    <p>{order.address.state}, {order.address.zipcode}, {order.address.country}</p>
                                    <p>{order.address.phone}</p>
                                </>
                            ) : (
                                <p className="text-gray-500">Address not available</p>
                            )}
                        </div>

                        <p className="font-medium text-lg my-auto">
                            {currency}{order.amount}
                        </p>

                        <div className="flex flex-col text-sm md:text-base text-black/60">
                            <p>Method: {order.paymentType || 'N/A'}</p>
                            <p>Date: {new Date(order.createdAt).toLocaleDateString('en-US', { 
                                year: 'numeric', 
                                month: 'short', 
                                day: 'numeric'
                            })}</p>
                            <p>Time: {new Date(order.createdAt).toLocaleTimeString('en-US', {
                                hour: '2-digit',
                                minute: '2-digit',
                                hour12: true
                            })}</p>
                            <p>Payment: {order.isPaid ? "Paid" : "Pending"}</p>
                            <p>Status: <span className="font-medium text-gray-800">{order.status || 'Order Placed'}</span></p>
                        </div>
                    </div>
                ))
            )}
        </div>
        </div>
  )
}

export default Orders
