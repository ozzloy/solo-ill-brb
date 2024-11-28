import { useParams } from "react-router-dom";

const SpotPage = () => {
  const { spotId } = useParams();

  return <h2>spot {spotId} page</h2>;
};
export default SpotPage;
