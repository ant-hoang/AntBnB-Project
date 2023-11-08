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
  dispatch(getSpot())
  return response;
}