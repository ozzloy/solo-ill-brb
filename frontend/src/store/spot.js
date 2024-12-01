import { createSelector } from "reselect";
import { csrfFetch } from "./csrf";
import merge from "lodash.merge";
import keyBy from "lodash.keyby";

import { body, headers, POST, PUT } from "./fetchHelpers";
import { createSpotImage } from "./spotImage";

/////////////////////////////////////////////////////////////////////
// actiion types

const LOAD = "spots/LOAD";
const CREATE = "spots/CREATE";

const load = (spots) => ({ type: LOAD, spots });
const create = (data) => ({ type: CREATE, data });

/////////////////////////////////////////////////////////////////////
// thunk action creators

export const getSpots = () => async (dispatch) => {
  const response = await csrfFetch("/api/spots");
  const json = await response.json();
  if (!response.ok) throw json;
  const { Spots, ...rest } = json;
  const spots = { spots: keyBy(Spots, "id"), ...rest };
  await dispatch(load(spots));
};

export const getSpot = (spotId) => async (dispatch) => {
  const response = await csrfFetch("/api/spots/" + spotId);
  const json = await response.json();
  if (!response.ok) throw json;
  const { id, ...rest } = json;
  const spots = { spots: { [id]: { id, ...rest } } };
  await dispatch(load(spots));
};

export const updateSpot =
  ({ id, ...spot }) =>
  async (dispatch) => {
    const options = {
      ...PUT,
      ...headers,
      ...body(spot),
    };
    const response = await csrfFetch("/api/spots/" + id, options);
    const json = await response.json();
    if (!response.ok) throw json;
    const updatedSpot = json;
    const spots = { spots: { [id]: updatedSpot } };
    await dispatch(load(spots));
  };

export const createSpot =
  ({ previewUrl, imageUrls, ...spotData }) =>
  async (dispatch) => {
    const response = await csrfFetch("/api/spots", {
      ...POST,
      ...headers,
      ...body(spotData),
    });
    const json = await response.json();
    if (!response.ok) throw json;
    const spot = json;
    await dispatch(create(spot));
    const previewData = {
      spotId: spot.id,
      url: previewUrl,
      preview: true,
    };
    const previewImage = await dispatch(createSpotImage(previewData));
    spot.previewImage = previewImage.id;
    await dispatch(updateSpot(spot));
    imageUrls.forEach(async (url) => {
      await dispatch(
        createSpotImage({ spotId: spot.id, url, preview: false }),
      );
    });
    return spot.id;
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
  [LOAD]: (slice, { spots }) => merge({}, slice, spots),
  [CREATE]: (slice, { data }) =>
    merge({}, slice, { spots: { [data.id]: data } }),
};

const spotReducer = (slice = initialSlice, action) => {
  return handlers[action.type]?.(slice, action) ?? slice;
};
export default spotReducer;
