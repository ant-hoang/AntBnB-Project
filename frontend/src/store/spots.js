import { csrfFetch } from "./csrf"

const GET_SPOTS = "/spots"

const getSpot = () => {
  return {
    type: GET_SPOTS
  }
}

export const getSpots = () => async (dispatch) => {
  const response = await csrfFetch('/api/spots');
  const data = await response.json();
  dispatch(getSpot(data))
  return response;
}

const spotReducer = (state = {}, action) => {
  let newStateswitch 
  switch (action.type) {
    case GET_SPOTS:
      newState = Object.assign({}, state)
      return newState;
  }
}

export default spotReducer