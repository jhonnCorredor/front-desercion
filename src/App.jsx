import { Routes, Route, Navigate, useLocation } from "react-router-dom";
import { useEffect, useState } from "react";
import { Dashboard, Auth } from "@/layouts";
import Cookies from "js-cookie";
import { routes } from "@/routes";

function App() {
  const location = useLocation();

  const [hasRequiredCookies, setHasRequiredCookies] = useState(false);
  const [hasAprendizCookie, setHasAprendizCookie] = useState(false);

  useEffect(() => {
    const checkCookies = () => {
      setHasRequiredCookies(!!Cookies.get("menu") && !!Cookies.get("user"));
      setHasAprendizCookie(!!Cookies.get("aprendiz"));
    };

    checkCookies(); // Verificar cookies al montar el componente
    const interval = setInterval(checkCookies, 1000); // Verificar cada segundo

    return () => clearInterval(interval);
  }, []);

  // Bloquear acceso a otras rutas si la cookie "aprendiz" existe
  if (hasAprendizCookie && location.pathname !== "/dashboard/formulario") {
    return <Navigate to="/dashboard/formulario" replace />;
  }

  // Bloquear acceso a /dashboard/formulario si la cookie "aprendiz" NO existe
  if (!hasAprendizCookie && location.pathname === "/dashboard/formulario") {
    return <Navigate to="/dashboard/consultar" replace />;
  }

  return (
    <Routes>
      {routes.map(({ layout, pages }) =>
        layout === "dashboard"
          ? pages.map(({ path, element }) => (
              <Route key={path} path={path} element={element} />
            ))
          : null
      )}

      <Route path="/auth/*" element={hasRequiredCookies ? <Navigate to="/dashboard/home" /> : <Auth />} />
      <Route path="/dashboard/*" element={hasRequiredCookies ? <Dashboard /> : <Navigate to="/auth/sign-in" />} />

      <Route path="*" element={<Navigate to="/sign-in" replace />} />
    </Routes>
  );
}

export default App;
