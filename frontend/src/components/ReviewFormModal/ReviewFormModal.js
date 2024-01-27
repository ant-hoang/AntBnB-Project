import React, { useState } from "react";
import { useModal } from "../../context/Modal";
import { useDispatch } from "react-redux";
import { useSelector } from "react-redux";
import { fetchCreateReview } from "../../store/reviews";
import { useHistory } from "react-router-dom";
import "./ReviewFormModal.css";

function ReviewFormModal() {
  const dispatch = useDispatch();
  const history = useHistory()
  const [review, setReview] = useState("")
  const [rating, setRating] = useState(null);
  const [errors, setErrors] = useState({})
  const { closeModal } = useModal();
  const [hover, setHover] = useState(null);
  const [totalStars, setTotalStars] = useState(5);

  const spot = useSelector((state) => state.spots.spotDetails)

  const handleSubmit = (e) => {
    e.preventDefault()
    setErrors({})
    const payload = {
      review,
      stars: rating
    }

    dispatch(fetchCreateReview(spot.id, payload))
      .then(closeModal)
      .then(() => history.push(`/spots/${spot.id}`))
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
      <h1>How was your stay?</h1>
      {(errors.review || errors.stars) && (
        <div>
          <p>{errors.review}</p>
          <p>{errors.stars}</p>
        </div>
      )}

      <form onSubmit={handleSubmit}>
        <div>
          <textarea
            placeholder="Leave your review here..."
            value={review}
            rows={6}
            cols={60}
            onChange={(e) => setReview(e.target.value)}
            required
          ></textarea>
        </div>

        <div>
          <label>
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
        </div>


        <button type="submit">Submit Your Review</button>
      </form>
    </div>
  )
}

export default ReviewFormModal