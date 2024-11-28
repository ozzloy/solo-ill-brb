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
  const { Spots, ...rest } = json;
  const spots = { spots: Spots, ...rest };
  dispatch(load(spots));
};

/////////////////////////////////////////////////////////////////////
// selectors
export const selectSpots = (state) => {
  return state.spot.spots;
};
export const selectSpotsArray = () =>
  createSelector([selectSpots], (spots) => {
    const spotsArray = Object.values(spots);
    return spotsArray;
  });

/////////////////////////////////////////////////////////////////////
// reducers

const initialSlice = { spots: {}, page: null, size: null };

const handlers = {
  [LOAD]: (slice, { spots }) => ({ ...slice, ...spots }),
};

const spotReducer = (slice = initialSlice, action) => {
  return handlers[action.type]?.(slice, action) ?? slice;
};
export default spotReducer;
