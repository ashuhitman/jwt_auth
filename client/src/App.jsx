import { BrowserRouter, Route, Routes } from "react-router-dom";
import "./App.scss";
import Auth from "./pages/Auth/Auth";
import Profile from "./pages/Profile/Profile";
import ProtectedRoute from "./components/ProtectedRoute";
import { AuthState } from "./components/context/authContext";
import ForgotPassword from "./pages/ForgotPassword/ForgotPassword";

function App() {
  const routes = [
    {
      path: "/",
      element: <Auth />,
      requiresAuth: false,
    },
    {
      path: "/user/profile",
      element: <Profile page="profile" />,
      requiresAuth: true,
    },
    {
      path: "/api/user/reset/:id/:token",
      element: <Profile page="reset" />,
      requiresAuth: false,
    },
    {
      path: "/user/forgot-password",
      element: <ForgotPassword />,
      requiresAuth: false,
    },
  ];
  return (
    <AuthState>
      <BrowserRouter>
        <Routes>
          {routes.map((route, index) => {
            if (route.requiresAuth) {
              return (
                <Route key={route.path} element={<ProtectedRoute />}>
                  <Route
                    key={route.path}
                    path={route.path}
                    element={route.element}
                  />
                </Route>
              );
            } else {
              return (
                <Route
                  key={route.path}
                  path={route.path}
                  element={route.element}
                />
              );
            }
          })}
        </Routes>
      </BrowserRouter>
    </AuthState>
  );
}

export default App;
