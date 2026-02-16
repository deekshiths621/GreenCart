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
import SellerLogin from './components/seller/SellerLogin';
import SellerLayout from './pages/seller/SellerLayout';
import AddProduct from './pages/seller/AddProduct';
import ProductList from './pages/seller/ProductList';
import Orders from './pages/seller/Orders';
import Loading from './components/Loading';
import Profile from './pages/Profile';
import TrackOrder from './pages/TrackOrder';
import AdminLogin from './components/AdminLogin';
import AdminLayout from './pages/admin/AdminLayout';
import Dashboard from './pages/admin/Dashboard';
import ManageCategories from './pages/admin/ManageCategories';
import ManageDelivery from './pages/admin/ManageDelivery';
import ManageOrders from './pages/admin/ManageOrders';
import ViewRatings from './pages/admin/ViewRatings';
import ManageUsers from './pages/admin/ManageUsers';
import ManageProducts from './pages/admin/ManageProducts';

const App = () => {

  const isSellerPath = useLocation().pathname.includes("seller");
  const isAdminPath = useLocation().pathname.includes("admin");
  const {showUserLogin, isSeller, isAdmin} = useAppContext()

  return (
    <div className='text-default min-h-screen text-gray-700 bg-white'>

     {(isSellerPath || isAdminPath) ? null : <Navbar/>} 
     {showUserLogin ? <Login/> : null}

     <Toaster />

      <div className={`${(isSellerPath || isAdminPath) ? "" : "px-6 md:px-16 lg:px-24 xl:px-32"}`}>
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
          <Route path='/seller' element={isSeller ? <SellerLayout/> : <SellerLogin/>}>
            <Route index element={isSeller ? <AddProduct/> : null} />
            <Route path='product-list' element={<ProductList/>} />
            <Route path='orders' element={<Orders/>} />
          </Route>
          <Route path='/admin-login' element={<AdminLogin/>} />
          <Route path='/admin' element={isAdmin ? <AdminLayout/> : <AdminLogin/>}>
            <Route index element={isAdmin ? <Dashboard/> : null} />
            <Route path='categories' element={<ManageCategories/>} />
            <Route path='products' element={<ManageProducts/>} />
            <Route path='delivery-persons' element={<ManageDelivery/>} />
            <Route path='orders' element={<ManageOrders/>} />
            <Route path='users' element={<ManageUsers/>} />
            <Route path='ratings' element={<ViewRatings/>} />
          </Route>
        </Routes>
      </div>
     {(!isSellerPath && !isAdminPath) && <Footer/>}
    </div>
  )
}

export default App
