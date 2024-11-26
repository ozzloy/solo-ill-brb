import { createSelector } from "reselect";
import { csrfFetch } from "./csrf";

const LOAD = "spots/LOAD";

/////////////////////////////////////////////////////////////////////
// actiion types

const load = (spots) => ({ type: LOAD, spots });

/////////////////////////////////////////////////////////////////////
// thunk action creators

export const getSpots = () => async (dispatch) => {
  const response = await csrfFetch("/api/spots");
  const json = await response.json();
  if (!response.ok) throw json;
  dispatch(load(json));
};

/////////////////////////////////////////////////////////////////////
// selectors
export const selectSpots = (state) => {
  return state.spots.Spots;
};
export const selectSpotsArray = () =>
  createSelector([selectSpots], (spots) => {
    const spotsArray = Object.values(spots);
    return spotsArray;
  });

/////////////////////////////////////////////////////////////////////
// reducers

const initialState = { Spots: [], page: null, size: null };

const handlers = {
  [LOAD]: (state, { spots }) => {
    const newState = { ...state, ...spots };
    return newState;
  },
};

export const spotReducer = (state = initialState, action) => {
  return handlers[action.type]?.(state, action) ?? state;
};
export default spotReducer;
