import { useEffect, useState } from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';

const ManageCategories = () => {
    const [categories, setCategories] = useState([]);
    const [showAddModal, setShowAddModal] = useState(false);
    const [showEditModal, setShowEditModal] = useState(false);
    const [selectedCategory, setSelectedCategory] = useState(null);
    const [formData, setFormData] = useState({
        name: '',
        description: '',
        image: '',
        isActive: true
    });

    const backendUrl = import.meta.env.VITE_BACKEND_URL;

    const fetchCategories = async () => {
        try {
            const { data } = await axios.get(`${backendUrl}/api/admin/categories`, { withCredentials: true });
            if (data.success) {
                setCategories(data.categories);
            }
        } catch {
            toast.error('Failed to fetch categories');
        }
    };

    useEffect(() => {
        fetchCategories();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const handleAddCategory = async () => {
        try {
            const { data } = await axios.post(
                `${backendUrl}/api/admin/category/add`,
                formData,
                { withCredentials: true }
            );
            if (data.success) {
                toast.success('Category added successfully');
                setShowAddModal(false);
                setFormData({ name: '', description: '', image: '', isActive: true });
                fetchCategories();
            } else {
                toast.error(data.message);
            }
        } catch {
            toast.error('Failed to add category');
        }
    };

    const handleUpdateCategory = async () => {
        try {
            const { data } = await axios.put(
                `${backendUrl}/api/admin/category/update`,
                { ...formData, id: selectedCategory._id },
                { withCredentials: true }
            );
            if (data.success) {
                toast.success('Category updated successfully');
                setShowEditModal(false);
                fetchCategories();
            } else {
                toast.error(data.message);
            }
        } catch {
            toast.error('Failed to update category');
        }
    };

    const handleDeleteCategory = async (id) => {
        if (!window.confirm('Are you sure you want to delete this category?')) return;

        try {
            const { data } = await axios.delete(
                `${backendUrl}/api/admin/category/delete`,
                { data: { id }, withCredentials: true }
            );
            if (data.success) {
                toast.success('Category deleted successfully');
                fetchCategories();
            } else {
                toast.error(data.message);
            }
        } catch {
            toast.error('Failed to delete category');
        }
    };

    const openEditModal = (category) => {
        setSelectedCategory(category);
        setFormData({
            name: category.name,
            description: category.description,
            image: category.image,
            isActive: category.isActive
        });
        setShowEditModal(true);
    };

    return (
        <div className="p-6">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-bold">Manage Categories</h1>
                <button
                    onClick={() => setShowAddModal(true)}
                    className="bg-primary text-white px-4 py-2 rounded-lg hover:bg-primary/90"
                >
                    + Add Category
                </button>
            </div>

            {/* Categories Table */}
            <div className="bg-white rounded-lg shadow overflow-x-auto">
                <table className="w-full">
                    <thead className="bg-gray-50 border-b">
                        <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Image</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Name</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Description</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {categories.map((category) => (
                            <tr key={category._id} className="border-b hover:bg-gray-50">
                                <td className="px-6 py-4">
                                    {category.image ? (
                                        <img src={category.image} alt={category.name} className="w-12 h-12 rounded object-cover" />
                                    ) : (
                                        <div className="w-12 h-12 bg-gray-200 rounded"></div>
                                    )}
                                </td>
                                <td className="px-6 py-4">{category.name}</td>
                                <td className="px-6 py-4 text-sm text-gray-600">{category.description || '-'}</td>
                                <td className="px-6 py-4">
                                    <span className={`px-2 py-1 text-xs rounded-full ${category.isActive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                                        {category.isActive ? 'Active' : 'Inactive'}
                                    </span>
                                </td>
                                <td className="px-6 py-4">
                                    <button
                                        onClick={() => openEditModal(category)}
                                        className="text-blue-600 hover:text-blue-800 mr-3"
                                    >
                                        Edit
                                    </button>
                                    <button
                                        onClick={() => handleDeleteCategory(category._id)}
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
                        <h2 className="text-xl font-bold mb-4">Add Category</h2>
                        <input
                            type="text"
                            placeholder="Category Name"
                            value={formData.name}
                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                            className="w-full border px-3 py-2 rounded mb-3"
                        />
                        <textarea
                            placeholder="Description"
                            value={formData.description}
                            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                            className="w-full border px-3 py-2 rounded mb-3"
                            rows="3"
                        />
                        <input
                            type="text"
                            placeholder="Image URL"
                            value={formData.image}
                            onChange={(e) => setFormData({ ...formData, image: e.target.value })}
                            className="w-full border px-3 py-2 rounded mb-3"
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
                                onClick={handleAddCategory}
                                className="flex-1 bg-primary text-white py-2 rounded hover:bg-primary/90"
                            >
                                Add
                            </button>
                            <button
                                onClick={() => {
                                    setShowAddModal(false);
                                    setFormData({ name: '', description: '', image: '', isActive: true });
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
                        <h2 className="text-xl font-bold mb-4">Edit Category</h2>
                        <input
                            type="text"
                            placeholder="Category Name"
                            value={formData.name}
                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                            className="w-full border px-3 py-2 rounded mb-3"
                        />
                        <textarea
                            placeholder="Description"
                            value={formData.description}
                            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                            className="w-full border px-3 py-2 rounded mb-3"
                            rows="3"
                        />
                        <input
                            type="text"
                            placeholder="Image URL"
                            value={formData.image}
                            onChange={(e) => setFormData({ ...formData, image: e.target.value })}
                            className="w-full border px-3 py-2 rounded mb-3"
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
                                onClick={handleUpdateCategory}
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

export default ManageCategories;
