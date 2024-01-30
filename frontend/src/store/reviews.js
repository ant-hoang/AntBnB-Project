import { csrfFetch } from "./csrf"

const GET_REVIEWS = "reviews/getReviews"
const NEW_REVIEW = "reviews/newReview"
const DELETE_REVIEW = "reviews/deleteReview"

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

const deleteReview = (review) => {
  return {
    type: DELETE_REVIEW,
    review
  }
}

export const fetchSpotReviews = (spotId) => async (dispatch) => {
  const res = await csrfFetch(`/api/spots/${spotId}/reviews`)
  if (res.ok) {
    const data = await res.json()
    const reviewData = {}
    for (let i = 0; i < data.Reviews.length; i++) {
      let currentObj = data.Reviews[i]
      reviewData[currentObj.id] = currentObj
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

export const fetchDeleteReview = (reviewId) => async (dispatch) => {
  const res = await csrfFetch(`/api/reviews/${reviewId}`, {
    method: 'DELETE'
  })

  if (res.ok) {
    dispatch(deleteReview())
  }
}

const reviewReducer = (state = {}, action) => {
  switch(action.type) {
    case GET_REVIEWS:
      return { ...action.reviews }
    case NEW_REVIEW:
      console.log("STATE IS UPDATED", { ...state, ...action.review })
      return { ...state, ...action.review }
    default:
      return state
  }
}

export default reviewReducer