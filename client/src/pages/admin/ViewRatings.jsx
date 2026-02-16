import { useEffect, useState } from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';

const ViewRatings = () => {
    const [ratings, setRatings] = useState([]);

    const backendUrl = import.meta.env.VITE_BACKEND_URL;

    const fetchRatings = async () => {
        try {
            const { data } = await axios.get(`${backendUrl}/api/admin/ratings`, { withCredentials: true });
            if (data.success) {
                setRatings(data.ratings);
            }
        } catch {
            toast.error('Failed to fetch ratings');
        }
    };

    useEffect(() => {
        fetchRatings();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const handleDelete = async (ratingId) => {
        if (!window.confirm('Are you sure you want to delete this rating?')) return;

        try {
            const { data } = await axios.delete(
                `${backendUrl}/api/admin/rating/delete`,
                { data: { ratingId }, withCredentials: true }
            );
            if (data.success) {
                toast.success('Rating deleted successfully');
                fetchRatings();
            } else {
                toast.error(data.message);
            }
        } catch {
            toast.error('Failed to delete rating');
        }
    };

    const renderStars = (rating) => {
        return [...Array(5)].map((_, index) => (
            <span key={index} className={index < rating ? 'text-yellow-400' : 'text-gray-300'}>
                ★
            </span>
        ));
    };

    return (
        <div className="p-6">
            <h1 className="text-2xl font-bold mb-6">View Ratings & Reviews</h1>

            <div className="grid gap-4">
                {ratings.map((rating) => (
                    <div key={rating._id} className="bg-white rounded-lg shadow p-4">
                        <div className="flex justify-between items-start">
                            <div className="flex-1">
                                <div className="flex items-center gap-4 mb-2">
                                    <div>
                                        <h3 className="font-semibold">{rating.productId?.name || 'Unknown Product'}</h3>
                                        <p className="text-sm text-gray-600">
                                            by {rating.userId?.name || rating.userName || 'Anonymous'}
                                        </p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-2 mb-2">
                                    <div className="text-xl">{renderStars(rating.rating)}</div>
                                    <span className="text-sm text-gray-600">
                                        ({rating.rating}/5)
                                    </span>
                                </div>
                                {rating.review && (
                                    <p className="text-gray-700 mb-2">{rating.review}</p>
                                )}
                                <p className="text-xs text-gray-500">
                                    {new Date(rating.createdAt).toLocaleDateString('en-IN', {
                                        year: 'numeric',
                                        month: 'long',
                                        day: 'numeric',
                                        hour: '2-digit',
                                        minute: '2-digit'
                                    })}
                                </p>
                            </div>
                            <button
                                onClick={() => handleDelete(rating._id)}
                                className="text-red-600 hover:text-red-800 ml-4"
                            >
                                Delete
                            </button>
                        </div>
                    </div>
                ))}

                {ratings.length === 0 && (
                    <div className="text-center py-12 text-gray-500">
                        No ratings found
                    </div>
                )}
            </div>
        </div>
    );
};

export default ViewRatings;
