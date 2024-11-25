import { NavLink } from "react-router-dom";
import { useSelector } from "react-redux";

import ProfileButton from "./ProfileButton";
import OpenModalButton from "../OpenModalButton";
import LoginFormModal from "../LoginFormModal";
import "./Navigation.css";

function Navigation({ isLoaded }) {
  const sessionUser = useSelector((state) => state.session.user);

  const sessionLinks = sessionUser ? (
    <>
      <li>
        <ProfileButton user={sessionUser} />
      </li>
    </>
  ) : (
    <>
      <li>
        <OpenModalButton
          buttonText="log in"
          modalComponent={<LoginFormModal />}
        />
      </li>
      <li>
        <NavLink to="/signup">sign up</NavLink>
      </li>
    </>
  );

  return (
    <ul className="navigation">
      <li>
        <NavLink to="/">home</NavLink>
      </li>
      {isLoaded && sessionLinks}
    </ul>
  );
}

export default Navigation;
