import React from "react";
import { assets } from "../assets/assets";
import { useAppContext } from "../context/AppContext";


const ProductCard = ({product}) => {
    const {currency, addToCart, removeFromCart, cartItems, navigate} = useAppContext()

   
    return product && (
        <div onClick={()=> {navigate(`/products/${product.category.toLowerCase()}/${product._id}`); scrollTo(0,0)}} className="border border-gray-500/20 rounded-lg md:p-4 p-3 bg-white w-full h-full flex flex-col shadow-sm hover:shadow-md transition-shadow">
            <div className="group cursor-pointer flex items-center justify-center mb-3 aspect-square overflow-hidden bg-gray-50 rounded-md">
                <img className="group-hover:scale-110 transition-transform duration-300 w-full h-full object-contain" src={product.image[0]} alt={product.name} />
            </div>
            <div className="text-gray-500/60 text-sm flex-1 flex flex-col">
                <p className="text-xs uppercase mb-1">{product.category}</p>
                <p className="text-gray-700 font-medium md:text-base text-sm line-clamp-2 mb-2">{product.name}</p>
                <div className="flex items-center gap-0.5 mb-3">
                    {Array(5).fill('').map((_, i) => (
                           <img key={i} className="md:w-3 w-2.5" src={i < Math.round(product.averageRating || 0) ? assets.star_icon : assets.star_dull_icon} alt=""/>
                    ))}
                    <p className="text-xs ml-1">({product.averageRating || 0})</p>
                </div>
                <div className="flex items-end justify-between mt-auto">
                    <div>
                        <p className="md:text-lg text-base font-semibold text-primary">
                            {currency}{product.offerPrice}
                        </p>
                        <p className="text-gray-500/60 text-xs line-through">{currency}{product.price}</p>
                    </div>
                    <div onClick={(e) => { e.stopPropagation(); }} className="text-primary">
                        {!cartItems[product._id] ? (
                            <button className="flex items-center justify-center gap-1 bg-primary/10 border border-primary/40 md:px-3 px-2 h-[32px] rounded cursor-pointer text-sm hover:bg-primary/20 transition" onClick={() => addToCart(product._id)} >
                                <img src={assets.cart_icon} alt="cart_icon" className="w-4 h-4"/>
                                Add
                            </button>
                        ) : (
                            <div className="flex items-center justify-center gap-1 md:w-20 w-16 h-[32px] bg-primary/25 rounded select-none">
                                <button onClick={() => {removeFromCart(product._id)}} className="cursor-pointer text-lg font-medium px-2 h-full hover:bg-primary/30" >
                                    -
                                </button>
                                <span className="w-5 text-center font-medium text-sm">{cartItems[product._id]}</span>
                                <button onClick={() => {addToCart(product._id)}} className="cursor-pointer text-lg font-medium px-2 h-full hover:bg-primary/30" >
                                    +
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ProductCard;