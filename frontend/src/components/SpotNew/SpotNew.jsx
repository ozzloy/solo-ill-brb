import { useEffect, useState } from "react";

import style from "./SpotNew.module.css";
import { useDispatch, useSelector } from "react-redux";
import { createSpot } from "../../store/spot";
import { useNavigate } from "react-router-dom";

const isValidNumberString = (string) =>
  string.trim() !== "" && !isNaN(Number(string));

const isValidUrlString = (string) => {
  try {
    new URL(string);
    return true;
  } catch {
    return false;
  }
};

const SpotNewUserExists = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [lat, setLat] = useState("");
  const [lng, setLng] = useState("");
  const [country, setCountry] = useState("");
  const [address, setAddress] = useState("");
  const [city, setCity] = useState("");
  const [state, setState] = useState("");
  const [description, setDescription] = useState("");
  const [name, setName] = useState("");
  const [price, setPrice] = useState("1");
  const [previewUrl, setPreviewUrl] = useState("");
  const [image1, setImage1] = useState("");
  const [image2, setImage2] = useState("");
  const [image3, setImage3] = useState("");
  const [image4, setImage4] = useState("");
  const [errors, setErrors] = useState({});

  const handleCountryBlur = (e) => {
    const newCountry = e.target.value;
    setCountry(newCountry);
    const newErrors = { ...errors };
    if (newCountry.length) {
      delete newErrors.country;
    } else {
      newErrors.country = "Country is required";
    }
    setErrors(newErrors);
  };

  const handleAddressBlur = (e) => {
    const newAddress = e.target.value;
    setAddress(newAddress);
    const newErrors = { ...errors };
    if (newAddress.length) {
      delete newErrors.address;
    } else {
      newErrors.address = "Address is required";
    }
    setErrors(newErrors);
  };

  const handleCityBlur = (e) => {
    const newCity = e.target.value;
    setCity(newCity);
    const newErrors = { ...errors };
    if (newCity.length) {
      delete newErrors.city;
    } else {
      newErrors.city = "City is required";
    }
    setErrors(newErrors);
  };

  const handleStateBlur = (e) => {
    const newState = e.target.value;
    setState(newState);
    const newErrors = { ...errors };
    if (newState.length) {
      delete newErrors.state;
    } else {
      newErrors.state = "State is required";
    }
    setErrors(newErrors);
  };

  const latTypingRegex =
    /^-?(?:90(?:\.0*)?|(?:\d|[1-8]\d)(?:\.\d*)?)?$/;
  const latRegex = /^-?(?:90(?:\.0*)?|(?:\d|[1-8]\d)(?:\.\d*)?)$/;
  const latError =
    "Latitude must be a number from the range -90 to 90";
  const handleLatChange = (e) => {
    const newLat = e.target.value;
    setLat(newLat);
    const newErrors = { ...errors };
    if (latTypingRegex.test(newLat)) {
      delete newErrors.lat;
    } else {
      newErrors.lat = latError;
    }
    setErrors(newErrors);
  };

  const handleLatBlur = (e) => {
    const newLat = e.target.value;
    setLat(newLat);
    const newErrors = { ...errors };
    if (latRegex.test(newLat)) {
      delete newErrors.lat;
    } else {
      newErrors.lat = latError;
    }
    setErrors(newErrors);
  };

  const lngTypingRegex =
    /^-?(?:180(?:\.0*)?|(?:\d|[1-9]\d|1[0-7]\d)(?:\.\d*)?)?$/;
  const lngRegex =
    /^-?(?:180(?:\.0*)?|(?:\d|[1-9]\d|1[0-7]\d)(?:\.\d*)?)$/;
  const lngError =
    "Longitude must be a number from the range -180 to 180";
  const handleLngChange = (e) => {
    const newLng = e.target.value;
    setLng(newLng);
    const newErrors = { ...errors };
    if (lngTypingRegex.test(newLng)) {
      delete newErrors.lng;
    } else {
      newErrors.lng = lngError;
    }
    setErrors(newErrors);
  };

  const handleLngBlur = (e) => {
    const newLng = e.target.value;
    setLng(newLng);
    const newErrors = { ...errors };
    if (lngRegex.test(newLng)) {
      delete newErrors.lng;
    } else {
      newErrors.lng = lngError;
    }
    setErrors(newErrors);
  };

  const handleDescriptionChange = (e) => {
    const newDescription = e.target.value;
    setDescription(newDescription);
    const newErrors = { ...errors };
    if (newErrors.description && 30 <= newDescription.length) {
      delete newErrors.description;
    }
    setErrors(newErrors);
  };

  const handleDescriptionBlur = (e) => {
    const newDescription = e.target.value;
    setDescription(newDescription);
    const newErrors = { ...errors };
    if (newDescription.length < 30) {
      newErrors.description =
        "Description must be at least 30 characters";
    } else {
      delete newErrors.description;
    }
    setErrors(newErrors);
  };

  const handleNameBlur = (e) => {
    const newName = e.target.value;
    setName(newName);
    const newErrors = { ...errors };
    if (newName.length) {
      delete newErrors.name;
    } else {
      newErrors.name = "Name is required";
    }
    setErrors(newErrors);
  };

  const handlePriceBlur = (e) => {
    const newPrice = e.target.value;
    setPrice(newPrice);
    const newErrors = { ...errors };

    if (isValidNumberString(newPrice) && 0 < Number(newPrice)) {
      delete newErrors.price;
    } else {
      newErrors.price = "Price per night must be a positive number";
    }
    setErrors(newErrors);
  };

  const handlePreviewUrlBlur = (e) => {
    const newPreviewUrl = e.target.value;
    setPreviewUrl(newPreviewUrl);
    const newErrors = { ...errors };
    if (isValidUrlString(newPreviewUrl)) {
      delete newErrors.previewUrl;
    } else {
      newErrors.previewUrl = "Preview image url must be a valid url";
    }
    setErrors(newErrors);
  };

  const handleImage1Blur = (e) => {
    const newImage1 = e.target.value;
    setImage1(newImage1);
    const newErrors = { ...errors };
    if (isValidUrlString(newImage1) || newImage1.length === 0) {
      delete newErrors.image1;
    } else {
      newErrors.image1 = "image url must be a valid url or blank";
    }
    setErrors(newErrors);
  };

  const handleImage2Blur = (e) => {
    const newImage2 = e.target.value;
    setImage2(newImage2);
    const newErrors = { ...errors };
    if (isValidUrlString(newImage2) || newImage2.length === 0) {
      delete newErrors.image2;
    } else {
      newErrors.image2 = "image url must be a valid url or blank";
    }
    setErrors(newErrors);
  };

  const handleImage3Blur = (e) => {
    const newImage3 = e.target.value;
    setImage3(newImage3);
    const newErrors = { ...errors };
    if (isValidUrlString(newImage3) || newImage3.length === 0) {
      delete newErrors.image3;
    } else {
      newErrors.image3 = "image url must be a valid url or blank";
    }
    setErrors(newErrors);
  };

  const handleImage4Blur = (e) => {
    const newImage4 = e.target.value;
    setImage4(newImage4);
    const newErrors = { ...errors };
    if (isValidUrlString(newImage4) || newImage4.length === 0) {
      delete newErrors.image4;
    } else {
      newErrors.image4 = "image url must be a valid url or blank";
    }
    setErrors(newErrors);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const imageUrls = [image1, image2, image3, image4].filter(
      (i) => i,
    );
    const spotId = await dispatch(
      createSpot({
        address,
        city,
        state,
        lat: Number(lat),
        lng: Number(lng),
        country,
        name,
        description,
        price: Number(price),
        previewUrl,
        imageUrls,
      }),
    );
    navigate("/spots/" + spotId);
  };

  const isDisabled =
    country.length === 0 ||
    address.length === 0 ||
    city.length === 0 ||
    state.length === 0 ||
    description.length < 30 ||
    name.length === 0 ||
    !isValidNumberString(price) ||
    price <= 0 ||
    previewUrl.length === 0 ||
    !latRegex.test(lat) ||
    !lngRegex.test(lng) ||
    Object.keys(errors).length !== 0;

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
      <h3 className={style.h3}>Where&apos;s your place located?</h3>
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
            onBlur={handleCountryBlur}
            className={style.input}
            placeholder="Country"
          />
        </div>
        {errors.country && (
          <div className={style.error}>{errors.country}</div>
        )}
        <div className={style.row}>
          <label>Street Address</label>
          <input
            name="address"
            id="address"
            value={address}
            className={style.input}
            onChange={(e) => setAddress(e.target.value)}
            onBlur={handleAddressBlur}
            placeholder="Street Address"
          />
        </div>
        {errors.address && (
          <div className={style.error}>{errors.address}</div>
        )}
        <div className={style.row}>
          <label>City</label>
          <input
            name="city"
            id="city"
            value={city}
            onChange={(e) => setCity(e.target.value)}
            onBlur={handleCityBlur}
            className={style.input}
            placeholder="City"
          />
        </div>
        {errors.city && (
          <div className={style.error}>{errors.city}</div>
        )}
        <div className={style.row}>
          <label>State</label>
          <input
            name="state"
            id="state"
            value={state}
            onChange={(e) => setState(e.target.value)}
            onBlur={handleStateBlur}
            className={style.input}
            placeholder="State"
          />
        </div>
        {errors.state && (
          <div className={style.error}>{errors.state}</div>
        )}
        <div className={style.row}>
          <label>Latitude</label>
          <input
            name="lat"
            id="lat"
            value={lat}
            onChange={handleLatChange}
            onBlur={handleLatBlur}
            className={style.input}
            placeholder="Latitude"
          />
        </div>
        {errors.lat && (
          <div className={style.error}>{errors.lat}</div>
        )}
        <div className={style.row}>
          <label>Longitude</label>
          <input
            name="lng"
            id="lng"
            value={lng}
            onChange={handleLngChange}
            onBlur={handleLngBlur}
            className={style.input}
            placeholder="Longitude"
          />
        </div>
        {errors.lng && (
          <div className={style.error}>{errors.lng}</div>
        )}
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
        onChange={handleDescriptionChange}
        onBlur={handleDescriptionBlur}
        className={style.description}
        placeholder="Please write at least 30 characters"
      ></textarea>
      {errors.description && (
        <div className={style.error}>{errors.description}</div>
      )}

      {/**
       * The third section should include: a heading of "Create a title
       * for your spot", a caption of "Catch guests' attention with a
       * spot title that highlights what makes your place special.",
       * and a text input with a placeholder of "Name of your spot".
       */}
      <h3 className={style.h3}>Create a title for your spot</h3>
      <p>
        Catch guests&apos; attention with a spot title that highlights
        what makes your place special.
      </p>
      <div className={style.inputs}>
        <div className={style.row}>
          <label>Name of your spot</label>
          <input
            name="name"
            id="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            onBlur={handleNameBlur}
            className={style.input}
            placeholder="Name of your spot"
          />
        </div>
        {errors.name && (
          <div className={style.error}>{errors.name}</div>
        )}
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
            onChange={(e) => setPrice(e.target.value)}
            onBlur={handlePriceBlur}
            type="number"
            className={style.input}
            placeholder="Price per night (USD)"
          />
        </div>
        {errors.price && (
          <div className={style.error}>{errors.price}</div>
        )}
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
            name="previewUrl"
            id="previewUrl"
            value={previewUrl}
            onChange={(e) => setPreviewUrl(e.target.value)}
            onBlur={handlePreviewUrlBlur}
            className={style.input}
            placeholder="Preview Image URL"
          />
        </div>
        {errors.previewUrl && (
          <div className={style.error}>{errors.previewUrl}</div>
        )}
        <div className={style.row}>
          <label>Image URL</label>
          <input
            name="image1"
            id="image1"
            value={image1}
            onChange={(e) => setImage1(e.target.value)}
            onBlur={handleImage1Blur}
            className={style.input}
            placeholder="Image URL"
          />
        </div>
        {errors.image1 && (
          <div className={style.error}>{errors.image1}</div>
        )}
        <div className={style.row}>
          <label>Image URL</label>
          <input
            name="image2"
            id="image2"
            value={image2}
            onChange={(e) => setImage2(e.target.value)}
            onBlur={handleImage2Blur}
            className={style.input}
            placeholder="Image URL"
          />
        </div>
        {errors.image2 && (
          <div className={style.error}>{errors.image2}</div>
        )}
        <div className={style.row}>
          <label>Image URL</label>
          <input
            name="image3"
            id="image3"
            value={image3}
            onChange={(e) => setImage3(e.target.value)}
            onBlur={handleImage3Blur}
            className={style.input}
            placeholder="Image URL"
          />
        </div>
        {errors.image3 && (
          <div className={style.error}>{errors.image3}</div>
        )}
        <div className={style.row}>
          <label>Image URL</label>
          <input
            name="image4"
            id="image4"
            value={image4}
            onChange={(e) => setImage4(e.target.value)}
            onBlur={handleImage4Blur}
            className={style.input}
            placeholder="Image URL"
          />
        </div>
        {errors.image4 && (
          <div className={style.error}>{errors.image4}</div>
        )}
      </div>

      {/** The submit button should have the text of "Create Spot". */}
      <button disabled={isDisabled} className={style.button}>
        Create Spot
      </button>
    </form>
  );
};
const SpotNew = () => {
  const user = useSelector((state) => state.session.user);
  const navigate = useNavigate();

  useEffect(() => {
    if (!user) navigate("/");
  }, [user, navigate]);

  if (!user) return <h2>going home</h2>;

  return <SpotNewUserExists />;
};
export default SpotNew;
