import style from "./Spot.module.css";

const Spot = ({ spot }) => {
  const { name } = spot;
  console.log("Spot.jsx:Spot:spot", spot);
  return <div className={style.spot}>{name}</div>;
};
export default Spot;
