import { useEffect, useState, useMemo } from "react";
import { useAppContext } from "../context/AppContext";
import { Link, useParams } from "react-router-dom";
import { assets } from "../assets/assets";
import ProductCard from "../components/ProductCard";
import Rating from "../components/Rating";

const ProductDetails = () => {
    const { products, navigate, currency, addToCart } = useAppContext();
    const { id } = useParams();

    // Memoize product to ensure a stable reference
    const product = useMemo(() => products.find((item) => item._id === id), [products, id]);

    // Initialize thumbnail with product's first image, or update when product changes
    const [thumbnail, setThumbnail] = useState(product?.image?.[0] || null);

    const relatedProducts = useMemo(() => {
        if (!product) return [];
        return products
            .filter((item) => item.category === product.category && item._id !== id)
            .slice(0, 5);
    }, [products, product, id]);

    // Reset thumbnail when navigating to a different product
    useEffect(() => {
        if (product?.image?.length > 0) {
            // Use setTimeout to make the state update asynchronous (React Compiler compliance)
            const timer = setTimeout(() => {
                setThumbnail(product.image[0]);
            }, 0);
            return () => clearTimeout(timer);
        }
    }, [id, product?.image]);

    useEffect(() => {
        window.scrollTo(0, 0);
    }, [id]);

    if (!product) return <div className="min-h-screen"></div>;

    return (
        <div className="mt-12">
            <p className="text-sm">
                <Link to={"/"} className="hover:text-primary transition">Home</Link> /
                <Link to={"/products"} className="hover:text-primary transition"> Products</Link> /
                <Link to={`/products/${product.category.toLowerCase()}`} className="hover:text-primary transition"> {product.category}</Link> /
                <span className="text-primary font-medium"> {product.name}</span>
            </p>

            <div className="flex flex-col md:flex-row gap-16 mt-4">
                <div className="flex gap-3">
                    <div className="flex flex-col gap-3">
                        {product.image.map((image, index) => (
                            <div key={index} onClick={() => setThumbnail(image)} className={`border max-w-24 border-gray-500/30 rounded overflow-hidden cursor-pointer ${thumbnail === image ? 'border-primary' : ''}`} >
                                <img src={image} alt="" className="w-full" />
                            </div>
                        ))}
                    </div>

                    <div className="border border-gray-500/30 max-w-100 rounded overflow-hidden">
                        <img src={thumbnail} alt="" className="w-full h-auto" />
                    </div>
                </div>

                <div className="text-sm w-full md:w-1/2">
                    <h1 className="text-3xl font-medium">{product.name}</h1>
                    <div className="flex items-center gap-0.5 mt-1">
                        {Array(5).fill('').map((_, i) => (
                            <img key={i} src={i < Math.round(product.averageRating || 0) ? assets.star_icon : assets.star_dull_icon} alt="" className="md:w-4 w-3.5" />
                        ))}
                        <p className="text-base ml-2 text-gray-500">({product.averageRating || 0}) - {product.totalRatings || 0} reviews</p>
                    </div>
                    <div className="mt-6">
                        <p className="text-gray-500/70 line-through">MRP: {currency}{product.price}</p>
                        <p className="text-2xl font-medium text-primary">Price: {currency}{product.offerPrice}</p>
                        <span className="text-gray-500/70 text-xs">(inclusive of all taxes)</span>
                    </div>
                    <p className="text-base font-medium mt-6">About Product</p>
                    <ul className="list-disc ml-4 text-gray-500/70 space-y-1">
                        {product.description.map((desc, index) => (
                            <li key={index}>{desc}</li>
                        ))}
                    </ul>
                    <div className="flex items-center mt-10 gap-4 text-base">
                        <button onClick={() => addToCart(product._id)} className="w-full py-3.5 cursor-pointer font-medium bg-gray-100 text-gray-800/80 hover:bg-gray-200 transition rounded" >
                            Add to Cart
                        </button>
                        <button onClick={() => { addToCart(product._id); navigate("/cart") }} className="w-full py-3.5 cursor-pointer font-medium bg-primary text-white hover:bg-primary-dull transition rounded" >
                            Buy now
                        </button>
                    </div>
                </div>
            </div>

            {/* Rating Section */}
            <Rating productId={product._id} />

            <div className="flex flex-col items-center mt-20">
                <div className="flex flex-col items-center w-max">
                    <p className="text-3xl font-medium">Related Products</p>
                    <div className="w-20 h-0.5 bg-primary rounded-full mt-2"></div>
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 md:gap-6 lg:grid-cols-5 mt-6 w-full">
                    {relatedProducts.filter((item) => item.inStock).map((item, index) => (
                        <ProductCard key={index} product={item} />
                    ))}
                </div>
                <button onClick={() => navigate('/products')} className="mx-auto cursor-pointer px-12 my-16 py-2.5 border border-primary rounded text-primary hover:bg-primary/10 transition">See more</button>
            </div>
        </div>
    );
};

export default ProductDetails;