import keyBy from "lodash.keyby";
import merge from "lodash.merge";
import { csrfFetch } from "./csrf";
import { createSelector } from "reselect";
import isInteger from "is-integer";

/////////////////////////////////////////////////////////////////////
// actiion types

const LOAD = "reviews/LOAD";

const load = (reviews) => ({
  type: LOAD,
  reviews,
});

/////////////////////////////////////////////////////////////////////
// thunk action creators

export const getSpotReviews = (spotId) => async (dispatch) => {
  const response = await csrfFetch(
    "/api/spots/" + spotId + "/reviews",
  );
  const json = await response.json();
  if (!response.ok) throw json;
  const reviews = keyBy(json.Reviews, "id");
  dispatch(load({ reviews }));
};

/////////////////////////////////////////////////////////////////////
// selectors

const selectReviews = (state) => state.review.reviews;
export const selectSpotReviewRatings = (spotId) =>
  createSelector([selectReviews], (reviews) =>
    Object.values(reviews)
      .filter(
        (review) =>
          review.spotId === spotId &&
          "stars" in review &&
          isInteger(review.stars),
      )
      .map(({ stars }) => stars),
  );

/////////////////////////////////////////////////////////////////////
// reducer

const initialSlice = { reviews: {} };

const handlers = {
  [LOAD]: (slice, { reviews }) => {
    const newSlice = { ...slice };
    newSlice.reviews = merge(newSlice.reviews, reviews.reviews);
    return newSlice;
  },
};

const reviewReducer = (slice = initialSlice, action) => {
  return handlers[action.type]?.(slice, action) ?? slice;
};
export default reviewReducer;
