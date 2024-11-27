import { createSelector } from "reselect";
import { csrfFetch } from "./csrf";

/////////////////////////////////////////////////////////////////////
// actiion types

const LOAD = "spots/LOAD";

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
  return state.spot.Spots;
};
export const selectSpotsArray = () =>
  createSelector([selectSpots], (spots) => {
    const spotsArray = Object.values(spots);
    return spotsArray;
  });

/////////////////////////////////////////////////////////////////////
// reducers

const initialSlice = { Spots: {}, page: null, size: null };

const handlers = {
  [LOAD]: (slice, { spots }) => ({ ...slice, ...spots }),
};

const spotReducer = (slice = initialSlice, action) => {
  return handlers[action.type]?.(slice, action) ?? slice;
};
export default spotReducer;
