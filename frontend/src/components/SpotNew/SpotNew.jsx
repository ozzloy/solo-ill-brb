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
    <button className={style.button}>Submit</button>
  </form>
);
export default SpotNew;
