import { createSelector } from "reselect";
import { csrfFetch } from "./csrf";
import merge from "lodash.merge";
import keyBy from "lodash.keyby";

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
  const spots = { spots: keyBy(Spots, "id"), ...rest };
  dispatch(load(spots));
};

export const getSpot = (spotId) => async (dispatch) => {
  const response = await csrfFetch("/api/spots/" + spotId);
  const json = await response.json();
  if (!response.ok) throw json;
  const { id, ...rest } = json;
  const spots = { spots: { [id]: { id, ...rest } } };
  dispatch(load(spots));
};

/////////////////////////////////////////////////////////////////////
// selectors
export const selectSpots = (state) => {
  return state.spot.spots;
};
export const selectSpotsArray = createSelector(
  [selectSpots],
  (spots) => (spots ? Object.values(spots) : []),
);
export const selectSpot = (id) => (state) => state.spot.spots[id];

/////////////////////////////////////////////////////////////////////
// reducers

const initialSlice = { spots: {}, page: null, size: null };

const handlers = {
  [LOAD]: (slice, { spots }) => merge(spots, slice),
};

const spotReducer = (slice = initialSlice, action) => {
  return handlers[action.type]?.(slice, action) ?? slice;
};
export default spotReducer;
