import { useLocation, Link } from "react-router-dom";
import {
  Navbar,
  Typography,
  Button,
  IconButton,
  Breadcrumbs,
  Input,
  Menu,
  MenuHandler,
  MenuList,
  MenuItem,
  Avatar,
} from "@material-tailwind/react";
import { UserCircleIcon, BellIcon, ClockIcon, Cog6ToothIcon, Bars3Icon } from "@heroicons/react/24/solid";
import { useMaterialTailwindController, setOpenConfigurator, setOpenSidenav } from "@/context";
import { useEffect, useState } from "react";
import Cookies from "js-cookie";
import { Service } from "@/data/api";
import routes from "@/routes";

export function DashboardNavbar() {
  const [controller, dispatch] = useMaterialTailwindController();
  const { fixedNavbar, openSidenav } = controller;
  const { pathname } = useLocation();
  const [user, setUser] = useState(null);

  const pathSegments = pathname.split("/").filter(Boolean)
  const layout = pathSegments[0]
  const currentPath = `/${pathSegments.slice(1).join("/")}`.toLowerCase()

  const dashboardRoutes = routes.find((route) => route.layout.toLowerCase() === layout.toLowerCase())
  const currentPage = dashboardRoutes?.pages.find((page) => page.path.toLowerCase() === currentPath)
  const pageName = currentPage ? currentPage.name : "Pagina desconocida"

  useEffect(() => {
    const userId = Cookies.get("user");
    if (userId) {
      Service.get(`/usuario/${userId}/`)
        .then(setUser)
        .catch(() => console.error("Error al cargar el usuario"));
    }
  }, []);

  return (
    <Navbar
      color={fixedNavbar ? "white" : "transparent"}
      className={`rounded-xl transition-all ${fixedNavbar ? "sticky top-4 z-40 py-3 shadow-md" : "px-0 py-1"}`}
      fullWidth
      blurred={fixedNavbar}
    >
      <div className="flex flex-col-reverse justify-between gap-6 md:flex-row md:items-center">
        <div className="capitalize">
          <Breadcrumbs className={`bg-transparent p-0 transition-all ${fixedNavbar ? "mt-1" : ""}`}>
            <Link to={`/${layout}`}>
              <Typography variant="small" color="blue-gray" className="font-normal opacity-50 hover:text-blue-500">
                {layout}
              </Typography>
            </Link>
            <Typography variant="small" color="blue-gray" className="font-normal">
              {pageName}
            </Typography>
          </Breadcrumbs>
          <Typography variant="h6" color="blue-gray">
            {pageName}
          </Typography>
        </div>
        <div className="flex items-center">
          <div className="mr-auto md:mr-4 md:w-56">
            <Input label="Search" />
          </div>
          <IconButton variant="text" color="blue-gray" className="grid xl:hidden" onClick={() => setOpenSidenav(dispatch, !openSidenav)}>
            <Bars3Icon className="h-6 w-6 text-blue-gray-500" />
          </IconButton>
          <Link to="/dashboard/profile">
            <Button variant="text" color="blue-gray" className="hidden xl:flex items-center gap-1 px-4 normal-case">
              <UserCircleIcon className="h-5 w-5 text-blue-gray-500" />
              {user ? `${user.nombres} ${user.apellidos}` : "Ingresar"}
            </Button>
          </Link>
          <Menu>
            <MenuHandler>
              <IconButton variant="text" color="blue-gray">
                <BellIcon className="h-5 w-5 text-blue-gray-500" />
              </IconButton>
            </MenuHandler>
            <MenuList className="w-max border-0">
              <MenuItem className="flex items-center gap-3">
                <Avatar src="https://demos.creative-tim.com/material-dashboard/assets/img/team-2.jpg" alt="item-1" size="sm" variant="circular" />
                <div>
                  <Typography variant="small" color="blue-gray" className="mb-1 font-normal">
                    <strong>Nuevo mensaje</strong> de Laur
                  </Typography>
                  <Typography variant="small" color="blue-gray" className="flex items-center gap-1 text-xs opacity-60">
                    <ClockIcon className="h-3.5 w-3.5" /> Hace 13 minutos
                  </Typography>
                </div>
              </MenuItem>
            </MenuList>
          </Menu>
          <IconButton variant="text" color="blue-gray" onClick={() => setOpenConfigurator(dispatch, true)}>
            <Cog6ToothIcon className="h-5 w-5 text-blue-gray-500" />
          </IconButton>
        </div>
      </div>
    </Navbar>
  );
}

export default DashboardNavbar;
