import React, { useEffect, useState } from 'react'
import { useAppContext } from '../../context/AppContext'
import toast from 'react-hot-toast'

const SellerDashboard = () => {
    const { axios } = useAppContext()
    const [products, setProducts] = useState([])
    const [currentPage, setCurrentPage] = useState(1)
    const productsPerPage = 10
    const [stats, setStats] = useState({
        totalProducts: 0,
        inStockProducts: 0,
        outOfStockProducts: 0
    })
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        const fetchDashboardData = async () => {
            try {
                const { data } = await axios.get('/api/admin/products');
                if (data.success && data.products) {
                    setProducts(data.products);
                    
                    // Calculate stats
                    const totalProducts = data.products.length;
                    const inStockProducts = data.products.filter(p => p.inStock !== false).length;
                    const outOfStockProducts = totalProducts - inStockProducts;
                    
                    setStats({
                        totalProducts,
                        inStockProducts,
                        outOfStockProducts
                    });
                }
                setLoading(false)
            } catch (error) {
                console.log(error);
                toast.error('Failed to load dashboard');
                setLoading(false)
            }
        }

        fetchDashboardData()
    }, [axios])

    if (loading) {
        return <div className='text-center py-10'>Loading...</div>
    }

    return (
        <div className='space-y-6'>
            <h2 className='text-2xl font-bold text-gray-800'>Dashboard</h2>
            
            {/* Stats Grid */}
            <div className='grid grid-cols-1 md:grid-cols-3 gap-6'>
                <div className='bg-white p-6 rounded-lg shadow border border-gray-200'>
                    <p className='text-gray-600 text-sm mb-2'>Total Products</p>
                    <p className='text-3xl font-bold text-primary'>{stats.totalProducts}</p>
                </div>
                <div className='bg-white p-6 rounded-lg shadow border border-gray-200'>
                    <p className='text-gray-600 text-sm mb-2'>In Stock</p>
                    <p className='text-3xl font-bold text-green-600'>{stats.inStockProducts}</p>
                </div>
                <div className='bg-white p-6 rounded-lg shadow border border-gray-200'>
                    <p className='text-gray-600 text-sm mb-2'>Out of Stock</p>
                    <p className='text-3xl font-bold text-red-600'>{stats.outOfStockProducts}</p>
                </div>
            </div>

            {/* Products Overview */}
            <div className='bg-white rounded-lg shadow border border-gray-200 p-6'>
                <h3 className='text-lg font-semibold text-gray-800 mb-4'>Products Overview</h3>
                {products.length === 0 ? (
                    <p className='text-gray-500 text-center py-8'>No products added yet</p>
                ) : (
                    <>
                        <div className='overflow-x-auto'>
                            <table className='w-full'>
                                <thead className='border-b border-gray-200'>
                                    <tr>
                                        <th className='text-left p-3 text-gray-700 font-semibold'>Product Name</th>
                                        <th className='text-left p-3 text-gray-700 font-semibold'>Category</th>
                                        <th className='text-left p-3 text-gray-700 font-semibold'>Price</th>
                                        <th className='text-left p-3 text-gray-700 font-semibold'>Status</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {products.slice((currentPage - 1) * productsPerPage, currentPage * productsPerPage).map((product) => (
                                        <tr key={product._id} className='border-b border-gray-100 hover:bg-gray-50'>
                                            <td className='p-3'>{product.name}</td>
                                            <td className='p-3'>{product.category}</td>
                                            <td className='p-3'>₹{product.price}</td>
                                            <td className='p-3'>
                                                <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                                                    product.inStock !== false 
                                                        ? 'bg-green-100 text-green-800' 
                                                        : 'bg-red-100 text-red-800'
                                                }`}>
                                                    {product.inStock !== false ? 'In Stock' : 'Out of Stock'}
                                                </span>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                        
                        {/* Pagination */}
                        <div className='flex items-center justify-between mt-6 pt-4 border-t border-gray-200'>
                            <p className='text-sm text-gray-600'>
                                Showing {(currentPage - 1) * productsPerPage + 1} to {Math.min(currentPage * productsPerPage, products.length)} of {products.length} products
                            </p>
                            <div className='flex gap-2'>
                                <button
                                    onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                                    disabled={currentPage === 1}
                                    className={`px-4 py-2 rounded-lg font-medium transition ${
                                        currentPage === 1
                                            ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                                            : 'bg-primary text-white hover:bg-primary-dull'
                                    }`}
                                >
                                    Previous
                                </button>
                                <span className='px-4 py-2 text-sm font-medium text-gray-700'>Page {currentPage}</span>
                                <button
                                    onClick={() => setCurrentPage(prev => {
                                        const maxPage = Math.ceil(products.length / productsPerPage);
                                        return Math.min(prev + 1, maxPage);
                                    })}
                                    disabled={currentPage >= Math.ceil(products.length / productsPerPage)}
                                    className={`px-4 py-2 rounded-lg font-medium transition ${
                                        currentPage >= Math.ceil(products.length / productsPerPage)
                                            ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                                            : 'bg-primary text-white hover:bg-primary-dull'
                                    }`}
                                >
                                    Next
                                </button>
                            </div>
                        </div>
                    </>
                )}
            </div>
        </div>
    )
}

export default SellerDashboard
