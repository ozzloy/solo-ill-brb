import { useState } from "react";

import style from "../style/Form.module.css";

function ReviewFormModal() {
  /**
   * On the new review form, there should be a title at the top with
   * the text "How was your stay?".

   * There should be a comment text area with a placeholder of "Leave
   * your review here...".
   */
  const [review, setReview] = useState("");
  const [errors, setErrors] = useState({});

  const handleReviewChange = (e) => {
    const newReview = e.target.value;
    setReview(newReview);
    const newErrors = { ...errors };
    if (newErrors.review && 10 <= newReview.length) {
      delete newErrors.description;
    }
    setErrors(newErrors);
  };

  const handleReviewBlur = (e) => {
    const newReview = e.target.value;
    setReview(newReview);
    const newErrors = { ...errors };
    if (newReview.length < 10) {
      newErrors.review = "Review must be at least 10 characters";
    } else {
      delete newErrors.review;
    }
    setErrors(newErrors);
  };

  const isDisabled = review.length < 10;

  return (
    <form className={style.form}>
      <h1 className={style.h1}>How was your stay?</h1>

      <textarea
        className={style.textarea}
        placeholder="Leave your review here..."
        onChange={handleReviewChange}
        onBlur={handleReviewBlur}
        name="review"
        id="review"
        value={review}
        required
      />

      <button disabled={isDisabled} className={style.button}>
        Submit Your Review
      </button>
    </form>
  );
}

export default ReviewFormModal;
