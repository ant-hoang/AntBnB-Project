import { csrfFetch } from "./csrf"

const GET_SPOTS = "/spots/getSpots"
const ADD_SPOTS = "/spots/addSpot"
const SPOT_DETAILS = "/spots/spotDetail"

const getSpot = (currentSpots) => { // action creator
  return {
    type: GET_SPOTS,
    currentSpots
  }
}

const addSpot = (newSpot) => {
  return {
    type: ADD_SPOTS,
    newSpot
  }
}

const getSpotDetailsAC = (spotDetails) => {
  return {
    type: SPOT_DETAILS,
    spotDetails
  }
}

export const fetchGetSpots = () => async (dispatch) => { // thunk
  const res = await csrfFetch('/api/spots');

  if (res.ok) {
    const data = await res.json(); // converting this from json to javascript
    const spotData = { allSpots: {} }
    for (let i = 0; i < data.Spots.length; i++) {
      let currentObj = data.Spots[i]
      spotData.allSpots[currentObj.id] = currentObj
    }
    // let spotData = {}
    // for(let i = 0; i < data.Spots.length; i++) {
    //   let currentObj = data.Spots[i]
    //   spotData[currentObj.id] = currentObj
    // }
    dispatch(getSpot(spotData))
    return spotData;
  }

  return res
}

export const getSpotDetails = (spotId) => async (dispatch) => { // a callback within a callback function, or recursive functions
  const res = await fetch(`/api/spots/${spotId}`)

  if (res.ok) {
    const data = await res.json()
    let detailedSpotData = data.Spots
    dispatch(getSpotDetailsAC(detailedSpotData))
    return data
  }

  throw res
}

export const createSpot = (payload) => async (dispatch) => {
  const res = await csrfFetch('/api/spots', {
    method: 'POST',
    header: { 'Content-Type': 'application/json'},
    body: JSON.stringify(payload)
  })

  if (res.ok) {
    const data = await res.json()
    console.log("SPOT WAS CREATED: ", data)
    dispatch(addSpot(data))
    return data
  }

  throw res
}




const spotReducer = (state = {}, action) => {
  switch (action.type) {
    case GET_SPOTS:
      return { ...state, ...action.currentSpots }
    case SPOT_DETAILS:
      return { ...state, spotDetails: action.spotDetails }
    case ADD_SPOTS:
      return { ...state }
    default:
      return state
  }
}

export default spotReducer