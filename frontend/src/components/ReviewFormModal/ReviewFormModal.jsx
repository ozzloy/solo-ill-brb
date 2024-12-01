import style from "../style/Form.module.css";
function ReviewFormModal() {
  /**
   * On the new review form, there should be a title at the top with
   * the text "How was your stay?".

   * There should be a comment text area with a placeholder of "Leave
   * your review here...".
   */
  return (
    <form className={style.form}>
      <h1 className={style.h1}>How was your stay?</h1>

      <textarea
        className={style.input}
        placeholder="Leave your review here..."
        required
      />

      <button className={style.button} type="button">
        Submit Your Review
      </button>
    </form>
  );
}

export default ReviewFormModal;
