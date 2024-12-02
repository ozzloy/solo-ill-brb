import { useDispatch } from "react-redux";

import style from "../style/Form.module.css";
import { deleteSpot } from "../../store/spot";
import { useModal } from "../../context/Modal";

/**
 * Clicking "Delete" on one of the spot tiles on the spot management
 * page opens a confirmation modal popup that should contain: a Title:
 * "Confirm Delete", a Message: "Are you sure you want to remove this
 * spot?", a Red button: "Yes (Delete Spot)", and a Dark grey button:
 * "No (Keep Spot)".
 */
function DeleteSpotModal({ spot }) {
  const dispatch = useDispatch();
  const { closeModal } = useModal();

  const handleDelete = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    console.log("deleting spot " + spot.id);
    await dispatch(deleteSpot(spot.id));
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
      <p>Are you sure you want to remove this spot?</p>
      <button
        onClick={handleDelete}
        className={style.delete + " " + style.button}
        style={{ backgroundColor: "red" }}
      >
        Yes (Delete Spot)
      </button>
      <button
        onClick={handleKeep}
        className={style.keep + " " + style.button}
        style={{ backgroundColor: "dimgrey" }}
      >
        No (Keep Spot)
      </button>
    </form>
  );
}

export default DeleteSpotModal;
