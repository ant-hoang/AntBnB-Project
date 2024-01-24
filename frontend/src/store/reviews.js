import { csrfFetch } from "./csrf"

const GET_REVIEWS = "reviews/getReviews"

const getReviews = () => {
  return {
    type: GET_REVIEWS,
    reviews
  }
}

export const fetchSpotReviews = (spotId) => async (dispatch) => {
  const res = await csrfFetch(`/api/${spotId}/reviews`)

  if (res.ok) {
    const data = await res.json()
    const reviewData = {}
    for (let i = 0; i < data.Reviews.length; i++) {
      let currentObj = data.Reviews[i]
      reviewData[currentObj.id] = currentObj
    }

    dispatch(getReviews())
    return reviewData
  }

  return res
}