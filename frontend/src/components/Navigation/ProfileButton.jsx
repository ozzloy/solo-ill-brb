import { useDispatch } from "react-redux";
import { FaCircleUser } from "react-icons/fa6";
import { logout } from "../../store/session";
import { useEffect, useRef, useState } from "react";
import OpenModalMenuItem from "./OpenModalMenuItem";
import LoginFormModal from "../LoginFormModal";
import SignupFormModal from "../SignupFormModal";

function ProfileButton({ user }) {
  const dispatch = useDispatch();
  const [showMenu, setShowMenu] = useState(false);
  const dropDownMenu = useRef();

  const closeMenu = () => setShowMenu(false);

  const handleLogout = (e) => {
    e.preventDefault();
    dispatch(logout());
    closeMenu();
  };

  const toggleMenu = (e) => {
    e.stopPropagation();
    setShowMenu(!showMenu);
  };

  useEffect(() => {
    if (!showMenu) return;

    const closeMenu = (e) => {
      if (!dropDownMenu?.current?.contains(e.target))
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
        {user ? (
          <>
            <li>{user.username}</li>
            <li>Hello, {user.firstName}</li>
            <li>{user.email}</li>
            <li>
              <button className="logout" onClick={handleLogout}>
                log out
              </button>
            </li>
          </>
        ) : (
          <>
            <OpenModalMenuItem
              itemText="log in"
              onButtonClick={closeMenu}
              modalComponent={<LoginFormModal />}
            />
            <OpenModalMenuItem
              itemText="sign up"
              onButtonClick={closeMenu}
              modalComponent={<SignupFormModal />}
            />
          </>
        )}
      </ul>
    </>
  );
}

export default ProfileButton;
