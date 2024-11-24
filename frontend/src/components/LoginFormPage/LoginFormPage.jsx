import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Navigate } from "react-router-dom";
import styles from "./LoginForm.module.css";

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
    <>
      <form className={styles.form} onSubmit={handleSubmit}>
        <h1>log in</h1>
        <input
          className={styles.input}
          placeholder="username or email"
          type="text"
          value={credential}
          onChange={(e) => setCredential(e.target.value)}
          required
        />
        <input
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
    </>
  );
}

export default LoginFormPage;
