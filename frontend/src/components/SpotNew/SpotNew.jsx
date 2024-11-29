import style from "./SpotNew.module.css";

const SpotNew = () => (
  <form className={style.form}>
    <h2>new spot</h2>
    <input className={style.input} placeholder="spot name" />
    <input className={style.input} placeholder="spot name" />
    <button>submit</button>
  </form>
);
export default SpotNew;
