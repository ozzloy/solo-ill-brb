import isInteger from "is-integer";
import { useEffect } from "react";
import { FaMagnifyingGlassMinus, FaStar } from "react-icons/fa6";
import { useDispatch, useSelector } from "react-redux";

import style from "./SpotTileManage.module.css";
import { getSpotImage, selectSpotImage } from "../../store/spotImage";
import {
  getSpotReviews,
  selectSpotReviewRatings,
} from "../../store/review";
import { useNavigate } from "react-router-dom";
import { useModal } from "../../context/Modal";
import DeleteSpotModal from "../DeleteSpotModal";

/**
 * Each spot tile in the tile list should have a thumbnail image, the
 * city, and the state of the spot.
 */
const SpotTileManage = ({ spot }) => {
  const { setModalContent } = useModal();
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

  const handleTileClick = (e) => {
    e.preventDefault();
    navigate("/spots/" + id);
  };

  const handleUpdateClick = (e) => {
    e.preventDefault();
    e.stopPropagation();
    navigate("/spots/" + id + "/update");
  };

  const handleDeleteClick = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setModalContent(<DeleteSpotModal spot={spot} />);
  };

  return (
    <section
      className={style.spot}
      title={name}
      onClick={handleTileClick}
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
          <button
            onClick={handleUpdateClick}
            className={style.button}
          >
            Update
          </button>
          <button
            onClick={handleDeleteClick}
            className={style.button}
          >
            Delete
          </button>
        </div>
      </div>
    </section>
  );
};
export default SpotTileManage;
