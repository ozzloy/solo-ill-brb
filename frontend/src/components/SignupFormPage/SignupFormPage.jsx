import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Navigate } from "react-router-dom";
import { signup } from "../../store/session";
import styles from "../style/Form.module.css";

function SignupFormPage() {
  const dispatch = useDispatch();
  const sessionUser = useSelector((state) => state.session.user);
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [errors, setErrors] = useState({});

  if (sessionUser) return <Navigate to="/" replace={true} />;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (password === confirmPassword) {
      setErrors({});
      return dispatch(
        signup({
          email,
          username,
          firstName,
          lastName,
          password,
        }),
      ).catch(async (res) => {
        const data = await res.json();
        if (data?.errors) {
          setErrors(data.errors);
        }
      });
    }
    return setErrors({
      confirmPassword:
        "Confirm Password field must be the same as the Password field",
    });
  };

  return (
    <form className={styles.form} onSubmit={handleSubmit}>
      <h1 className={styles.h1}>sign up</h1>
      <label className={styles.label} htmlFor="email">
        email
      </label>
      <input
        className={styles.input}
        name="email"
        id="email"
        placeholder="email"
        type="text"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        required
      />
      {errors.email && <p className={styles.error}>{errors.email}</p>}
      <label className={styles.label} htmlFor="username">
        username
      </label>
      <input
        className={styles.input}
        name="username"
        id="username"
        placeholder="username"
        type="text"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
        required
      />
      {errors.username && (
        <p className={styles.error}>{errors.username}</p>
      )}
      <label className={styles.label} htmlFor="first-name">
        first name
      </label>
      <input
        className={styles.input}
        name="first-name"
        id="first-name"
        placeholder="first name"
        type="text"
        value={firstName}
        onChange={(e) => setFirstName(e.target.value)}
        required
      />
      {errors.firstName && (
        <p className={styles.error}>{errors.firstName}</p>
      )}
      <label className={styles.label} htmlFor="last-name">
        last name
      </label>
      <input
        className={styles.input}
        name="last-name"
        id="last-name"
        type="text"
        placeholder="last name"
        value={lastName}
        onChange={(e) => setLastName(e.target.value)}
        required
      />
      {errors.lastName && (
        <p className={styles.error}>{errors.lastName}</p>
      )}
      <label className={styles.label} htmlFor="password">
        password
      </label>
      <input
        className={styles.input}
        name="password"
        id="password"
        type="password"
        placeholder="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        required
      />
      {errors.password && (
        <p className={styles.error}>{errors.password}</p>
      )}
      <label className={styles.label} htmlFor="confirm-password">
        confirm password
      </label>
      <input
        name="confirm-password"
        id="confirm-password"
        placeholder="confirm password"
        className={styles.input}
        type="password"
        value={confirmPassword}
        onChange={(e) => setConfirmPassword(e.target.value)}
        required
      />
      {errors.confirmPassword && (
        <p className={styles.error}>{errors.confirmPassword}</p>
      )}
      <button className={styles.button} type="submit">
        Sign Up
      </button>
    </form>
  );
}

export default SignupFormPage;
