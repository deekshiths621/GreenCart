import React, { useState } from 'react'
import { useAppContext } from '../context/AppContext'
import toast from 'react-hot-toast'

const TrackOrder = () => {
  const { user, axios } = useAppContext();
  const [orderId, setOrderId] = useState('');
  const [orderDetails, setOrderDetails] = useState(null);
  const [loading, setLoading] = useState(false);

  const trackOrder = async (e) => {
    e.preventDefault();
    if (!orderId.trim()) {
      toast.error('Please enter an order ID');
      return;
    }

    // Validate order ID format (MongoDB ObjectId should be 24 characters)
    if (orderId.trim().length !== 24) {
      toast.error('Invalid Order ID format. Order ID should be 24 characters long.');
      return;
    }

    setLoading(true);
    try {
      const { data } = await axios.get(`/api/order/${orderId.trim()}`);
      if (data.success) {
        setOrderDetails(data.order);
        toast.success('Order found!');
      } else {
        toast.error(data.message || 'Order not found');
        setOrderDetails(null);
      }
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to track order');
      setOrderDetails(null);
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'Order Placed':
        return 'bg-blue-100 text-blue-800';
      case 'Packing':
        return 'bg-yellow-100 text-yellow-800';
      case 'Shipped':
        return 'bg-purple-100 text-purple-800';
      case 'Out for delivery':
        return 'bg-orange-100 text-orange-800';
      case 'Delivered':
        return 'bg-green-100 text-green-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="min-h-[60vh] py-10">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-3xl font-semibold mb-8">Track Your Order</h1>

        <div className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm mb-6">
          <form onSubmit={trackOrder} className="flex gap-3">
            <input
              type="text"
              value={orderId}
              onChange={(e) => setOrderId(e.target.value)}
              placeholder="Enter your Order ID"
              className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
            />
            <button
              type="submit"
              disabled={loading}
              className="px-8 py-3 bg-primary hover:bg-primary-dull transition text-white rounded-lg font-medium disabled:opacity-50"
            >
              {loading ? 'Tracking...' : 'Track'}
            </button>
          </form>
          <p className="text-sm text-gray-500 mt-3">
            Enter your order ID to track the current status of your order
          </p>
        </div>

        {orderDetails && (
          <div className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-xl font-semibold text-gray-800">Order Details</h2>
                <p className="text-sm text-gray-500 mt-1">Order ID: {orderDetails._id}</p>
              </div>
              <span className={`px-4 py-2 rounded-full text-sm font-medium ${getStatusColor(orderDetails.status)}`}>
                {orderDetails.status}
              </span>
            </div>

            <div className="border-t border-gray-200 pt-4 space-y-3">
              <div className="flex justify-between">
                <span className="text-gray-600">Order Date:</span>
                <span className="font-medium">{new Date(orderDetails.createdAt).toLocaleDateString()}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Total Amount:</span>
                <span className="font-medium">₹{orderDetails.totalAmount}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Payment Method:</span>
                <span className="font-medium capitalize">{orderDetails.paymentMethod}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Payment Status:</span>
                <span className={`font-medium ${orderDetails.payment ? 'text-green-600' : 'text-orange-600'}`}>
                  {orderDetails.payment ? 'Paid' : 'Pending'}
                </span>
              </div>
            </div>

            <div className="border-t border-gray-200 mt-4 pt-4">
              <h3 className="font-semibold text-gray-800 mb-3">Delivery Address</h3>
              {orderDetails.address ? (
                <>
                  <p className="text-gray-600">{orderDetails.address.fullName}</p>
                  <p className="text-gray-600">{orderDetails.address.street}</p>
                  <p className="text-gray-600">
                    {orderDetails.address.city}, {orderDetails.address.state} - {orderDetails.address.zipcode}
                  </p>
                  <p className="text-gray-600 mt-1">Phone: {orderDetails.address.phone}</p>
                </>
              ) : (
                <p className="text-gray-500">Address not available</p>
              )}
            </div>

            <div className="border-t border-gray-200 mt-4 pt-4">
              <h3 className="font-semibold text-gray-800 mb-3">Order Items ({orderDetails.items.length})</h3>
              <div className="space-y-3">
                {orderDetails.items.map((item, index) => (
                  <div key={index} className="flex items-center gap-4 p-3 bg-gray-50 rounded-lg">
                    {item.image ? (
                      <img src={item.image} alt={item.name} className="w-16 h-16 object-cover rounded" />
                    ) : (
                      <div className="w-16 h-16 bg-gray-200 rounded flex items-center justify-center text-gray-400">
                        No Image
                      </div>
                    )}
                    <div className="flex-1">
                      <h4 className="font-medium text-gray-800">{item.name}</h4>
                      <p className="text-sm text-gray-500">Quantity: {item.quantity}</p>
                    </div>
                    <span className="font-medium">₹{item.price * item.quantity}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {!user && (
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mt-6">
            <p className="text-blue-800 text-center">
              Please login to see all your orders or enter an order ID to track
            </p>
          </div>
        )}
      </div>
    </div>
  )
}

export default TrackOrder
