import { useState } from "react";
import style from "./Spot.module.css";
import { FaMagnifyingGlassMinus } from "react-icons/fa6";

/**
 * Each spot tile in the tile list should have a thumbnail image, the
 * city, and the state of the spot.
 */
const Spot = ({ spot }) => {
  /**
   * Spot.jsx:Spot:spot {
   *   "lat": 34.745636,
   *   "lng": -222.478433,
   *   "price": -222.478433,
   *   "ownerId": 2,
   *   "address": "156 invented road",
   *   "city": "San Pancho",
   *   "state": "Arizona",
   *   "country": "United States of America",
   *   "name": "Spot 2",
   *   "description": "Place where web developers are exploded",
   *   "previewImage": 2,
   *   "createdAt": "2024-11-08T00:50:00.942Z",
   *   "updatedAt": "2024-11-08T00:50:00.942Z",
   *   "avgRating": "1"
   * }
   */
  const [imageUrl, setImageUrl] = useState("");
  const { name, city, state } = spot;
  return (
    <section className={style.spot}>
      <h2>{name}</h2>
      {imageUrl ? (
        <img className={style.img} src={imageUrl} alt={name} />
      ) : (
        <span className={style.img}>
          <FaMagnifyingGlassMinus />
        </span>
      )}
      city: {city} state: {state}
    </section>
  );
};
export default Spot;
