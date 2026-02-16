import { useEffect, useState } from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';

const ManageOrders = () => {
    const [orders, setOrders] = useState([]);
    const [selectedOrder, setSelectedOrder] = useState(null);
    const [showStatusModal, setShowStatusModal] = useState(false);
    const [showAssignModal, setShowAssignModal] = useState(false);
    const [deliveryPersons, setDeliveryPersons] = useState([]);
    const [newStatus, setNewStatus] = useState('');
    const [selectedDeliveryPerson, setSelectedDeliveryPerson] = useState('');

    const backendUrl = import.meta.env.VITE_BACKEND_URL;

    const statusOptions = [
        'Order Placed',
        'Approved',
        'Rejected',
        'Packing',
        'Shipped',
        'Out for delivery',
        'Delivered'
    ];

    const fetchOrders = async () => {
        try {
            const { data } = await axios.get(`${backendUrl}/api/admin/orders`, { withCredentials: true });
            if (data.success) {
                setOrders(data.orders);
            }
        } catch {
            toast.error('Failed to fetch orders');
        }
    };

    const fetchDeliveryPersons = async () => {
        try {
            const { data } = await axios.get(`${backendUrl}/api/admin/delivery-persons`, { withCredentials: true });
            if (data.success) {
                setDeliveryPersons(data.deliveryPersons.filter(p => p.isActive));
            }
        } catch {
            console.error('Failed to fetch delivery persons');
        }
    };

    useEffect(() => {
        fetchOrders();
        fetchDeliveryPersons();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const handleApprove = async (orderId) => {
        try {
            const { data } = await axios.put(
                `${backendUrl}/api/admin/order/approve`,
                { orderId },
                { withCredentials: true }
            );
            if (data.success) {
                toast.success('Order approved successfully');
                fetchOrders();
            } else {
                toast.error(data.message);
            }
        } catch {
            toast.error('Failed to approve order');
        }
    };

    const handleReject = async (orderId) => {
        const reason = prompt('Enter rejection reason:');
        if (!reason) return;

        try {
            const { data } = await axios.put(
                `${backendUrl}/api/admin/order/reject`,
                { orderId, reason },
                { withCredentials: true }
            );
            if (data.success) {
                toast.success('Order rejected successfully');
                fetchOrders();
            } else {
                toast.error(data.message);
            }
        } catch {
            toast.error('Failed to reject order');
        }
    };

    const handleUpdateStatus = async () => {
        try {
            const { data } = await axios.put(
                `${backendUrl}/api/admin/order/update-status`,
                { orderId: selectedOrder._id, status: newStatus },
                { withCredentials: true }
            );
            if (data.success) {
                toast.success('Order status updated successfully');
                setShowStatusModal(false);
                fetchOrders();
            } else {
                toast.error(data.message);
            }
        } catch {
            toast.error('Failed to update order status');
        }
    };

    const handleAssignDelivery = async () => {
        try {
            const { data } = await axios.put(
                `${backendUrl}/api/admin/order/assign-delivery`,
                { orderId: selectedOrder._id, deliveryPersonId: selectedDeliveryPerson },
                { withCredentials: true }
            );
            if (data.success) {
                toast.success('Delivery person assigned successfully');
                setShowAssignModal(false);
                fetchOrders();
            } else {
                toast.error(data.message);
            }
        } catch {
            toast.error('Failed to assign delivery person');
        }
    };

    const openStatusModal = (order) => {
        setSelectedOrder(order);
        setNewStatus(order.status);
        setShowStatusModal(true);
    };

    const openAssignModal = (order) => {
        setSelectedOrder(order);
        setSelectedDeliveryPerson(order.deliveryPerson?._id || '');
        setShowAssignModal(true);
    };

    return (
        <div className="p-6">
            <h1 className="text-2xl font-bold mb-6">Manage Orders</h1>

            <div className="bg-white rounded-lg shadow overflow-x-auto">
                <table className="w-full">
                    <thead className="bg-gray-50 border-b">
                        <tr>
                            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Order ID</th>
                            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Customer</th>
                            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Amount</th>
                            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Approval</th>
                            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Delivery Person</th>
                            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {orders.map((order) => (
                            <tr key={order._id} className="border-b hover:bg-gray-50">
                                <td className="px-4 py-4 text-sm font-mono">{order._id.slice(-8)}</td>
                                <td className="px-4 py-4">
                                    <div className="text-sm">{order.userId?.name}</div>
                                    <div className="text-xs text-gray-500">{order.userId?.email}</div>
                                </td>
                                <td className="px-4 py-4">₹{order.amount}</td>
                                <td className="px-4 py-4">
                                    <span className="px-2 py-1 text-xs rounded-full bg-blue-100 text-blue-800">
                                        {order.status}
                                    </span>
                                </td>
                                <td className="px-4 py-4">
                                    {order.isApproved ? (
                                        <span className="px-2 py-1 text-xs rounded-full bg-green-100 text-green-800">Approved</span>
                                    ) : order.isRejected ? (
                                        <span className="px-2 py-1 text-xs rounded-full bg-red-100 text-red-800">Rejected</span>
                                    ) : (
                                        <span className="px-2 py-1 text-xs rounded-full bg-yellow-100 text-yellow-800">Pending</span>
                                    )}
                                </td>
                                <td className="px-4 py-4 text-sm">
                                    {order.deliveryPerson?.name || <span className="text-gray-400">Not assigned</span>}
                                </td>
                                <td className="px-4 py-4">
                                    <div className="flex flex-col gap-1">
                                        {!order.isApproved && !order.isRejected && (
                                            <>
                                                <button
                                                    onClick={() => handleApprove(order._id)}
                                                    className="text-xs text-green-600 hover:text-green-800"
                                                >
                                                    Approve
                                                </button>
                                                <button
                                                    onClick={() => handleReject(order._id)}
                                                    className="text-xs text-red-600 hover:text-red-800"
                                                >
                                                    Reject
                                                </button>
                                            </>
                                        )}
                                        <button
                                            onClick={() => openStatusModal(order)}
                                            className="text-xs text-blue-600 hover:text-blue-800"
                                        >
                                            Update Status
                                        </button>
                                        <button
                                            onClick={() => openAssignModal(order)}
                                            className="text-xs text-purple-600 hover:text-purple-800"
                                        >
                                            Assign Delivery
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* Status Update Modal */}
            {showStatusModal && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white rounded-lg p-6 w-full max-w-md">
                        <h2 className="text-xl font-bold mb-4">Update Order Status</h2>
                        <p className="text-sm text-gray-600 mb-4">Order ID: {selectedOrder._id}</p>
                        <select
                            value={newStatus}
                            onChange={(e) => setNewStatus(e.target.value)}
                            className="w-full border px-3 py-2 rounded mb-4"
                        >
                            {statusOptions.map((status) => (
                                <option key={status} value={status}>
                                    {status}
                                </option>
                            ))}
                        </select>
                        <div className="flex gap-2">
                            <button
                                onClick={handleUpdateStatus}
                                className="flex-1 bg-primary text-white py-2 rounded hover:bg-primary/90"
                            >
                                Update
                            </button>
                            <button
                                onClick={() => setShowStatusModal(false)}
                                className="flex-1 bg-gray-300 py-2 rounded hover:bg-gray-400"
                            >
                                Cancel
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Assign Delivery Modal */}
            {showAssignModal && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white rounded-lg p-6 w-full max-w-md">
                        <h2 className="text-xl font-bold mb-4">Assign Delivery Person</h2>
                        <p className="text-sm text-gray-600 mb-4">Order ID: {selectedOrder._id}</p>
                        <select
                            value={selectedDeliveryPerson}
                            onChange={(e) => setSelectedDeliveryPerson(e.target.value)}
                            className="w-full border px-3 py-2 rounded mb-4"
                        >
                            <option value="">Select Delivery Person</option>
                            {deliveryPersons.map((person) => (
                                <option key={person._id} value={person._id}>
                                    {person.name} - {person.phone}
                                </option>
                            ))}
                        </select>
                        <div className="flex gap-2">
                            <button
                                onClick={handleAssignDelivery}
                                className="flex-1 bg-primary text-white py-2 rounded hover:bg-primary/90"
                                disabled={!selectedDeliveryPerson}
                            >
                                Assign
                            </button>
                            <button
                                onClick={() => setShowAssignModal(false)}
                                className="flex-1 bg-gray-300 py-2 rounded hover:bg-gray-400"
                            >
                                Cancel
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ManageOrders;
