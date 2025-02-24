import PropTypes from "prop-types";
import { useState } from "react";
import { Link, NavLink } from "react-router-dom";
import { XMarkIcon, ChevronDownIcon, ChevronUpIcon } from "@heroicons/react/24/outline";
import {
  Button,
  IconButton,
  Typography,
} from "@material-tailwind/react";
import { useMaterialTailwindController, setOpenSidenav } from "@/context";
import Cookies from "js-cookie";

export function Sidenav({ brandImg, brandName, routes }) {
  const [controller, dispatch] = useMaterialTailwindController();
  const { sidenavColor, sidenavType, openSidenav } = controller;
  const [expandedMenus, setExpandedMenus] = useState({}); // Estado para manejar submenús abiertos

  const sidenavTypes = {
    dark: "bg-gradient-to-br from-gray-800 to-gray-900",
    white: "bg-white shadow-sm",
    transparent: "bg-transparent",
  };

  const handleLogout = (event) => {
    event.preventDefault(); 
    Cookies.remove("menu");
    Cookies.remove("user");
    Cookies.remove("rol");
  }

  const toggleSubmenu = (name) => {
    setExpandedMenus((prev) => ({
      [name]: prev[name] ? false : true, 
    }));
  };  

  return (
    <aside
      className={`${sidenavTypes[sidenavType]} ${
        openSidenav ? "translate-x-0" : "-translate-x-80"
      } fixed inset-0 z-50 my-4 ml-4 h-[calc(100vh-32px)] w-72 rounded-xl transition-transform duration-300 xl:translate-x-0 border border-blue-gray-100`}
    >
      <div className="relative">
        <Link to="/dashboard/home" className="py-6 px-8 text-center flex justify-center items-center gap-4">
        <img src="/public/img/logoSena.jpg" alt="Logo sena" srcset="" className="w-14 h-14 rounded-sm" />
          <Typography
            variant="h6"
            color={sidenavType === "dark" ? "white" : "blue-gray"}
          >
            Autogestión CIES
          </Typography>
        </Link>
        <IconButton
          variant="text"
          color="white"
          size="sm"
          ripple={false}
          className="absolute right-0 top-0 grid rounded-br-none rounded-tl-none xl:hidden"
          onClick={() => setOpenSidenav(dispatch, false)}
        >
          <XMarkIcon strokeWidth={2.5} className="h-5 w-5 text-white" />
        </IconButton>
      </div>
      <div className="m-4 h-[calc(95%-64px)] flex flex-col" style={{ height: "calc(100vh - 150px)" }}>
        <div className="flex-1 overflow-y-auto">
          {routes.map(({ layout, title, pages }, key) => (
            <ul key={key} className="mb-4 flex flex-col gap-1">
              {title && (
                <li className="mx-3.5 mt-4 mb-2">
                  <Typography
                    variant="small"
                    color={sidenavType === "dark" ? "white" : "blue-gray"}
                    className="font-black uppercase opacity-75"
                  >
                    {title}
                  </Typography>
                </li>
              )}
              {pages.map(({ icon, name, path, children }) => (
                <li key={name}>
                  {children ? (
                    <>
                      <Button
                        onClick={() => toggleSubmenu(name)}
                        variant="text"
                        color={sidenavType === "dark" ? "white" : "blue-gray"}
                        className="flex items-center justify-between w-full px-4 capitalize"
                        fullWidth
                      >
                        <div className="flex items-center gap-4">
                          {icon}
                          <Typography color="inherit" className="font-medium capitalize">
                            {name}
                          </Typography>
                        </div>
                        {expandedMenus[name] ? (
                          <ChevronUpIcon className="h-5 w-5 text-inherit" />
                        ) : (
                          <ChevronDownIcon className="h-5 w-5 text-inherit" />
                        )}
                      </Button>
                      {expandedMenus[name] && (
                        <ul className="pl-8 mt-2">
                          {children.map(({ icon, name, path }) => (
                            <li className="mt-1" key={name}>
                              <NavLink to={`/${layout}${path}`}>
                                {({ isActive }) => (
                                  <Button
                                    variant={isActive ? "gradient" : "text"}
                                    color={isActive ? sidenavColor : "blue-gray"}
                                    className="flex items-center gap-4 px-4 capitalize"
                                    fullWidth
                                  >
                                    {icon}
                                    <Typography className="font-medium capitalize">
                                      {name}
                                    </Typography>
                                  </Button>
                                )}
                              </NavLink>
                            </li>
                          ))}
                        </ul>
                      )}
                    </>
                  ) : (
                    <NavLink to={`/${layout}${path}`}>
                      {({ isActive }) => (
                        <Button
                          variant={isActive ? "gradient" : "text"}
                          color={isActive ? sidenavColor : sidenavType === "dark" ? "white" : "blue-gray"}
                          className="flex items-center gap-4 px-4 capitalize"
                          fullWidth
                        >
                          {icon}
                          <Typography className="font-medium capitalize">
                            {name}
                          </Typography>
                        </Button>
                      )}
                    </NavLink>
                  )}
                </li>
              ))}
            </ul>
          ))}
        </div>
        
        {/* Sección de Cerrar Sesión */}
        <ul className="mb-4 flex flex-col gap-1">
          <li className="mx-3.5 mt-4 mb-2">
            <Typography
              variant="small"
              color={sidenavType === "dark" ? "white" : "blue-gray"}
              className="font-black my-3 uppercase opacity-75"
            >
              Configuración
            </Typography>
            <NavLink to="/auth/sign-in" onClick={handleLogout}>
              {({ isActive }) => (
                <Button
                  variant={isActive ? "gradient" : "text"}
                  color={isActive ? sidenavColor : sidenavType === "dark" ? "white" : "blue-gray"}
                  className="flex items-center gap-4 px-4 capitalize"
                  fullWidth
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={2}
                    stroke="currentColor"
                    className="h-5 w-5"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 9V5.25A2.25 2.25 0 0013.5 3h-6A2.25 2.25 0 005.25 5.25v13.5A2.25 2.25 0 007.5 21h6a2.25 2.25 0 002.25-2.25V15" />
                    <path strokeLinecap="round" strokeLinejoin="round" d="M21 12H9m3-3l-3 3 3 3" />
                  </svg>
                  <Typography className="font-medium capitalize">Cerrar Sesión</Typography>
                </Button>
              )}
            </NavLink>
          </li>
        </ul>
      </div>
    </aside>
  );
}

Sidenav.defaultProps = {
  brandImg: "/img/logo-ct.png",
  brandName: "Material Tailwind React",
};

Sidenav.propTypes = {
  brandImg: PropTypes.string,
  brandName: PropTypes.string,
  routes: PropTypes.arrayOf(PropTypes.object).isRequired,
};

Sidenav.displayName = "/src/widgets/layout/sidnave.jsx";

export default Sidenav;