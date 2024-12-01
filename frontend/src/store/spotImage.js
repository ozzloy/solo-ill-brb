import { csrfFetch } from "./csrf";
import { body, headers, POST } from "./fetchHelpers";

/////////////////////////////////////////////////////////////////////
// action types

const ADD = "spot-images/ADD";

const add = (spotImage) => ({ type: ADD, spotImage });

/////////////////////////////////////////////////////////////////////
// thunk action creators

export const getSpotImage = (id) => async (dispatch) => {
  const response = await csrfFetch("/api/spot-images/" + id);
  const json = await response.json();
  if (!response.ok) throw json;
  await dispatch(add(json.image));
};

export const createSpotImage =
  ({ spotId, url, preview }) =>
  async (dispatch) => {
    const options = {
      ...POST,
      ...headers,
      ...body({ url, preview }),
    };
    const response = await csrfFetch(
      "/api/spots/" + spotId + "/images",
      options,
    );
    const json = await response.json();
    if (!response.ok) throw json;
    const spotImage = { ...json, spotId };
    await dispatch(add(spotImage));
    return spotImage;
  };

/////////////////////////////////////////////////////////////////////
// selectors

export const selectSpotImage = (id) => (state) => {
  return state.spotImage.spotImages[id];
};

/////////////////////////////////////////////////////////////////////
// reducer

const initialState = { spotImages: {} };

const handlers = {
  [ADD]: (slice, { spotImage: { id, ...rest } }) => ({
    ...slice,
    spotImages: {
      ...slice.spotImages,
      [id]: { id, ...rest },
    },
  }),
};

const spotImageReducer = (state = initialState, action) => {
  return handlers[action.type]?.(state, action) ?? state;
};
export default spotImageReducer;
