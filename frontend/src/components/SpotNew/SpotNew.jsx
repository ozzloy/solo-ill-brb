import style from "./SpotNew.module.css";

const SpotNew = () => (
  <form className={style.form}>
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
        <label>Country</label>
        <input className={style.input} placeholder="Country" />
      </div>
      <div className={style.row}>
        <label>Street Address</label>
        <input className={style.input} placeholder="Street Address" />
      </div>
      <div className={style.row}>
        <label>City</label>
        <input className={style.input} placeholder="City" />
      </div>
      <div className={style.row}>
        <label>State</label>
        <input className={style.input} placeholder="State" />
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
      Mention the best features of your space, any special amentities
      like fast wifi or parking, and what you love about the
      neighborhood.
    </p>
    <textarea
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
          type="number"
          className={style.input}
          placeholder="Price per night (USD)"
        />
      </div>
    </div>

    <button className={style.button}>Submit</button>
  </form>
);
export default SpotNew;
