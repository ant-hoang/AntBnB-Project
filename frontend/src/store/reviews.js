import { csrfFetch } from "./csrf"

const GET_REVIEWS = "reviews/getReviews"
const NEW_REVIEW = "reviews/newReview"

const getReviews = (reviews) => {
  return {
    type: GET_REVIEWS,
    reviews
  }
}

const newReview = (review) => {
  return {
    type: NEW_REVIEW,
    review
  }
}

export const fetchSpotReviews = (spotId) => async (dispatch) => {
  const res = await csrfFetch(`/api/spots/${spotId}/reviews`)
  if (res.ok) {
    const data = await res.json()
    const reviewData = {spotReviews: {}}
    for (let i = 0; i < data.Reviews.length; i++) {
      let currentObj = data.Reviews[i]
      reviewData.spotReviews[currentObj.id] = currentObj
    }

    dispatch(getReviews(reviewData))
    return reviewData
  }

  return res
}

export const fetchCreateReview = (spotId, payload) => async (dispatch) => {
  const res = await csrfFetch(`/api/spots/${spotId}/reviews`, {
    method: 'POST',
    header: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload)
  })

  if (res.ok) {
    const data = await res.json()
    console.log("REVIEW WAS CREATED: ", data)
    dispatch(newReview(data))
    return data
  }

  return res
}

const reviewReducer = (state = {}, action) => {
  switch(action.type) {
    case GET_REVIEWS:
      return { ...state, ...action.reviews}
    case NEW_REVIEW:
      return { ...state, createdReview: action.review }
    default:
      return state
  }
}

export default reviewReducer