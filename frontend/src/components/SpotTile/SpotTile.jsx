import isInteger from "is-integer";
import { useEffect } from "react";
import { FaMagnifyingGlassMinus, FaStar } from "react-icons/fa6";
import { useDispatch, useSelector } from "react-redux";

import style from "./SpotTile.module.css";
import { getSpotImage, selectSpotImage } from "../../store/spotImage";
import {
  getSpotReviews,
  selectSpotReviewRatings,
} from "../../store/review";
import { useNavigate } from "react-router-dom";

/**
 * Each spot tile in the tile list should have a thumbnail image, the
 * city, and the state of the spot.
 */
const SpotTile = ({ spot }) => {
  /**
   * {
   *   "lat": 34.745636,
   *   "lng": -222.478433,
   *   "price": -222.478433,
   *   "ownerId": 2,
   *   "address": "156 invented road",
   *   "city": "San Pancho",
   *   "state": "Arizona",
   *   "country": "United States of America",
   *   "name": "Spot 2",
   *   "description": "Place where web developers are exploded",
   *   "previewImage": 2,
   *   "createdAt": "2024-11-08T00:50:00.942Z",
   *   "updatedAt": "2024-11-08T00:50:00.942Z",
   *   "avgRating": "1"
   * }
   */
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { name, city, state, previewImage, id, price } = spot;
  const spotImage = useSelector(selectSpotImage(previewImage));
  const ratings = useSelector(selectSpotReviewRatings(id));
  const imageUrl = spotImage?.url;

  useEffect(() => {
    if (isInteger(previewImage)) dispatch(getSpotImage(previewImage));
    if (isInteger(id)) dispatch(getSpotReviews(id));
  }, [dispatch, id, previewImage]);

  const averageRating =
    ratings.length === 0
      ? "new"
      : (
          ratings.reduce((result, rating) => result + rating, 0) /
          ratings.length
        ).toFixed(1);

  const image = imageUrl ? (
    <img src={imageUrl} alt={name} />
  ) : (
    <span className={style.placeholder} style={{ fontSize: "100px" }}>
      <FaMagnifyingGlassMinus />
    </span>
  );

  const handleClick = (e) => {
    e.preventDefault();
    navigate("/spots/" + id);
  };

  return (
    <section
      className={style.spot}
      title={name}
      onClick={handleClick}
    >
      <header>
        <h2>{name}</h2>
      </header>
      <div className={style.content}>
        <div>
          <figure className={style.imageContainer}>{image}</figure>
          <div className={style.rating}>
            <div>average rating:</div>
            <div>
              <span className={style.star}>
                <FaStar />
              </span>
              <span>{averageRating}</span>
            </div>
          </div>
        </div>
        <div className={style.details}>
          <dl>
            <dt>city</dt>
            <dd>{city}</dd>
            <dt>state</dt>
            <dd>{state}</dd>
            <dt>price</dt>
            <dd>{price} per night</dd>
          </dl>
        </div>
      </div>
    </section>
  );
};
export default SpotTile;
