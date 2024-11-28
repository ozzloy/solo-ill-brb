import { csrfFetch } from "./csrf";

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
  dispatch(add(json.image));
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
  [ADD]: (state, { spotImage: { id, ...rest } }) => ({
    ...state,
    spotImages: {
      ...state.spotImages,
      [id]: { id, ...rest },
    },
  }),
};

const spotImageReducer = (state = initialState, action) => {
  return handlers[action.type]?.(state, action) ?? state;
};
export default spotImageReducer;
