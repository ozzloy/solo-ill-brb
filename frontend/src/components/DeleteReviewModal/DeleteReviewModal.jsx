import { useDispatch } from "react-redux";

import style from "../style/Form.module.css";
import { deleteReview } from "../../store/review";
import { useModal } from "../../context/Modal";

function DeleteReviewModal({ reviewId }) {
  const dispatch = useDispatch();
  const { closeModal } = useModal();

  const handleDelete = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    console.log("deleting review " + reviewId);
    await dispatch(deleteReview(reviewId));
    closeModal();
  };

  const handleKeep = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    closeModal();
  };

  return (
    <form className={style.form}>
      <h2 className={style.h2}>Confirm Delete</h2>
      <p>Are you sure you want to remove this review?</p>
      <button
        onClick={handleDelete}
        className={style.delete + " " + style.button}
        style={{ backgroundColor: "red" }}
      >
        Yes (Delete Review)
      </button>
      <button
        onClick={handleKeep}
        className={style.keep + " " + style.button}
        style={{ backgroundColor: "dimgrey" }}
      >
        No (Keep Review)
      </button>
    </form>
  );
}

export default DeleteReviewModal;
