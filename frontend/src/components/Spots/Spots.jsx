import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { getSpots, selectSpotsArray } from "../../store/spots";
import Spot from "../Spot";

const Spots = () => {
  const dispatch = useDispatch();
  const user = useSelector((state) => state.session.user);
  const navigate = useNavigate();
  const spots = useSelector(selectSpotsArray());

  useEffect(() => {
    if (!user) navigate("/");
  }, [user, navigate]);

  useEffect(() => {
    dispatch(getSpots());
  }, [dispatch]);

  if (!user) return null;
  if (!spots.length) return <h2>loading spots...</h2>;
  return (
    <>
      {spots.map((spot) => (
        <Spot spot={spot} />
      ))}
    </>
  );
};
export default Spots;
