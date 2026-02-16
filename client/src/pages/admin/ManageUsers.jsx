import { useEffect, useState } from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';

const ManageUsers = () => {
    const [users, setUsers] = useState([]);
    const [expandedUser, setExpandedUser] = useState(null);
    const [userStats, setUserStats] = useState(null);

    const backendUrl = import.meta.env.VITE_BACKEND_URL;

    const fetchUsers = async () => {
        try {
            const { data } = await axios.get(`${backendUrl}/api/admin/users`, { withCredentials: true });
            if (data.success) {
                setUsers(data.users);
            }
        } catch {
            toast.error('Failed to fetch users');
        }
    };

    useEffect(() => {
        fetchUsers();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const handleBlockUser = async (userId, isBlocked) => {
        try {
            const { data } = await axios.put(
                `${backendUrl}/api/admin/user/block`,
                { userId, isBlocked: !isBlocked },
                { withCredentials: true }
            );
            if (data.success) {
                toast.success(data.message);
                fetchUsers();
            } else {
                toast.error(data.message);
            }
        } catch {
            toast.error('Failed to update user status');
        }
    };

    const handleDeleteUser = async (userId, userName) => {
        if (!window.confirm(`Are you sure you want to delete ${userName}? This action cannot be undone.`)) return;

        try {
            const { data } = await axios.delete(
                `${backendUrl}/api/admin/user/delete`,
                { data: { userId }, withCredentials: true }
            );
            if (data.success) {
                toast.success(data.message);
                fetchUsers();
                if (expandedUser === userId) {
                    setExpandedUser(null);
                    setUserStats(null);
                }
            } else {
                toast.error(data.message);
            }
        } catch {
            toast.error('Failed to delete user');
        }
    };

    const handleViewOrders = async (userId) => {
        if (expandedUser === userId) {
            setExpandedUser(null);
            setUserStats(null);
            return;
        }

        try {
            const { data } = await axios.get(`${backendUrl}/api/admin/user/stats/${userId}`, { withCredentials: true });
            if (data.success) {
                setExpandedUser(userId);
                setUserStats(data.stats);
            } else {
                toast.error(data.message);
            }
        } catch {
            toast.error('Failed to fetch user statistics');
        }
    };

    const formatDate = (date) => {
        return new Date(date).toLocaleDateString('en-US', { 
            year: 'numeric', 
            month: 'short', 
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    const formatCurrency = (amount) => {
        return `₹${amount.toFixed(2)}`;
    };

    return (
        <div className="p-6">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-bold">Manage Users</h1>
                <div className="text-sm text-gray-600">
                    Total Users: <span className="font-semibold">{users.length}</span>
                </div>
            </div>

            <div className="bg-white rounded-lg shadow overflow-hidden">
                <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                        <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                User Details
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Email
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Status
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Joined Date
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Actions
                            </th>
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                        {users.map((user) => (
                            <>
                                <tr key={user._id} className="hover:bg-gray-50">
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="text-sm font-medium text-gray-900">{user.name}</div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="text-sm text-gray-900">{user.email}</div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                                            user.isBlocked 
                                                ? 'bg-red-100 text-red-800' 
                                                : 'bg-green-100 text-green-800'
                                        }`}>
                                            {user.isBlocked ? 'Blocked' : 'Active'}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                        {formatDate(user.createdAt)}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
                                        <button
                                            onClick={() => handleViewOrders(user._id)}
                                            className={`px-3 py-1 rounded ${
                                                expandedUser === user._id 
                                                    ? 'bg-blue-600 text-white' 
                                                    : 'bg-blue-100 text-blue-700 hover:bg-blue-200'
                                            }`}
                                        >
                                            {expandedUser === user._id ? 'Hide' : 'View'} Orders
                                        </button>
                                        <button
                                            onClick={() => handleBlockUser(user._id, user.isBlocked)}
                                            className={`px-3 py-1 rounded ${
                                                user.isBlocked 
                                                    ? 'bg-green-100 text-green-700 hover:bg-green-200' 
                                                    : 'bg-yellow-100 text-yellow-700 hover:bg-yellow-200'
                                            }`}
                                        >
                                            {user.isBlocked ? 'Unblock' : 'Block'}
                                        </button>
                                        <button
                                            onClick={() => handleDeleteUser(user._id, user.name)}
                                            className="px-3 py-1 bg-red-100 text-red-700 rounded hover:bg-red-200"
                                        >
                                            Delete
                                        </button>
                                    </td>
                                </tr>
                                {expandedUser === user._id && userStats && (
                                    <tr>
                                        <td colSpan="5" className="px-6 py-4 bg-gray-50">
                                            <div className="space-y-4">
                                                <div className="flex justify-between items-center mb-4 p-4 bg-white rounded-lg shadow-sm">
                                                    <div>
                                                        <p className="text-sm text-gray-600">Total Orders</p>
                                                        <p className="text-2xl font-bold text-gray-900">{userStats.totalOrders}</p>
                                                    </div>
                                                    <div>
                                                        <p className="text-sm text-gray-600">Total Spent</p>
                                                        <p className="text-2xl font-bold text-green-600">
                                                            {formatCurrency(userStats.totalPurchaseCost)}
                                                        </p>
                                                    </div>
                                                </div>

                                                {userStats.orders.length > 0 ? (
                                                    <div className="space-y-3">
                                                        <h4 className="font-semibold text-gray-800">Order History</h4>
                                                        {userStats.orders.map((order) => (
                                                            <div key={order._id} className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
                                                                <div className="flex justify-between items-start mb-3">
                                                                    <div>
                                                                        <p className="text-sm text-gray-600">
                                                                            Order ID: <span className="font-mono font-medium">{order._id}</span>
                                                                        </p>
                                                                        <p className="text-xs text-gray-500 mt-1">
                                                                            {formatDate(order.createdAt)}
                                                                        </p>
                                                                    </div>
                                                                    <div className="text-right">
                                                                        <p className="text-lg font-bold text-gray-900">
                                                                            {formatCurrency(order.amount)}
                                                                        </p>
                                                                        <span className={`inline-flex mt-1 px-2 py-1 text-xs font-semibold rounded-full ${
                                                                            order.status === 'Delivered' 
                                                                                ? 'bg-green-100 text-green-800' 
                                                                                : order.status === 'Cancelled'
                                                                                ? 'bg-red-100 text-red-800'
                                                                                : 'bg-blue-100 text-blue-800'
                                                                        }`}>
                                                                            {order.status}
                                                                        </span>
                                                                    </div>
                                                                </div>

                                                                {order.address && (
                                                                    <div className="mb-3 p-2 bg-gray-50 rounded text-xs text-gray-700">
                                                                        <p className="font-medium mb-1">Delivery Address:</p>
                                                                        <p>
                                                                            {order.address.street}, {order.address.city}, {order.address.state} - {order.address.zipcode}
                                                                        </p>
                                                                    </div>
                                                                )}

                                                                <div className="space-y-2">
                                                                    <p className="text-xs font-medium text-gray-600">Items:</p>
                                                                    {order.items.map((item, idx) => (
                                                                        <div key={idx} className="flex justify-between items-center text-sm bg-gray-50 p-2 rounded">
                                                                            <div className="flex items-center gap-3">
                                                                                {item.product?.image && (
                                                                                    <img 
                                                                                        src={item.product.image} 
                                                                                        alt={item.product.name}
                                                                                        className="w-10 h-10 object-cover rounded"
                                                                                    />
                                                                                )}
                                                                                <div>
                                                                                    <p className="font-medium text-gray-800">
                                                                                        {item.product?.name || 'Product Deleted'}
                                                                                    </p>
                                                                                    <p className="text-xs text-gray-500">
                                                                                        Quantity: {item.quantity}
                                                                                    </p>
                                                                                </div>
                                                                            </div>
                                                                            <p className="font-semibold text-gray-900">
                                                                                {formatCurrency(item.product?.price * item.quantity || 0)}
                                                                            </p>
                                                                        </div>
                                                                    ))}
                                                                </div>
                                                            </div>
                                                        ))}
                                                    </div>
                                                ) : (
                                                    <div className="text-center py-8 text-gray-500">
                                                        No orders found for this user
                                                    </div>
                                                )}
                                            </div>
                                        </td>
                                    </tr>
                                )}
                            </>
                        ))}
                    </tbody>
                </table>

                {users.length === 0 && (
                    <div className="text-center py-12 text-gray-500">
                        No users found
                    </div>
                )}
            </div>
        </div>
    );
};

export default ManageUsers;
