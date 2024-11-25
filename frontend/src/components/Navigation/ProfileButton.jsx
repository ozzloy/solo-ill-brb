import { useDispatch } from "react-redux";
import { FaCircleUser } from "react-icons/fa6";
import * as sessionActions from "../../store/session";

function ProfileButton({ user }) {
  const dispatch = useDispatch();

  const logout = (e) => {
    e.preventDefault();
    dispatch(sessionActions.logout());
  };

  return (
    <>
      <div style={{ color: "#aaa", fontSize: "100px" }}>
        <FaCircleUser />
      </div>
      <ul className="profile-dropdown">
        <li>{user.username}</li>
        <li>
          {user.firstName} {user.lastName}
        </li>
        <li>{user.email}</li>
        <li>
          <button onClick={logout}>log out</button>
        </li>
      </ul>
    </>
  );
}

export default ProfileButton;
