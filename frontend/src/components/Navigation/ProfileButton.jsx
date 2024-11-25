import { useDispatch } from "react-redux";
import { FaCircleUser } from "react-icons/fa6";
import * as sessionActions from "../../store/session";
import { useEffect, useRef, useState } from "react";

function ProfileButton({ user }) {
  const dispatch = useDispatch();
  const [showMenu, setShowMenu] = useState(false);
  const dropDownMenu = useRef();

  const logout = (e) => {
    e.preventDefault();
    dispatch(sessionActions.logout());
  };

  const toggleMenu = (e) => {
    e.stopPropagation();
    setShowMenu(!showMenu);
  };

  useEffect(() => {
    if (!showMenu) return;

    const closeMenu = (e) => {
      if (
        dropDownMenu.current &&
        !dropDownMenu.current.contains(e.target)
      )
        setShowMenu(false);
    };

    document.addEventListener("click", closeMenu);

    return () => document.removeEventListener("click", closeMenu);
  }, [showMenu]);

  const dropDownClassName =
    "profile-dropdown" + (showMenu ? "" : " hidden");

  return (
    <>
      <button
        className="profile-icon"
        onClick={toggleMenu}
        style={{ color: "#aaa", fontSize: "100px" }}
      >
        <FaCircleUser />
      </button>
      <ul className={dropDownClassName} ref={dropDownMenu}>
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
