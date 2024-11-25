import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import {
  createBrowserRouter,
  Outlet,
  RouterProvider,
} from "react-router-dom";
import { FaTruckFast } from "react-icons/fa6";

import Navigation from "./components/Navigation";
import { restoreUser } from "./store/session";

import "./App.css";

const Layout = () => {
  const dispatch = useDispatch();
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    (async () => {
      await dispatch(restoreUser());
      setIsLoaded(true);
    })();
  }, [dispatch]);

  return (
    <>
      <header>
        <h1>
          <span style={{ color: "#aaa", fontSize: "100px" }}>
            <FaTruckFast />
          </span>
          i'll brb
        </h1>
        <Navigation isLoaded={isLoaded} />
      </header>
      <main>{isLoaded && <Outlet />}</main>
    </>
  );
};

const router = createBrowserRouter([
  {
    element: <Layout />,
    children: [
      {
        path: "/",
        element: <h1>Welcome!</h1>,
      },
    ],
  },
]);

function App() {
  return <RouterProvider router={router} />;
}

export default App;
