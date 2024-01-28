// frontend/src/store/session.js
import { csrfFetch } from "./csrf";

const SET_USER = "session/setUser";
const REMOVE_USER = "session/removeUser";

const setUser = (user) => {
  return {
    type: SET_USER,
    payload: user,
  };
};

const removeUser = () => {
  return {
    type: REMOVE_USER,
  };
};

export const logout = () => async (dispatch) => {
  const res = await csrfFetch('/api/session', {
    method: 'DELETE',
  });

  if(res.ok) {
    dispatch(removeUser());
  }

  return res;
};

export const signup = (user) => async (dispatch) => {
  const { username, firstName, lastName, email, password } = user;
  const res = await csrfFetch("/api/users", {
    method: "POST",
    body: JSON.stringify({
      username,
      firstName,
      lastName,
      email,
      password,
    }),
  });

  if(res.ok) {
    const data = await res.json();
    dispatch(setUser(data.user));
    return data
  }
  
  return res;
};

export const restoreUser = () => async (dispatch) => {
  const res = await csrfFetch("/api/session");
  
  if(res.ok) {
    const data = await res.json();
    dispatch(setUser(data.user));
    return data
  }
  return res;
};

export const login = (user) => async (dispatch) => {
  const { credential, password } = user;
  const res = await csrfFetch("/api/session", {
    method: "POST",
    body: JSON.stringify({
      credential,
      password,
    }),
  });

  if(res.ok) {
    const data = await res.json();
    dispatch(setUser(data.user));
    return data
  }
  console.log("LOGIN THUNK: ", res)
  return res;
};

const initialState = { user: null };

const sessionReducer = (state = initialState, action) => {
  let newState;
  switch (action.type) {
    case SET_USER:
      newState = Object.assign({}, state);
      newState.user = action.payload;
      return newState;
    case REMOVE_USER:
      newState = Object.assign({}, state);
      newState.user = null;
      return newState;
    default:
      return state;
  }
};

export default sessionReducer;