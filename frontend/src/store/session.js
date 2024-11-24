import { csrfFetch } from "./csrf";
import { POST, DELETE } from "./fetchHelpers";

/////////////////////////////////////////////////////////////////////
// actiion types

const SET_USER = "session/SET_USER";
const REMOVE_USER = "session/REMOVE_USER";

const initialState = { user: null };

/////////////////////////////////////////////////////////////////////
// action creators

export const setUser = (user) => ({
  type: SET_USER,
  user,
});

export const removeUser = () => ({
  type: REMOVE_USER,
});

/////////////////////////////////////////////////////////////////////
// thunk action creators

export const login = (credential, password) => async (dispatch) => {
  const response = await csrfFetch("/api/session", {
    ...POST,
    body: JSON.stringify({ credential, password }),
  });
  const json = await response.json();
  if (!response.ok) throw json;
  const { user } = json;
  dispatch(setUser(user));
};

export const restoreUser = () => async (dispatch) => {
  const response = await csrfFetch("/api/session");
  const json = await response.json();
  const { user } = json;
  dispatch(setUser(user));
  return response;
};

export const signup = (user) => async (dispatch) => {
  const response = await csrfFetch("/api/users", {
    ...POST,
    body: JSON.stringify(user),
  });
  const json = await response.json();
  if (!response.ok) throw json;
  dispatch(setUser(json.user));
  return json.user;
};

/////////////////////////////////////////////////////////////////////
// reducers

const handlers = {
  [SET_USER]: (state, { user }) => ({ ...state, user }),
  [REMOVE_USER]: (state) => ({ ...state, user: null }),
};

const sessionReducer = (state = initialState, action) => {
  return handlers[action.type]?.(state, action) ?? state;
};
export default sessionReducer;
