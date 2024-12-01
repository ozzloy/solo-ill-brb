import style from "../style/Form.module.css";

function ReviewFormModal() {
  return (
    <form className={style.form}>
      <h1 className={style.h1}>review form modal title</h1>
      <input className={style.input} required />
    </form>
  );
}

export default ReviewFormModal;
