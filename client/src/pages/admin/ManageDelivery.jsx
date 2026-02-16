import { useEffect, useState } from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';

const ManageDelivery = () => {
    const [deliveryPersons, setDeliveryPersons] = useState([]);
    const [showAddModal, setShowAddModal] = useState(false);
    const [showEditModal, setShowEditModal] = useState(false);
    const [selectedPerson, setSelectedPerson] = useState(null);
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        phone: '',
        address: '',
        isActive: true
    });

    const backendUrl = import.meta.env.VITE_BACKEND_URL;

    const fetchDeliveryPersons = async () => {
        try {
            const { data } = await axios.get(`${backendUrl}/api/admin/delivery-persons`, { withCredentials: true });
            if (data.success) {
                setDeliveryPersons(data.deliveryPersons);
            }
        } catch {
            toast.error('Failed to fetch delivery persons');
        }
    };

    useEffect(() => {
        fetchDeliveryPersons();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const handleAdd = async () => {
        try {
            const { data } = await axios.post(
                `${backendUrl}/api/admin/delivery-person/add`,
                formData,
                { withCredentials: true }
            );
            if (data.success) {
                toast.success('Delivery person added successfully');
                setShowAddModal(false);
                setFormData({ name: '', email: '', phone: '', address: '', isActive: true });
                fetchDeliveryPersons();
            } else {
                toast.error(data.message);
            }
        } catch {
            toast.error('Failed to add delivery person');
        }
    };

    const handleUpdate = async () => {
        try {
            const { data } = await axios.put(
                `${backendUrl}/api/admin/delivery-person/update`,
                { ...formData, id: selectedPerson._id },
                { withCredentials: true }
            );
            if (data.success) {
                toast.success('Delivery person updated successfully');
                setShowEditModal(false);
                fetchDeliveryPersons();
            } else {
                toast.error(data.message);
            }
        } catch {
            toast.error('Failed to update delivery person');
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm('Are you sure you want to delete this delivery person?')) return;

        try {
            const { data } = await axios.delete(
                `${backendUrl}/api/admin/delivery-person/delete`,
                { data: { id }, withCredentials: true }
            );
            if (data.success) {
                toast.success('Delivery person deleted successfully');
                fetchDeliveryPersons();
            } else {
                toast.error(data.message);
            }
        } catch {
            toast.error('Failed to delete delivery person');
        }
    };

    const openEditModal = (person) => {
        setSelectedPerson(person);
        setFormData({
            name: person.name,
            email: person.email,
            phone: person.phone,
            address: person.address,
            isActive: person.isActive
        });
        setShowEditModal(true);
    };

    return (
        <div className="p-6">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-bold">Manage Delivery Persons</h1>
                <button
                    onClick={() => setShowAddModal(true)}
                    className="bg-primary text-white px-4 py-2 rounded-lg hover:bg-primary/90"
                >
                    + Add Delivery Person
                </button>
            </div>

            {/* Table */}
            <div className="bg-white rounded-lg shadow overflow-x-auto">
                <table className="w-full">
                    <thead className="bg-gray-50 border-b">
                        <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Name</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Email</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Phone</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Address</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Assigned Orders</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {deliveryPersons.map((person) => (
                            <tr key={person._id} className="border-b hover:bg-gray-50">
                                <td className="px-6 py-4">{person.name}</td>
                                <td className="px-6 py-4">{person.email}</td>
                                <td className="px-6 py-4">{person.phone}</td>
                                <td className="px-6 py-4 text-sm text-gray-600">{person.address || '-'}</td>
                                <td className="px-6 py-4">
                                    <span className={`px-2 py-1 text-xs rounded-full ${person.isActive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                                        {person.isActive ? 'Active' : 'Inactive'}
                                    </span>
                                </td>
                                <td className="px-6 py-4">{person.assignedOrders?.length || 0}</td>
                                <td className="px-6 py-4">
                                    <button
                                        onClick={() => openEditModal(person)}
                                        className="text-blue-600 hover:text-blue-800 mr-3"
                                    >
                                        Edit
                                    </button>
                                    <button
                                        onClick={() => handleDelete(person._id)}
                                        className="text-red-600 hover:text-red-800"
                                    >
                                        Delete
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* Add Modal */}
            {showAddModal && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white rounded-lg p-6 w-full max-w-md">
                        <h2 className="text-xl font-bold mb-4">Add Delivery Person</h2>
                        <input
                            type="text"
                            placeholder="Name"
                            value={formData.name}
                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                            className="w-full border px-3 py-2 rounded mb-3"
                        />
                        <input
                            type="email"
                            placeholder="Email"
                            value={formData.email}
                            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                            className="w-full border px-3 py-2 rounded mb-3"
                        />
                        <input
                            type="tel"
                            placeholder="Phone"
                            value={formData.phone}
                            onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                            className="w-full border px-3 py-2 rounded mb-3"
                        />
                        <textarea
                            placeholder="Address"
                            value={formData.address}
                            onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                            className="w-full border px-3 py-2 rounded mb-3"
                            rows="2"
                        />
                        <label className="flex items-center mb-4">
                            <input
                                type="checkbox"
                                checked={formData.isActive}
                                onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
                                className="mr-2"
                            />
                            Active
                        </label>
                        <div className="flex gap-2">
                            <button
                                onClick={handleAdd}
                                className="flex-1 bg-primary text-white py-2 rounded hover:bg-primary/90"
                            >
                                Add
                            </button>
                            <button
                                onClick={() => {
                                    setShowAddModal(false);
                                    setFormData({ name: '', email: '', phone: '', address: '', isActive: true });
                                }}
                                className="flex-1 bg-gray-300 py-2 rounded hover:bg-gray-400"
                            >
                                Cancel
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Edit Modal */}
            {showEditModal && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white rounded-lg p-6 w-full max-w-md">
                        <h2 className="text-xl font-bold mb-4">Edit Delivery Person</h2>
                        <input
                            type="text"
                            placeholder="Name"
                            value={formData.name}
                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                            className="w-full border px-3 py-2 rounded mb-3"
                        />
                        <input
                            type="email"
                            placeholder="Email"
                            value={formData.email}
                            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                            className="w-full border px-3 py-2 rounded mb-3"
                        />
                        <input
                            type="tel"
                            placeholder="Phone"
                            value={formData.phone}
                            onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                            className="w-full border px-3 py-2 rounded mb-3"
                        />
                        <textarea
                            placeholder="Address"
                            value={formData.address}
                            onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                            className="w-full border px-3 py-2 rounded mb-3"
                            rows="2"
                        />
                        <label className="flex items-center mb-4">
                            <input
                                type="checkbox"
                                checked={formData.isActive}
                                onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
                                className="mr-2"
                            />
                            Active
                        </label>
                        <div className="flex gap-2">
                            <button
                                onClick={handleUpdate}
                                className="flex-1 bg-primary text-white py-2 rounded hover:bg-primary/90"
                            >
                                Update
                            </button>
                            <button
                                onClick={() => setShowEditModal(false)}
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

export default ManageDelivery;
