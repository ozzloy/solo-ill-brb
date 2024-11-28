import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import { getSpot, selectSpot } from "../../store/spot";
import { useEffect } from "react";

/**
 * On the spot's detail page, the following information should be
 * present: a Heading <spot name>, Location: <city>, <state>,
 * <country>, Images (1 large image and 4 small images), Text: Hosted
 * by <first name>, <last name>, Paragraph: <description>, and the
 * callout information box on the right, below the images.
 */

/**
 *  {
 *    "id": 1,
 *    "ownerId": 1,
 *    "address": "123 Disney Lane",
 *    "city": "San Francisco",
 *    "state": "California",
 *    "country": "United States of America",
 *    "lat": 37.7645358,
 *    "lng": -122.4730327,
 *    "name": "App Academy",
 *    "description": "Place where web developers are created",
 *    "price": 123,
 *    "createdAt": "2021-11-19 20:39:36",
 *    "updatedAt": "2021-11-19 20:39:36" ,
 *    "numReviews": 5,
 *    "avgStarRating": 4.5,
 *    "SpotImages": [
 *      {
 *        "id": 1,
 *        "url": "image url",
 *        "preview": true
 *      },
 *      {
 *        "id": 2,
 *        "url": "image url",
 *        "preview": false
 *      }
 *    ],
 *    "Owner": {
 *      "id": 1,
 *      "firstName": "John",
 *      "lastName": "Smith"
 *    }
 *  }
 */

const SpotExists = ({ name, city, state, country }) => (
  <>
    <h2>{name}</h2>
    <dl>
      <dt>city</dt>
      <dd>{city}</dd>
      <dt>state</dt>
      <dd>{state}</dd>
      <dt>country</dt>
      <dd>{country}</dd>
    </dl>
  </>
);

const SpotPage = () => {
  const dispatch = useDispatch();
  const { spotId } = useParams();
  const spot = useSelector(selectSpot(spotId));
  useEffect(() => {
    dispatch(getSpot(spotId));
  }, [dispatch]);
  if (spot) return SpotExists(spot);
  return <h2>loading spot details...</h2>;
};
export default SpotPage;
