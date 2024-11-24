import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Navigate } from "react-router-dom";
import styles from "../style/Form.module.css";

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
    <form className={styles.form} onSubmit={handleSubmit}>
      <h1 className={styles.h1}>log in</h1>
      <label className={styles.label} htmlFor="credential">
        username or email
      </label>
      <input
        name="credential"
        id="credential"
        className={styles.input}
        placeholder="username or email"
        type="text"
        value={credential}
        onChange={(e) => setCredential(e.target.value)}
        required
      />
      <label className={styles.label} htmlFor="password">
        password
      </label>
      <input
        name="password"
        id="password"
        className={styles.input}
        placeholder="password"
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        required
      />
      <button className={styles.button} type="submit">
        Log In
      </button>
      {errors.message && (
        <p className={styles.error}>{errors.message}</p>
      )}
    </form>
  );
}

export default LoginFormPage;
