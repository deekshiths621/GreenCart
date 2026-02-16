import React from 'react'
import { NavLink, Outlet } from 'react-router-dom'
import { useAppContext } from '../../context/AppContext'
import { assets } from '../../assets/assets'
import toast from 'react-hot-toast'

const AdminLayout = () => {
    const { isAdmin, setIsAdmin, navigate, axios } = useAppContext()

    const logout = async () => {
        try {
            const { data } = await axios.get('/api/admin/logout');
            if (data.success) {
                setIsAdmin(false);
                navigate('/admin-login');
                toast.success(data.message);
            }
        } catch (error) {
            toast.error(error.message);
        }
    }

    if (!isAdmin) {
        return null;
    }

    return (
        <div className='flex flex-col md:flex-row min-h-screen'>
            {/* Sidebar */}
            <div className='w-full md:w-64 bg-gray-50 border-r border-gray-200'>
                <div className='p-6 border-b border-gray-200'>
                    <img src={assets.logo} alt="logo" className='h-8' />
                    <p className='text-sm text-gray-600 mt-2'>Admin Panel</p>
                </div>
                <nav className='p-4'>
                    <NavLink
                        to='/admin'
                        end
                        className={({ isActive }) =>
                            `flex items-center gap-3 p-3 rounded-lg mb-2 ${isActive ? 'bg-primary text-white' : 'text-gray-700 hover:bg-gray-100'
                            }`
                        }
                    >
                        <span>📊</span>
                        <span>Dashboard</span>
                    </NavLink>
                    <NavLink
                        to='/admin/categories'
                        className={({ isActive }) =>
                            `flex items-center gap-3 p-3 rounded-lg mb-2 ${isActive ? 'bg-primary text-white' : 'text-gray-700 hover:bg-gray-100'
                            }`
                        }
                    >
                        <span>📑</span>
                        <span>Categories</span>
                    </NavLink>
                    <NavLink
                        to='/admin/products'
                        className={({ isActive }) =>
                            `flex items-center gap-3 p-3 rounded-lg mb-2 ${isActive ? 'bg-primary text-white' : 'text-gray-700 hover:bg-gray-100'
                            }`
                        }
                    >
                        <span>📦</span>
                        <span>Products</span>
                    </NavLink>
                    <NavLink
                        to='/admin/delivery-persons'
                        className={({ isActive }) =>
                            `flex items-center gap-3 p-3 rounded-lg mb-2 ${isActive ? 'bg-primary text-white' : 'text-gray-700 hover:bg-gray-100'
                            }`
                        }
                    >
                        <span>🚚</span>
                        <span>Delivery Persons</span>
                    </NavLink>
                    <NavLink
                        to='/admin/orders'
                        className={({ isActive }) =>
                            `flex items-center gap-3 p-3 rounded-lg mb-2 ${isActive ? 'bg-primary text-white' : 'text-gray-700 hover:bg-gray-100'
                            }`
                        }
                    >
                        <span>🛒</span>
                        <span>Orders</span>
                    </NavLink>
                    <NavLink
                        to='/admin/users'
                        className={({ isActive }) =>
                            `flex items-center gap-3 p-3 rounded-lg mb-2 ${isActive ? 'bg-primary text-white' : 'text-gray-700 hover:bg-gray-100'
                            }`
                        }
                    >
                        <span>👥</span>
                        <span>Users</span>
                    </NavLink>
                    <NavLink
                        to='/admin/ratings'
                        className={({ isActive }) =>
                            `flex items-center gap-3 p-3 rounded-lg mb-2 ${isActive ? 'bg-primary text-white' : 'text-gray-700 hover:bg-gray-100'
                            }`
                        }
                    >
                        <span>⭐</span>
                        <span>Ratings</span>
                    </NavLink>
                </nav>
            </div>

            {/* Main Content */}
            <div className='flex-1'>
                <div className='border-b border-gray-200 p-4 flex items-center justify-between bg-white'>
                    <h1 className='text-xl font-semibold text-gray-800'>Admin Dashboard</h1>
                    <button
                        onClick={logout}
                        className='border rounded-full text-sm px-4 py-1 hover:bg-gray-100 transition'
                    >
                        Logout
                    </button>
                </div>
                <div className='p-6'>
                    <Outlet />
                </div>
            </div>
        </div>
    )
}

export default AdminLayout
