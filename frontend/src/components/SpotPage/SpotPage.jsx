import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import { useEffect } from "react";
import { FaMagnifyingGlassMinus, FaStar } from "react-icons/fa6";

import style from "./SpotPage.module.css";
import {
  getSpotReviews,
  selectSpotReviewsNewestOldest,
} from "../../store/review";
import { getSpot, selectSpot } from "../../store/spot";
import ReviewFormModal from "../ReviewFormModal";
import { useModal } from "../../context/Modal";
import DeleteReviewModal from "../DeleteReviewModal";

/**
 * If the current user is logged-in and they are viewing a spot's
 * detail page for a spot that they HAVE NOT posted a review yet, a
 * "Post Your Review" button shows between the rating/reviews heading
 * and the list of reviews.
 */
const UserHasNotReviewedYet = ({ spot }) => {
  const sessionUser = useSelector((state) => state.session.user);
  const reviews = useSelector(selectSpotReviewsNewestOldest(spot.id));
  const { setModalContent } = useModal();
  if (!sessionUser) {
    return <></>;
  }
  const userReviews = reviews.filter(
    (review) => review.userId === sessionUser.id,
  );
  const onClick = () => {
    setModalContent(<ReviewFormModal spot={spot} />);
  };
  if (userReviews.length === 0 && sessionUser.id !== spot.ownerId)
    return (
      <button onClick={onClick} className={style.postYourReview}>
        Post Your Review
      </button>
    );
  return <></>;
};

/**
 * If no reviews have been posted yet and the current user is
 * logged-in and is NOT the owner of the spot, replace the reviews
 * list with the text "Be the first to post a review!"
 */
const NoReviewsYet = ({ ownerId }) => {
  const sessionUser = useSelector((state) => state.session.user);
  if (sessionUser && sessionUser.id !== ownerId) {
    return <div>Be the first to post a review!</div>;
  }
  return <></>;
};

/**
 * Each review in the review list must include: The reviewer's first
 * name, the month and the year that the review was posted (e.g.
 * December 2022), and the review comment text.
 */
const ReviewList = ({ spotId, ownerId }) => {
  const dispatch = useDispatch();
  const sessionUser = useSelector((state) => state.session.user);
  const reviews = useSelector(selectSpotReviewsNewestOldest(spotId));
  const { setModalContent } = useModal();

  useEffect(() => {
    dispatch(getSpotReviews(spotId));
  }, [dispatch, spotId]);

  const months = [
    "january",
    "february",
    "march",
    "april",
    "may",
    "june",
    "july",
    "august",
    "september",
    "october",
    "november",
    "december",
  ];

  if (reviews.length === 0) {
    return <NoReviewsYet ownerId={ownerId} />;
  }
  const handleReviewDeleteClick = (reviewId) => (e) => {
    e.preventDefault();
    e.stopPropagation();
    setModalContent(<DeleteReviewModal reviewId={reviewId} />);
  };

  return reviews.map((review) => {
    const { firstName } = review.User;
    const { updatedAt } = review;
    const when = new Date(updatedAt);
    const month = months[when.getMonth()];
    const year = when.getFullYear();
    return (
      <div key={review.id} className={style.review}>
        <div>
          in {month} of {year}, {firstName} said:
        </div>
        <div>{review.review} </div>
        {sessionUser && review.userId === sessionUser.id && (
          <button
            className={style.button}
            onClick={handleReviewDeleteClick(review.id)}
          >
            Delete
          </button>
        )}
      </div>
    );
  });
};

const ReviewSummary = ({ avgStarRating, numReviews }) => (
  <div className={style.reviewSummary}>
    <div className={style.star}>
      {avgStarRating} <FaStar />
    </div>
    {numReviews === 0 ? "" : <>&middot;</>}
    <span className={style.numReviews}>
      {numReviews === 0
        ? "new"
        : numReviews + " review" + (numReviews === 1 ? "" : "s")}
    </span>
  </div>
);

/**
 * On the spot's detail page, the following information should be
 * present: a Heading <spot name>, Location: <city>, <state>,
 * <country>, Images (1 large image and 4 small images), Text: Hosted
 * by <first name>, <last name>, Paragraph: <description>, and the
 * callout information box on the right, below the images.
 */

const SpotExists = ({ spot }) => {
  const {
    Owner: { firstName, lastName, id: ownerId },
    SpotImages,
    avgStarRating,
    city,
    country,
    description,
    id,
    name,
    numReviews,
    price,
    state,
  } = spot;
  const previewImage = SpotImages.find((image) => image.preview);
  const images = SpotImages.filter((image) => !image.preview);

  return (
    <>
      <h2 className={style.header}>{name}</h2>
      <div className={style.location}>
        <span className={style.label}>location:</span>
        <span className={style.detail}>
          {city}, {state}, {country}
        </span>
      </div>
      <div className={style.hosted}>
        <span className={style.label}>hosted by:</span>
        <span className={style.detail}>
          {firstName} {lastName}
        </span>
      </div>
      {previewImage ? (
        <img className={style.preview} src={previewImage.url} />
      ) : (
        <span className={style.loading} style={{ fontSize: "300px" }}>
          <FaMagnifyingGlassMinus />
        </span>
      )}
      {images.map(({ url }) => (
        <img key={url} className={style.images} src={url} />
      ))}
      <div className={style.details}>
        <p className={style.description}>{description}</p>
        <div className={style.callout}>
          <div>
            <span className={style.price}>{price} / night</span>
            <button onClick={() => alert("Feature coming soon")}>
              reserve
            </button>
          </div>
          <ReviewSummary
            avgStarRating={avgStarRating}
            numReviews={numReviews}
          />
        </div>
      </div>
      <section className={style.reviews}>
        <header>
          <h2>reviews</h2>
          <ReviewSummary
            avgStarRating={avgStarRating}
            numReviews={numReviews}
          />
        </header>
        <UserHasNotReviewedYet spot={spot} />
        <ReviewList spotId={id} ownerId={ownerId} />
      </section>
    </>
  );
};

const SpotPage = () => {
  const dispatch = useDispatch();
  const { spotId } = useParams();
  const spot = useSelector(selectSpot(spotId));

  useEffect(() => {
    dispatch(getSpot(spotId));
  }, [dispatch, spotId]);

  const requiredKeys = [
    "Owner",
    "SpotImages",
    "avgStarRating",
    "city",
    "country",
    "description",
    "id",
    "name",
    "numReviews",
    "price",
    "state",
  ];
  const spotHasRequiredKeys =
    spot && requiredKeys.every((key) => key in spot);
  if (!spotHasRequiredKeys) return <h2>loading spot details...</h2>;
  return <SpotExists spot={spot} />;
};
export default SpotPage;
