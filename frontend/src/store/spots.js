import { csrfFetch } from "./csrf"
import { useParams } from "react-router-dom"

const GET_SPOTS = "/spots/getSpots"
const ADD_SPOTS = "/spots/addSpot"
const SPOT_DETAILS = "/spots/spotDetail"

const getSpot = (currentSpots) => { // action creator
  return {
    type: GET_SPOTS,
    currentSpots
  }
}

// const addSpot = (spots) => {
//   return {
//     type: ADD_SPOTS,
//     spots
//   }
// }

const getSpotDetailsAC = (spotDetails) => {
  return {
    type: SPOT_DETAILS,
    spotDetails
  }
}

export const getSpots = () => async (dispatch) => { // thunk
  const response = await csrfFetch('/api/spots');

  if (response.ok) {
    const data = await response.json(); // converting this from json to javascript
    let spotData = {}
    for(let i = 0; i < data.Spots.length; i++) {
      let currentObj = data.Spots[i]
      spotData[currentObj.id] = currentObj
    }
    dispatch(getSpot(spotData))
    return spotData;
  }

  return response
}

export const getSpotDetails = (spotId) => async (dispatch) => {
  const res = await fetch (`/api/spots/${spotId}`)

  console.log("SPOT DETAILS CSRF RESPONSE:", res)
  if (res.ok) {
    const data = await res.json()
    dispatch(getSpotDetailsAC(data))
    return data
  }
}




const spotReducer = (state = {}, action) => {
  let newState = {...state}
  switch (action.type) {
    case GET_SPOTS:
      newState = {...newState, ...action.currentSpots}
      return newState;
    case SPOT_DETAILS:
      newState = {...newState, ...action.spotDetails}
      return newState
  default :
      return state
  }
}

export default spotReducer