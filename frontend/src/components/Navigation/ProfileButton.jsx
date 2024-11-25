import { useDispatch } from "react-redux";
import { FaCircleUser } from "react-icons/fa6";
import * as sessionActions from "../../store/session";
import { useState } from "react";

function ProfileButton({ user }) {
  const dispatch = useDispatch();
  const [showMenu, setShowMenu] = useState(false);

  const logout = (e) => {
    e.preventDefault();
    dispatch(sessionActions.logout());
  };

  const ulClassName =
    "profile-dropdown" + (showMenu ? "" : " hidden");

  return (
    <>
      <button
        className="profile-icon"
        onClick={() => setShowMenu(!showMenu)}
        style={{ color: "#aaa", fontSize: "100px" }}
      >
        <FaCircleUser />
      </button>
      <ul className={ulClassName}>
        <li>{user.username}</li>
        <li>
          {user.firstName} {user.lastName}
        </li>
        <li>{user.email}</li>
        <li>
          <button className="logout" onClick={logout}>
            log out
          </button>
        </li>
      </ul>
    </>
  );
}

export default ProfileButton;
