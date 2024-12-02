import { useEffect, useState } from "react";
import { FaStar } from "react-icons/fa6";

import style from "./StarRatingInput.module.css";

const StarRatingInput = ({ rating, disabled, onChange }) => {
  const enabled = !disabled;
  const [activeRating, setActiveRating] = useState(rating);

  useEffect(() => setActiveRating(rating), [rating]);

  const handleMouseEnter = (rating) => () =>
    enabled && setActiveRating(rating);
  const handleMouseLeave = () => enabled && setActiveRating(rating);
  return (
    <span className={style.ratingInput}>
      {[...Array(5).keys()].map((index) => (
        <span
          key={index}
          onMouseEnter={handleMouseEnter(index + 1)}
          onMouseLeave={handleMouseLeave}
          onClick={() => onChange(index + 1)}
          className={
            index < activeRating ? style.filled : style.empty
          }
        >
          <FaStar />
        </span>
      ))}
    </span>
  );
};
export default StarRatingInput;
