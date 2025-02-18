import { useState } from "react";
import { useDispatch } from "react-redux";
import style from "../style/Form.module.css";

import { login } from "../../store/session";
import { useModal } from "../../context/Modal";

function LoginFormModal() {
  const dispatch = useDispatch();
  const [credential, setCredential] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState({});
  const { closeModal } = useModal();

  const isFormInvalid = credential.length < 6 || password.length < 4;

  const handleGuestLogin = (e) => {
    e.preventDefault();
    dispatch(login("Demo-lition", "password"))
      .then(closeModal)
      .catch(async (res) => {
        const data = await res.json();
        if (data?.errors) setErrors(data.errors);
      });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setErrors({});
    return dispatch(login(credential, password))
      .then(closeModal)
      .catch(async (res) => {
        const data = await res.json();
        if (data?.errors) setErrors(data.errors);
      });
  };

  return (
    <form className={style.form} onSubmit={handleSubmit}>
      <h1 className={style.h1}>log in</h1>
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
      {errors.message && (
        <p className={style.error}>{errors.message}</p>
      )}
      <button
        className={style.button}
        type="submit"
        disabled={isFormInvalid}
      >
        log in
      </button>
      <button
        className={style.button}
        type="button"
        onClick={handleGuestLogin}
      >
        Log in as Demo User
      </button>
    </form>
  );
}

export default LoginFormModal;
