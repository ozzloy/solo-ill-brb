import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Navigate } from "react-router-dom";
import style from "../style/Form.module.css";

import { login } from "../../store/session";

function LoginFormPage() {
  const dispatch = useDispatch();
  const sessionUser = useSelector((state) => state.session.user);
  const [credential, setCredential] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState({});

  if (sessionUser) return <Navigate to="/" replace={true} />;

  const handleSubmit = (e) => {
    e.preventDefault();
    setErrors({});
    return dispatch(login(credential, password)).catch(
      async (res) => {
        console.log("LoginFormPage:res", res);
        const data = await res.json();
        console.log("LoginFormPage:data", data);
        if (data?.errors) setErrors(data.errors);
      },
    );
  };

  return (
    <form className={style.form} onSubmit={handleSubmit}>
      <h1 className={style.h1}>log in</h1>
      <label className={style.label} htmlFor="credential">
        username or email
      </label>
      <input
        name="credential"
        id="credential"
        className={style.input}
        placeholder="username or email"
        type="text"
        value={credential}
        onChange={(e) => setCredential(e.target.value)}
        required
      />
      <label className={style.label} htmlFor="password">
        password
      </label>
      <input
        name="password"
        id="password"
        className={style.input}
        placeholder="password"
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        required
      />
      <button className={style.button} type="submit">
        Log In
      </button>
      {errors.message && (
        <p className={style.error}>{errors.message}</p>
      )}
    </form>
  );
}

export default LoginFormPage;
