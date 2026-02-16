import { useEffect, useState, useMemo } from "react";
import { useAppContext } from "../context/AppContext";
import { assets } from "../assets/assets";
import toast from "react-hot-toast";

const Cart = () => {
    const { 
        products, currency, cartItems, removeFromCart, getCartCount, 
        updateCartItem, navigate, getCartAmount, axios, user, setCartItems,
        addressChanged, setAddressChanged
    } = useAppContext();

    const [addresses, setAddresses] = useState([]);
    const [showAddress, setShowAddress] = useState(false);
    const [selectedAddress, setSelectedAddress] = useState(null);
    const [paymentOption, setPaymentOption] = useState("COD");

    const handleDeleteAddress = async (addressId, e) => {
        e.stopPropagation(); // Prevent dropdown selection when clicking delete
        
        if (!window.confirm('Are you sure you want to delete this address?')) {
            return;
        }

        try {
            const { data } = await axios.post('/api/address/delete', { addressId });
            if (data.success) {
                toast.success('Address deleted successfully');
                // Update addresses list
                const updatedAddresses = addresses.filter(addr => addr._id !== addressId);
                setAddresses(updatedAddresses);
                
                // If deleted address was selected, select first available or null
                if (selectedAddress?._id === addressId) {
                    setSelectedAddress(updatedAddresses.length > 0 ? updatedAddresses[0] : null);
                }
            } else {
                toast.error(data.message);
            }
        } catch (error) {
            console.error(error);
            toast.error('Failed to delete address');
        }
    };

    // Use useMemo for derived state to avoid cascading renders
    const cartArray = useMemo(() => {
        const tempArray = [];
        for (const key in cartItems) {
            const product = products.find((item) => item._id === key);
            if (product) {
                // Create a NEW object to avoid mutating the global state
                tempArray.push({ ...product, quantity: cartItems[key] });
            }
        }
        return tempArray;
    }, [cartItems, products]);

    const placeOrder = async () => {
        try {
            if (!user) {
                return toast.error("Please login to place an order");
            }

            if (!selectedAddress) {
                return toast.error("Please select an address");
            }

            const orderData = {
                userId: user._id,
                items: cartArray.map(item => ({ product: item._id, quantity: item.quantity })),
                address: selectedAddress._id
            };

            if (paymentOption === "COD") {
                const { data } = await axios.post('/api/order/cod', orderData);
                if (data.success) {
                    toast.success(data.message);
                    setCartItems({});
                    navigate('/my-orders');
                } else {
                    toast.error(data.message);
                }
            } else {
                const { data } = await axios.post('/api/order/stripe', orderData);
                if (data.success) {
                    window.location.replace(data.url);
                } else {
                    toast.error(data.message);
                }
            }
        } catch (error) {
            toast.error(error.message);
        }
    };

    useEffect(() => {
        const getUserAddress = async () => {
            try {
                console.log("Fetching addresses for user:", user);
                const { data } = await axios.post('/api/address/get', {});
                console.log("Address API Response:", data);
                console.log("Addresses returned:", data.addresses);
                console.log("Number of addresses:", data.addresses?.length);
                
                if (data.success) {
                    setAddresses(data.addresses);
                    console.log("Addresses set to state:", data.addresses);
                    if (data.addresses.length > 0) {
                        setSelectedAddress(data.addresses[0]);
                        console.log("Selected address:", data.addresses[0]);
                    } else {
                        console.log("No addresses found in response");
                    }
                } else {
                    console.log("API returned success: false with message:", data.message);
                    toast.error(data.message);
                }
            } catch (error) {
                console.log("Address fetch error:", error);
                console.log("Error response:", error.response?.data);
                toast.error(error.message);
            }
        };

        if (user) {
            console.log("User exists, fetching addresses...");
            getUserAddress();
            if (addressChanged) {
                setAddressChanged(false);
            }
        } else {
            console.log("No user found, skipping address fetch");
        }
    }, [user, axios, addressChanged, setAddressChanged]);

    // If user is not logged in
    if (!user) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[60vh] mt-16">
                <p className="text-gray-600 text-xl mb-4">Please login to view your cart</p>
                <button 
                    onClick={() => navigate('/')} 
                    className="px-8 py-2 bg-primary text-white rounded hover:bg-primary-dull transition"
                >
                    Go to Home
                </button>
            </div>
        );
    }

    return products.length > 0 && cartItems ? (
        <div className="flex flex-col md:flex-row mt-16 container mx-auto px-4">
            <div className='flex-1 max-w-4xl'>
                <h1 className="text-3xl font-medium mb-6">
                    Shopping Cart <span className="text-sm text-primary">{getCartCount()} Items</span>
                </h1>

                <div className="grid grid-cols-[2fr_1fr_1fr] text-gray-500 text-base font-medium pb-3 border-b">
                    <p>Product Details</p>
                    <p className="text-center">Subtotal</p>
                    <p className="text-center">Action</p>
                </div>

                {cartArray.map((product, index) => (
                    <div key={index} className="grid grid-cols-[2fr_1fr_1fr] text-gray-500 items-center text-sm md:text-base font-medium py-5 border-b">
                        <div className="flex items-center md:gap-6 gap-3">
                            <div onClick={() => {
                                navigate(`/products/${product.category.toLowerCase()}/${product._id}`);
                                window.scrollTo(0, 0);
                            }} className="cursor-pointer w-20 h-20 md:w-24 md:h-24 flex items-center justify-center border border-gray-300 rounded p-1">
                                <img className="max-w-full max-h-full object-contain" src={product.image[0]} alt="" />
                            </div>
                            <div>
                                <p className="font-semibold text-gray-800">{product.name}</p>
                                <div className="font-normal text-gray-500/70">
                                    <p>Weight: <span>{product.weight || "N/A"}</span></p>
                                    <div className='flex items-center gap-1'>
                                        <p>Qty:</p>
                                        <select 
                                            onChange={e => updateCartItem(product._id, Number(e.target.value))} 
                                            value={product.quantity} 
                                            className='outline-none bg-transparent cursor-pointer'
                                        >
                                            {[...Array(10)].map((_, i) => (
                                                <option key={i + 1} value={i + 1}>{i + 1}</option>
                                            ))}
                                        </select>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <p className="text-center">{currency}{product.offerPrice * product.quantity}</p>
                        <button onClick={() => removeFromCart(product._id)} className="cursor-pointer mx-auto hover:opacity-70 transition">
                            <img src={assets.remove_icon} alt="remove" className="w-6 h-6" />
                        </button>
                    </div>
                ))}

                <button onClick={() => { navigate("/products"); window.scrollTo(0, 0) }} className="group cursor-pointer flex items-center mt-8 gap-2 text-primary font-medium">
                    <img className="rotate-180 group-hover:translate-x-1 transition" src={assets.arrow_right_icon_colored} alt="" />
                    Continue Shopping
                </button>
            </div>

            <div className="max-w-[360px] w-full bg-gray-50/80 p-6 md:ml-10 max-md:mt-16 border border-gray-200 rounded-lg h-fit">
                <h2 className="text-xl font-medium">Order Summary</h2>
                <hr className="my-5" />

                <div className="mb-6">
                    <p className="text-xs font-bold uppercase text-gray-400">Delivery Address</p>
                    {selectedAddress ? (
                        <div className="relative mt-2">
                            <div className="bg-white p-3 rounded border border-gray-200">
                                <p className="font-medium text-gray-800 text-sm">{selectedAddress.firstName} {selectedAddress.lastName}</p>
                                <p className="text-sm text-gray-600 mt-1">{selectedAddress.street}</p>
                                <p className="text-sm text-gray-600">{selectedAddress.city}, {selectedAddress.state} {selectedAddress.zipcode}</p>
                                <p className="text-sm text-gray-500 mt-1">{selectedAddress.phone}</p>
                            </div>
                            <button onClick={() => setShowAddress(!showAddress)} className="text-primary text-sm hover:underline cursor-pointer mt-2">
                                {addresses.length > 1 ? 'Change Address' : 'Add Another Address'}
                            </button>
                            
                            {showAddress && (
                                <div className="absolute top-10 left-0 py-1 bg-white border border-gray-300 shadow-xl rounded z-10 w-full max-h-64 overflow-y-auto">
                                    {addresses.length > 0 ? (
                                        addresses.map((address, index) => (
                                            <div 
                                                key={index} 
                                                onClick={() => { setSelectedAddress(address); setShowAddress(false) }} 
                                                className={`p-3 hover:bg-gray-100 cursor-pointer text-sm border-b relative ${selectedAddress?._id === address._id ? 'bg-primary/10' : ''}`}
                                            >
                                                <div className="pr-8">
                                                    <p className="font-medium text-gray-800">{address.firstName} {address.lastName}</p>
                                                    <p className="text-gray-600 text-xs mt-1">{address.street}, {address.city}, {address.state} {address.zipcode}</p>
                                                    <p className="text-gray-500 text-xs">{address.phone}</p>
                                                </div>
                                                <button
                                                    onClick={(e) => handleDeleteAddress(address._id, e)}
                                                    className="absolute top-3 right-3 text-red-500 hover:text-red-700 transition"
                                                    title="Delete Address"
                                                >
                                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                                        <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
                                                    </svg>
                                                </button>
                                            </div>
                                        ))
                                    ) : (
                                        <p className="text-gray-500 p-3 text-sm">No saved addresses</p>
                                    )}
                                    <p 
                                        onClick={() => {
                                            console.log("Add address dropdown clicked");
                                            if (!user) {
                                                toast.error("Please login first");
                                                return;
                                            }
                                            setShowAddress(false);
                                            navigate("/add-address");
                                        }} 
                                        className="text-primary font-medium text-center cursor-pointer p-3 hover:bg-primary/5 text-sm border-t-2"
                                    >
                                        + Add new address
                                    </p>
                                </div>
                            )}
                        </div>
                    ) : (
                        <div className="mt-2">
                            <p className="text-sm text-gray-600 mb-2">No address found</p>
                            <button 
                                onClick={() => {
                                    console.log("Add address button clicked");
                                    if (!user) {
                                        toast.error("Please login first");
                                        return;
                                    }
                                    navigate("/add-address");
                                }} 
                                className="text-primary text-sm font-medium hover:underline cursor-pointer"
                            >
                                + Add new address
                            </button>
                        </div>
                    )}

                    <p className="text-xs font-bold uppercase text-gray-400 mt-8">Payment Method</p>
                    <select onChange={e => setPaymentOption(e.target.value)} className="w-full border border-gray-300 bg-white px-3 py-2 mt-2 outline-none text-sm rounded">
                        <option value="COD">Cash On Delivery (COD)</option>
                        <option value="Online">Online Payment (Stripe)</option>
                    </select>
                </div>

                <div className="text-gray-600 mt-10 space-y-3 text-sm">
                    <p className="flex justify-between"><span>Price</span><span>{currency}{getCartAmount()}</span></p>
                    <p className="flex justify-between"><span>Shipping Fee</span><span className="text-green-600 font-medium">FREE</span></p>
                    <p className="flex justify-between"><span>Tax (2%)</span><span>{currency}{(getCartAmount() * 0.02).toFixed(2)}</span></p>
                    <div className="border-t pt-3 flex justify-between text-lg font-bold text-gray-800 mt-2">
                        <span>Total:</span>
                        <span>{currency}{(getCartAmount() * 1.02).toFixed(2)}</span>
                    </div>
                </div>

                <button onClick={placeOrder} className="w-full py-3.5 mt-8 cursor-pointer bg-primary text-white font-bold rounded shadow-md hover:bg-primary-dull transition">
                    {paymentOption === "COD" ? "PLACE ORDER" : "PROCEED TO PAY"}
                </button>
            </div>
        </div>
    ) : (
        <div className="flex flex-col items-center justify-center min-h-[60vh]">
            <p className="text-gray-400 text-xl">Your cart is empty</p>
            <button onClick={() => navigate('/products')} className="mt-4 px-8 py-2 bg-primary text-white rounded">Shop Now</button>
        </div>
    );
};

export default Cart;