import keyBy from "lodash.keyby";
import merge from "lodash.merge";
import { createSelector } from "reselect";
import isInteger from "is-integer";

import { csrfFetch } from "./csrf";
import { body, headers, POST } from "./fetchHelpers";

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

export const createReview = (reviewInput) => async (dispatch) => {
  const { spotId, ...reviewData } = reviewInput;
  const path = "/api/spots/" + spotId + "/reviews";
  const options = { ...POST, ...headers, ...body(reviewData) };
  const response = await csrfFetch(path, options);
  const json = await response.json();
  if (!response.ok) throw json;
  const review = json;
  await dispatch(load({ reviews: { [review.id]: review } }));
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
