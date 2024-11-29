import { useState } from "react";
import isInteger from "is-integer";

import style from "./SpotNew.module.css";

const SpotNew = () => {
  const [country, setCountry] = useState("");
  const [street, setStreet] = useState("");
  const [city, setCity] = useState("");
  const [state, setState] = useState("");
  const [description, setDescription] = useState("");
  const [name, setName] = useState("");
  const [price, setPrice] = useState(0);

  const isDisabled =
    country.length === 0 ||
    street.length === 0 ||
    city.length === 0 ||
    state.length === 0 ||
    description.length < 30 ||
    name.length === 0 ||
    !isInteger(price) ||
    price <= 0;

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log(
      "components/SpotNew.jsx:SpotNew():handleSubmit(e):country",
      country,
    );
  };

  return (
    <form className={style.form} onSubmit={handleSubmit}>
      <h2 className={style.h2}>Create a New Spot</h2>
      {/**
       * The first section should include: a heading of "Where's your
       * place located?", a caption of "Guests will only get your exact
       * address once they booked a reservation.", and text inputs with
       * labels and placeholders for "Country", "Street Address",
       * "City", and "State" ("Latitude" and "Longitude" inputs are
       * optional for MVP)
       */}
      <h3 className={style.h3}>Where's your place located?</h3>
      <p>
        Guests will only get your exact address once they booked a
        reservation.
      </p>
      <div className={style.inputs}>
        <div className={style.row}>
          <label htmlFor="country">Country</label>
          <input
            name="country"
            id="country"
            value={country}
            onChange={(e) => setCountry(e.target.value)}
            className={style.input}
            placeholder="Country"
          />
        </div>
        <div className={style.row}>
          <label>Street Address</label>
          <input
            name="street"
            id="street"
            value={street}
            className={style.input}
            onChange={(e) => setStreet(e.target.value)}
            placeholder="Street Address"
          />
        </div>
        <div className={style.row}>
          <label>City</label>
          <input
            name="city"
            id="city"
            value={city}
            onChange={(e) => setCity(e.target.value)}
            className={style.input}
            placeholder="City"
          />
        </div>
        <div className={style.row}>
          <label>State</label>
          <input
            name="state"
            id="state"
            value={state}
            onChange={(e) => setState(e.target.value)}
            className={style.input}
            placeholder="State"
          />
        </div>
        <div className={style.row + " " + style.future}>
          <label>Latitude</label>
          <input
            className={style.input}
            placeholder="future feature Latitude"
            disabled={true}
          />
        </div>
        <div className={style.row + " " + style.future}>
          <label>Longitude</label>
          <input
            className={style.input}
            placeholder="future feature Longitude"
            disabled={true}
          />
        </div>
      </div>

      {/**
       * The second section should include: a heading of "Describe your
       * place to guests", a caption of "Mention the best features of
       * your space, any special amentities like fast wifi or parking,
       * and what you love about the neighborhood.", and a text area
       * with a placeholder of "Please write at least 30 characters".
       */}
      <h3 className={style.h3}>Describe your place to guests</h3>
      <p>
        Mention the best features of your space, any special
        amentities like fast wifi or parking, and what you love about
        the neighborhood.
      </p>
      <textarea
        name="description"
        id="description"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        className={style.description}
        placeholder="Please write at least 30 characters"
      ></textarea>

      {/**
       * The third section should include: a heading of "Create a title
       * for your spot", a caption of "Catch guests' attention with a
       * spot title that highlights what makes your place special.",
       * and a text input with a placeholder of "Name of your spot".
       */}
      <h3 className={style.h3}>Create a title for your spot</h3>
      <p>
        Catch guests' attention with a spot title that highlights what
        makes your place special.
      </p>
      <div className={style.inputs}>
        <div className={style.row}>
          <label>Name of your spot</label>
          <input
            name="name"
            id="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className={style.input}
            placeholder="Name of your spot"
          />
        </div>
      </div>

      {/**
       * The fourth section should include: a heading of "Set a base
       * price for your spot", a caption of "Competitive pricing can
       * help your listing stand out and rank higher in search
       * results.", and a number input with a placeholder of "Price
       * per night (USD)".
       */}
      <h3 className={style.h3}>Set a base price for your spot</h3>
      <p>
        Competitive pricing can help your listing stand out and rank
        higher in search results.
      </p>
      <div className={style.inputs}>
        <div className={style.row}>
          <label>Price per night (USD)</label>
          <input
            name="price"
            id="price"
            value={price}
            onChange={(e) => setPrice(parseInt(e.target.value) || 0)}
            type="number"
            className={style.input}
            placeholder="Price per night (USD)"
          />
        </div>
      </div>

      {/**
       * The fifth section should include: a heading of "Liven up your
       * spot with photos", a caption of "Submit a link to at least one
       * photo to publish your spot.", and five text inputs where the
       * first input has a placeholder of "Preview Image URL" and the
       * rest of the inputs have a placeholder of "Image URL".
       */}
      <h3 className={style.h3}>Liven up your spot with photos</h3>
      <p>Submit a link to at least one photo to publish your spot.</p>
      <div className={style.inputs}>
        <div className={style.row}>
          <label>Preview Image URL</label>
          <input
            className={style.input}
            placeholder="Preview Image URL"
          />
        </div>
        <div className={style.row}>
          <label>Image URL</label>
          <input className={style.input} placeholder="Image URL" />
        </div>
        <div className={style.row}>
          <label>Image URL</label>
          <input className={style.input} placeholder="Image URL" />
        </div>
        <div className={style.row}>
          <label>Image URL</label>
          <input className={style.input} placeholder="Image URL" />
        </div>
        <div className={style.row}>
          <label>Image URL</label>
          <input className={style.input} placeholder="Image URL" />
        </div>
      </div>

      {/** The submit button should have the text of "Create Spot". */}
      <button disabled={isDisabled} className={style.button}>
        Create Spot
      </button>
    </form>
  );
};
export default SpotNew;
