import keyBy from "lodash.keyby";
import merge from "lodash.merge";
import { createSelector } from "reselect";
import isInteger from "is-integer";

import { csrfFetch } from "./csrf";
import { body, DELETE, headers, POST } from "./fetchHelpers";

/////////////////////////////////////////////////////////////////////
// actiion types

const LOAD = "reviews/LOAD";
const REMOVE = "reviews/REMOVE";

const load = (reviews) => ({
  type: LOAD,
  reviews,
});
const remove = (id) => ({ type: REMOVE, id });

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

export const createReview = (reviewInput) => async (dispatch) => {
  const { spotId, ...reviewData } = reviewInput;
  const path = "/api/spots/" + spotId + "/reviews";
  const options = { ...POST, ...headers, ...body(reviewData) };
  const response = await csrfFetch(path, options);
  const json = await response.json();
  if (!response.ok) throw json;
  // HACK to get the latest reviews with nested data
  await dispatch(getSpotReviews(spotId));
};

export const deleteReview = (id) => async (dispatch) => {
  const path = "/api/reviews/" + id;
  const response = await csrfFetch(path, { ...DELETE });
  const json = await response.json();
  if (!response.ok) throw json;
  await dispatch(remove(id));
};

/////////////////////////////////////////////////////////////////////
// selectors

const selectReviews = (state) => state.review.reviews;

export const selectSpotReviewsNewestOldest = (spotId) =>
  createSelector([selectReviews], (reviews) =>
    Object.values(reviews)
      .filter((review) => review.spotId === spotId)
      .sort((a, b) => b.updatedAt.localeCompare(a.updatedAt)),
  );

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
  [LOAD]: (slice, { reviews }) => merge({}, slice, reviews),
  [REMOVE]: (slice, { id }) => {
    const reviews = { ...slice.reviews };
    delete reviews[id];
    return { ...slice, reviews: { ...reviews } };
  },
};

const reviewReducer = (slice = initialSlice, action) => {
  return handlers[action.type]?.(slice, action) ?? slice;
};
export default reviewReducer;
