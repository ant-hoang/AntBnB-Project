import React, { useState } from "react";
import { useModal } from "../../context/Modal";
import { useDispatch } from "react-redux";
import { useSelector } from "react-redux";
import { fetchCreateReview, fetchSpotReviews } from "../../store/reviews";
import { getSpotDetails } from "../../store/spots";
import { useHistory } from "react-router-dom";
import "./ReviewFormModal.css";

function ReviewFormModal(spot) {
  const dispatch = useDispatch();
  const history = useHistory()
  const [review, setReview] = useState("")
  const [rating, setRating] = useState(null);
  const [errors, setErrors] = useState({})
  const { closeModal } = useModal();
  const [hover, setHover] = useState(null);
  const [totalStars, setTotalStars] = useState(5);

  // const spot = useSelector((state) => state.spots.spotDetails)

  // console.log(spot)

  const handleSubmit = (e) => {
    e.preventDefault()
    setErrors({})

    const payload = {
      review,
      stars: rating
    }

    dispatch(fetchCreateReview(spot.id, payload))
      .then(() => dispatch(getSpotDetails(spot.id)))
      .then(() => dispatch(fetchSpotReviews(spot.id)))
      .then(closeModal)
      .then(() => {
        history.push(`/spots/${spot.id}`)
      })

      .catch(async (res) => {
        const data = await res.json();
        if (data && data.errors) {
          setErrors(data.errors);
        }
      });

    reset()
    return
  }

  const reset = () => {
    setRating(null)
    setReview("")
  }

  return (
    <div>
      <h1 className="review-h1">How was your stay?</h1>
      {(errors.review || errors.stars) && (
        <div>
          <p>{errors.review}</p>
          <p>{errors.stars}</p>
        </div>
      )}

      <form className="review-form" onSubmit={handleSubmit}>
        <textarea
          placeholder="Leave your review here..."
          value={review}
          rows={6}
          cols={60}
          onChange={(e) => setReview(e.target.value)}
          required
        ></textarea>

        <label className="review-label">
          {[...Array(totalStars)].map((star, index) => {
            const currentRating = index + 1;

            return (
              <label key={index}>
                <input
                  type="radio"
                  className="rating"
                  value={currentRating}
                  onChange={() => setRating(currentRating)}
                />
                <span
                  className="star"
                  style={{
                    color:
                      currentRating <= (hover || rating) ? "#ffc107" : "#e4e5e9"
                  }}
                  onMouseEnter={() => setHover(currentRating)}
                  onMouseLeave={() => setHover(null)}
                >
                  &#9733;
                </span>
              </label>
            );
          })} Stars
        </label>
        <button disabled={review.length < 10 || !rating} className="review-button" type="submit">Submit Your Review</button>
      </form>
    </div>
  )
}

export default ReviewFormModal