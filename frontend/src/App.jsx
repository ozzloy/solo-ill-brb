import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import {
  createBrowserRouter,
  Outlet,
  RouterProvider,
} from "react-router-dom";

import LoginFormPage from "./components/LoginFormPage";
import * as sessionActions from "./store/session";

import "./App.css";

const Layout = () => {
  const dispatch = useDispatch();
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    (async () => {
      await dispatch(sessionActions.restoreUser());
      setIsLoaded(true);
    })();
  }, [dispatch]);

  return <>{isLoaded && <Outlet />}</>;
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
        path: "/login",
        element: <LoginFormPage />,
      },
    ],
  },
]);

function App() {
  return <RouterProvider router={router} />;
}

export default App;
