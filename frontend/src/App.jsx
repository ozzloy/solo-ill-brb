import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import {
  createBrowserRouter,
  Link,
  Outlet,
  RouterProvider,
} from "react-router-dom";
import { FaTruckFast } from "react-icons/fa6";

import Navigation from "./components/Navigation";
import SpotPage from "./components/SpotPage";
import Spots from "./components/Spots";
import SpotNew from "./components/SpotNew";

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
          <Link to="/">
            <span style={{ color: "#aaa", fontSize: "100px" }}>
              <FaTruckFast />
            </span>
          </Link>
          i&apos;ll brb
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
        path: "",
        element: <Spots />,
      },
      {
        path: "spots/new",
        element: <SpotNew />,
      },
      {
        path: "spots/:spotId",
        element: <SpotPage />,
      },
    ],
  },
]);

function App() {
  return <RouterProvider router={router} />;
}

export default App;
