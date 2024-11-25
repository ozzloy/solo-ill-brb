import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import {
  createBrowserRouter,
  Outlet,
  RouterProvider,
} from "react-router-dom";

import Navigation from "./components/Navigation";
import SignupFormPage from "./components/SignupFormPage";
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
      <Navigation isLoaded={isLoaded} />
      {isLoaded && <Outlet />}
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
      {
        path: "/signup",
        element: <SignupFormPage />,
      },
    ],
  },
]);

function App() {
  return <RouterProvider router={router} />;
}

export default App;
