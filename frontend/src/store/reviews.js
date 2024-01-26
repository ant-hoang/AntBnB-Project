import { csrfFetch } from "./csrf"

const GET_REVIEWS = "reviews/getReviews"

const getReviews = (reviews) => {
  return {
    type: GET_REVIEWS,
    reviews
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

const reviewReducer = (state = {}, action) => {
  switch(action.type) {
    case GET_REVIEWS:
      return { ...state, ...action.reviews}
    default:
      return state
  }
}

export default reviewReducer