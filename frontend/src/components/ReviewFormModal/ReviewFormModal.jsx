import style from "../style/Form.module.css";
function ReviewFormModal() {
  /**
   * On the new review form, there should be a title at the top with
   * the text "How was your stay?".
   */
  return (
    <form className={style.form}>
      <h1 className={style.h1}>How was your stay?</h1>

      <input className={style.input} required />
    </form>
  );
}

export default ReviewFormModal;
