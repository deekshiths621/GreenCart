import React from 'react'
import Navbar from './components/Navbar'
import { Route, Routes, useLocation } from 'react-router-dom'
import Home from './pages/Home'
import { Toaster } from "react-hot-toast";
import Footer from './components/Footer';
import { useAppContext } from './context/AppContext';
import Login from './components/Login';
import AllProducts from './pages/AllProducts';
import ProductCategory from './pages/ProductCategory';
import ProductDetails from './pages/ProductDetails';
import Cart from './pages/Cart';
import AddAddress from './pages/AddAddress';
import MyOrders from './pages/MyOrders';
import Loading from './components/Loading';
import Profile from './pages/Profile';
import TrackOrder from './pages/TrackOrder';
import AdminLogin from './components/AdminLogin';
import SellerLogin from './components/SellerLogin';
import AdminLayout from './pages/admin/AdminLayout';
import Dashboard from './pages/admin/Dashboard';
import ManageCategories from './pages/admin/ManageCategories';
import ManageDelivery from './pages/admin/ManageDelivery';
import ManageOrders from './pages/admin/ManageOrders';
import ViewRatings from './pages/admin/ViewRatings';
import ManageUsers from './pages/admin/ManageUsers';
import ManageProducts from './pages/admin/ManageProducts';
import ProductList from './pages/admin/ProductList';
import AdminSellerOrders from './pages/admin/SellerOrders';
import SellerLayout from './pages/seller/SellerLayout';
import SellerDashboard from './pages/seller/SellerDashboard';
import SellerAddProduct from './pages/seller/AddProduct';
import SellerManageProducts from './pages/seller/ManageProducts';

const App = () => {

  const isAdminPath = useLocation().pathname.includes("admin");
  const isSellerPath = useLocation().pathname.includes("seller");
  const {showUserLogin, isAdmin, isSeller} = useAppContext()

  return (
    <div className='text-default min-h-screen text-gray-700 bg-white'>

     {isAdminPath || isSellerPath ? null : <Navbar/>} 
     {showUserLogin ? <Login/> : null}

     <Toaster />

      <div className={`${isAdminPath || isSellerPath ? "" : "px-6 md:px-16 lg:px-24 xl:px-32"}`}>
        <Routes>
          <Route path='/' element={<Home/>} />
          <Route path='/products' element={<AllProducts/>} />
          <Route path='/products/:category' element={<ProductCategory/>} />
          <Route path='/products/:category/:id' element={<ProductDetails/>} />
          <Route path='/cart' element={<Cart/>} />
          <Route path='/add-address' element={<AddAddress/>} />
          <Route path='/my-orders' element={<MyOrders/>} />
          <Route path='/profile' element={<Profile/>} />
          <Route path='/track-order' element={<TrackOrder/>} />
          <Route path='/loader' element={<Loading/>} />
          <Route path='/admin-login' element={<AdminLogin/>} />
          <Route path='/admin' element={isAdmin ? <AdminLayout/> : <AdminLogin/>}>
            <Route index element={isAdmin ? <Dashboard/> : null} />
            <Route path='categories' element={<ManageCategories/>} />
            <Route path='product-list' element={<ProductList/>} />
            <Route path='products' element={<ManageProducts/>} />
            <Route path='delivery-persons' element={<ManageDelivery/>} />
            <Route path='seller-orders' element={<AdminSellerOrders/>} />
            <Route path='orders' element={<ManageOrders/>} />
            <Route path='users' element={<ManageUsers/>} />
            <Route path='ratings' element={<ViewRatings/>} />
          </Route>
          <Route path='/seller' element={isSeller ? <SellerLayout/> : <SellerLogin/>}>
            <Route index element={isSeller ? <SellerDashboard/> : null} />
            <Route path='add-product' element={isSeller ? <SellerAddProduct/> : null} />
            <Route path='products' element={isSeller ? <SellerManageProducts/> : null} />
          </Route>
        </Routes>
      </div>
     {!isAdminPath && !isSellerPath && <Footer/>}
    </div>
  )
}

export default App
