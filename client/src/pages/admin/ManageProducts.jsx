import { useEffect, useState } from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';

const ManageProducts = () => {
    const [products, setProducts] = useState([]);
    const [filteredProducts, setFilteredProducts] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [categoryFilter, setCategoryFilter] = useState('All');
    const [showEditModal, setShowEditModal] = useState(false);
    const [editingProduct, setEditingProduct] = useState(null);
    const [formData, setFormData] = useState({
        name: '',
        category: '',
        price: '',
        offerPrice: '',
        description: '',
        image: '',
        bestSeller: false,
        available: true
    });

    const backendUrl = import.meta.env.VITE_BACKEND_URL;

    const fetchProducts = async () => {
        try {
            const { data } = await axios.get(`${backendUrl}/api/admin/products`, { withCredentials: true });
            if (data.success) {
                setProducts(data.products);
                setFilteredProducts(data.products);
            }
        } catch {
            toast.error('Failed to fetch products');
        }
    };

    useEffect(() => {
        fetchProducts();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    useEffect(() => {
        let filtered = products;

        // Filter by search term
        if (searchTerm) {
            filtered = filtered.filter(product =>
                product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                product.category.toLowerCase().includes(searchTerm.toLowerCase())
            );
        }

        // Filter by category
        if (categoryFilter !== 'All') {
            filtered = filtered.filter(product => product.category === categoryFilter);
        }

        setFilteredProducts(filtered);
    }, [searchTerm, categoryFilter, products]);

    const openEditModal = (product) => {
        setEditingProduct(product);
        setFormData({
            name: product.name,
            category: product.category,
            price: product.price,
            offerPrice: product.offerPrice || '',
            description: product.description,
            image: Array.isArray(product.image) ? product.image[0] || '' : product.image || '',
            bestSeller: product.bestSeller || false,
            available: product.available
        });
        setShowEditModal(true);
    };

    const handleEditProduct = async () => {
        try {
            const { data } = await axios.put(
                `${backendUrl}/api/admin/product/edit`,
                { 
                    productId: editingProduct._id, 
                    ...formData,
                    image: formData.image ? [formData.image] : editingProduct.image // Save as array
                },
                { withCredentials: true }
            );
            if (data.success) {
                toast.success(data.message);
                setShowEditModal(false);
                fetchProducts();
            } else {
                toast.error(data.message);
            }
        } catch {
            toast.error('Failed to update product');
        }
    };

    const handleDeleteProduct = async (productId, productName) => {
        if (!window.confirm(`Are you sure you want to delete "${productName}"? This action cannot be undone.`)) return;

        try {
            const { data } = await axios.delete(
                `${backendUrl}/api/admin/product/delete`,
                { data: { productId }, withCredentials: true }
            );
            if (data.success) {
                toast.success(data.message);
                fetchProducts();
            } else {
                toast.error(data.message);
            }
        } catch {
            toast.error('Failed to delete product');
        }
    };

    // Get unique categories
    const categories = ['All', ...new Set(products.map(p => p.category))];

    const formatCurrency = (amount) => {
        return `₹${amount.toFixed(2)}`;
    };

    return (
        <div className="p-6">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-bold">Manage Products</h1>
                <div className="text-sm text-gray-600">
                    Total Products: <span className="font-semibold">{products.length}</span>
                </div>
            </div>

            {/* Filters */}
            <div className="mb-6 flex flex-wrap gap-4">
                <input
                    type="text"
                    placeholder="Search products..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 flex-1 min-w-[200px]"
                />
                <select
                    value={categoryFilter}
                    onChange={(e) => setCategoryFilter(e.target.value)}
                    className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                    {categories.map(category => (
                        <option key={category} value={category}>{category}</option>
                    ))}
                </select>
            </div>

            {/* Products Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {filteredProducts.map((product) => (
                    <div key={product._id} className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow">
                        <div className="relative">
                            <img
                                src={Array.isArray(product.image) ? product.image[0] : product.image}
                                alt={product.name}
                                className="w-full h-48 object-cover"
                            />
                            {!product.available && (
                                <div className="absolute top-2 right-2 bg-red-500 text-white px-2 py-1 rounded text-xs font-semibold">
                                    Out of Stock
                                </div>
                            )}
                            {product.bestSeller && (
                                <div className="absolute top-2 left-2 bg-yellow-500 text-white px-2 py-1 rounded text-xs font-semibold">
                                    Best Seller
                                </div>
                            )}
                        </div>
                        <div className="p-4">
                            <h3 className="font-semibold text-lg text-gray-800 mb-1 truncate">{product.name}</h3>
                            <p className="text-sm text-gray-600 mb-2">{product.category}</p>
                            <p className="text-xs text-gray-500 mb-3 line-clamp-2">{product.description}</p>
                            
                            <div className="flex items-center gap-2 mb-3">
                                {product.offerPrice > 0 && product.offerPrice < product.price ? (
                                    <>
                                        <span className="text-lg font-bold text-green-600">
                                            {formatCurrency(product.offerPrice)}
                                        </span>
                                        <span className="text-sm text-gray-500 line-through">
                                            {formatCurrency(product.price)}
                                        </span>
                                    </>
                                ) : (
                                    <span className="text-lg font-bold text-gray-800">
                                        {formatCurrency(product.price)}
                                    </span>
                                )}
                            </div>

                            <div className="flex items-center justify-between text-xs text-gray-500 mb-3">
                                <span>Added: {new Date(product.createdAt).toLocaleDateString()}</span>
                            </div>

                            <div className="flex gap-2">
                                <button
                                    onClick={() => openEditModal(product)}
                                    className="flex-1 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors font-medium"
                                >
                                    Edit
                                </button>
                                <button
                                    onClick={() => handleDeleteProduct(product._id, product.name)}
                                    className="flex-1 px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 transition-colors font-medium"
                                >
                                    Delete
                                </button>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {filteredProducts.length === 0 && (
                <div className="text-center py-12 text-gray-500">
                    {searchTerm || categoryFilter !== 'All' 
                        ? 'No products found matching your filters' 
                        : 'No products available'}
                </div>
            )}

            {/* Edit Modal */}
            {showEditModal && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-lg p-6 w-full max-w-md max-h-[90vh] overflow-y-auto">
                        <h2 className="text-xl font-bold mb-4">Edit Product</h2>
                        
                        <div className="space-y-3">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Product Name</label>
                                <input
                                    type="text"
                                    value={formData.name}
                                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
                                <input
                                    type="text"
                                    value={formData.category}
                                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Image URL</label>
                                <input
                                    type="text"
                                    value={formData.image}
                                    onChange={(e) => setFormData({ ...formData, image: e.target.value })}
                                    placeholder="Paste any image URL (Unsplash, Cloudinary, direct link, etc.)"
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                />
                                <p className="text-xs text-gray-500 mt-1">
                                    Accepts any valid image URL from any source (jpg, png, webp, etc.)
                                </p>
                                {formData.image && (
                                    <div className="mt-2">
                                        <img 
                                            src={formData.image} 
                                            alt="Preview" 
                                            className="w-32 h-32 object-cover rounded border border-gray-300"
                                            onError={(e) => e.target.style.display = 'none'}
                                        />
                                    </div>
                                )}
                            </div>

                            <div className="grid grid-cols-2 gap-3">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Price (₹)</label>
                                    <input
                                        type="number"
                                        value={formData.price}
                                        onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Offer Price (₹)</label>
                                    <input
                                        type="number"
                                        value={formData.offerPrice}
                                        onChange={(e) => setFormData({ ...formData, offerPrice: e.target.value })}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                                <textarea
                                    value={formData.description}
                                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                    rows="3"
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                />
                            </div>

                            <div className="flex items-center gap-4">
                                <label className="flex items-center gap-2">
                                    <input
                                        type="checkbox"
                                        checked={formData.bestSeller}
                                        onChange={(e) => setFormData({ ...formData, bestSeller: e.target.checked })}
                                        className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
                                    />
                                    <span className="text-sm font-medium text-gray-700">Best Seller</span>
                                </label>

                                <label className="flex items-center gap-2">
                                    <input
                                        type="checkbox"
                                        checked={formData.available}
                                        onChange={(e) => setFormData({ ...formData, available: e.target.checked })}
                                        className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
                                    />
                                    <span className="text-sm font-medium text-gray-700">Available</span>
                                </label>
                            </div>
                        </div>

                        <div className="flex gap-3 mt-6">
                            <button
                                onClick={() => setShowEditModal(false)}
                                className="flex-1 px-4 py-2 bg-gray-200 text-gray-800 rounded hover:bg-gray-300 transition-colors font-medium"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleEditProduct}
                                className="flex-1 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors font-medium"
                            >
                                Save Changes
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ManageProducts;
