import { Routes, Route, Navigate, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { Dashboard, Auth } from "@/layouts";
import Cookies from "js-cookie";
import { routes } from "@/routes";

function App() {
  const navigate = useNavigate();
  const [hasRequiredCookies, setHasRequiredCookies] = useState(
    Cookies.get("menu") && Cookies.get("user")
  );

  useEffect(() => {
    const checkCookies = () => {
      if (!Cookies.get("menu") || !Cookies.get("user")) {
        setHasRequiredCookies(false);
      }
    };

    const interval = setInterval(checkCookies, 1000);

    return () => clearInterval(interval);
  }, [navigate]);

  return (
    <Routes>
      {routes.map(
        ({ layout, pages }) =>
          layout === "dashboard" &&
          pages.map(({ path, element }) => (
            <Route key={path} exact path={path} element={element} />
          ))
      )}
      <Route path="/auth/*" element={hasRequiredCookies ? <Navigate to="/dashboard/home" /> : <Auth />} />
      <Route path="/dashboard/*" element={hasRequiredCookies ? <Dashboard /> : <Navigate to="/auth/sign-in" />} />
      <Route path="*" element={<Navigate to="/sign-in" replace />} />
    </Routes>
  );
}

export default App;
