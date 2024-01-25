import { csrfFetch } from "./csrf"

const ADD_IMAGE = "/images/addImage"

const addImage = (newImage) => {
  return {
    type: ADD_IMAGE,
    newImage
  }
}

export const createImage = (payload, spotId) => async (dispatch) => {
  const res = await csrfFetch(`/api/spots/${spotId}/images`, {
    method: 'POST',
    header: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload)
  })

  if (res.ok) {
    const data = await res.json()
    console.log("IMAGE WAS CREATED: ", data)
    dispatch(addImage(data))
    return data
  }
}

const imageReducer = (state = {}, action) => {
  switch (action.type) {
    case ADD_IMAGE:
      return { ...state, createdImage: action.newImage }
    default:
      return state
  }
}

export default imageReducer