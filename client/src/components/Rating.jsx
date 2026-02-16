import React, { useState, useEffect } from 'react'
import { useAppContext } from '../context/AppContext'
import toast from 'react-hot-toast'

const Rating = ({ productId }) => {
  const { user, axios } = useAppContext();
  const [ratings, setRatings] = useState([]);
  const [userRating, setUserRating] = useState(null);
  const [hoveredStar, setHoveredStar] = useState(0);
  const [selectedRating, setSelectedRating] = useState(0);
  const [review, setReview] = useState('');
  const [showReviewForm, setShowReviewForm] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchRatings();
    if (user) {
      fetchUserRating();
    }
  }, [productId, user]);

  const fetchRatings = async () => {
    try {
      const { data } = await axios.get(`/api/rating/product/${productId}`);
      if (data.success) {
        setRatings(data.ratings);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const fetchUserRating = async () => {
    try {
      const { data } = await axios.get(`/api/rating/user/${productId}/${user._id}`);
      if (data.success && data.rating) {
        setUserRating(data.rating);
        setSelectedRating(data.rating.rating);
        setReview(data.rating.review || '');
      }
    } catch (error) {
      console.log(error);
    }
  };

  const submitRating = async () => {
    if (!user) {
      toast.error('Please login to rate this product');
      return;
    }

    if (selectedRating === 0) {
      toast.error('Please select a rating');
      return;
    }

    setLoading(true);
    try {
      const { data } = await axios.post('/api/rating/add', {
        productId,
        userId: user._id,
        rating: selectedRating,
        review,
        userName: user.name
      });

      if (data.success) {
        toast.success(data.message);
        setShowReviewForm(false);
        fetchRatings();
        fetchUserRating();
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error('Failed to submit rating');
    } finally {
      setLoading(false);
    }
  };

  const deleteRating = async () => {
    if (!user) return;

    setLoading(true);
    try {
      const { data } = await axios.post('/api/rating/delete', {
        productId,
        userId: user._id
      });

      if (data.success) {
        toast.success(data.message);
        setUserRating(null);
        setSelectedRating(0);
        setReview('');
        setShowReviewForm(false);
        fetchRatings();
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error('Failed to delete rating');
    } finally {
      setLoading(false);
    }
  };

  const renderStars = (rating, interactive = false) => {
    return (
      <div className="flex gap-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <svg
            key={star}
            onClick={() => interactive && setSelectedRating(star)}
            onMouseEnter={() => interactive && setHoveredStar(star)}
            onMouseLeave={() => interactive && setHoveredStar(0)}
            className={`w-5 h-5 ${interactive ? 'cursor-pointer' : ''} ${
              star <= (interactive ? (hoveredStar || selectedRating) : rating)
                ? 'fill-yellow-400 text-yellow-400'
                : 'fill-gray-300 text-gray-300'
            }`}
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
          >
            <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
          </svg>
        ))}
      </div>
    );
  };

  const averageRating = ratings.length > 0
    ? (ratings.reduce((sum, r) => sum + r.rating, 0) / ratings.length).toFixed(1)
    : 0;

  return (
    <div className="mt-8">
      <h2 className="text-2xl font-semibold mb-4">Ratings & Reviews</h2>

      {/* Average Rating Display */}
      <div className="bg-gray-50 p-6 rounded-lg mb-6">
        <div className="flex items-center gap-4">
          <div>
            <div className="text-4xl font-bold text-gray-800">{averageRating}</div>
            <div className="text-sm text-gray-600 mt-1">{ratings.length} reviews</div>
          </div>
          <div>
            {renderStars(parseFloat(averageRating))}
          </div>
        </div>
      </div>

      {/* User Rating Section */}
      {user && (
        <div className="bg-white border border-gray-200 rounded-lg p-4 mb-6">
          {!showReviewForm && !userRating ? (
            <button
              onClick={() => setShowReviewForm(true)}
              className="w-full py-2 px-4 bg-primary hover:bg-primary-dull transition text-white rounded-lg font-medium"
            >
              Rate this Product
            </button>
          ) : (
            <div>
              <h3 className="font-semibold mb-3">
                {userRating ? 'Your Rating' : 'Rate this Product'}
              </h3>
              <div className="mb-3">
                {renderStars(selectedRating, true)}
              </div>
              <textarea
                value={review}
                onChange={(e) => setReview(e.target.value)}
                placeholder="Write your review (optional)"
                className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary mb-3"
                rows="3"
              />
              <div className="flex gap-2">
                <button
                  onClick={submitRating}
                  disabled={loading || selectedRating === 0}
                  className="px-6 py-2 bg-primary hover:bg-primary-dull transition text-white rounded-lg font-medium disabled:opacity-50"
                >
                  {loading ? 'Submitting...' : userRating ? 'Update' : 'Submit'}
                </button>
                {userRating && (
                  <button
                    onClick={deleteRating}
                    disabled={loading}
                    className="px-6 py-2 bg-red-500 hover:bg-red-600 transition text-white rounded-lg font-medium disabled:opacity-50"
                  >
                    Delete
                  </button>
                )}
                <button
                  onClick={() => {
                    setShowReviewForm(false);
                    if (userRating) {
                      setSelectedRating(userRating.rating);
                      setReview(userRating.review || '');
                    } else {
                      setSelectedRating(0);
                      setReview('');
                    }
                  }}
                  className="px-6 py-2 border border-gray-300 hover:bg-gray-50 transition rounded-lg font-medium"
                >
                  Cancel
                </button>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Reviews List */}
      <div className="space-y-4">
        {ratings.length > 0 ? (
          ratings.map((rating) => (
            <div key={rating._id} className="bg-white border border-gray-200 rounded-lg p-4">
              <div className="flex items-start justify-between mb-2">
                <div>
                  <div className="font-semibold text-gray-800">{rating.userName}</div>
                  <div className="text-sm text-gray-500">
                    {new Date(rating.createdAt).toLocaleDateString('en-US', {
                      year: 'numeric',
                      month: 'short',
                      day: 'numeric'
                    })}
                  </div>
                </div>
                {renderStars(rating.rating)}
              </div>
              {rating.review && (
                <p className="text-gray-700 mt-2">{rating.review}</p>
              )}
            </div>
          ))
        ) : (
          <p className="text-center text-gray-500 py-8">No reviews yet. Be the first to review!</p>
        )}
      </div>
    </div>
  );
};

export default Rating;
