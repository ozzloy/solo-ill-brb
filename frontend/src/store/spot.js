import { createSelector } from "reselect";
import { csrfFetch } from "./csrf";
import merge from "lodash.merge";
import keyBy from "lodash.keyby";
import { POST } from "./fetchHelpers";
import { createSpotImage } from "./spotImage";

/////////////////////////////////////////////////////////////////////
// actiion types

const LOAD = "spots/LOAD";
const CREATE = "spots/CREATE";
const SET_PREVIEW = "spots/SET_PREVIEW";

const load = (spots) => ({ type: LOAD, spots });
const create = (data) => ({ type: CREATE, data });
const setPreview = (previewImageData) => ({
  type: SET_PREVIEW,
  previewImageData,
});

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

export const createSpot =
  ({
    address,
    city,
    state,
    lat,
    lng,
    country,
    name,
    description,
    price,
    previewUrl,
    imageUrls,
  }) =>
  async (dispatch) => {
    const spotData = {
      address,
      city,
      state,
      country,
      lat,
      lng,
      name,
      description,
      price,
    };
    const response = await csrfFetch("/api/spots", {
      ...POST,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(spotData),
    });
    const json = await response.json();
    if (!response.ok) throw json;
    const spot = json;
    dispatch(create(spot));
    const previewData = {
      spotId: spot.id,
      url: previewUrl,
      preview: true,
    };
    const previewImage = await dispatch(createSpotImage(previewData));
    const previewImageData = {
      spotId: previewImage.spotId,
      previewImage: previewImage.id,
    };
    dispatch(setPreview(previewImageData));
    imageUrls.forEach((url) => {
      dispatch(
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
  [SET_PREVIEW]: (
    slice,
    { previewImageData: { spotId, previewImage } },
  ) => {
    const newSlice = { ...slice };
    newSlice.spots[spotId].previewImage = previewImage;
    return newSlice;
  },
};

const spotReducer = (slice = initialSlice, action) => {
  console.log("store/spot.js:spotReducer():slice", slice);
  return handlers[action.type]?.(slice, action) ?? slice;
};
export default spotReducer;
