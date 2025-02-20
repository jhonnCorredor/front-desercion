import { Routes, Route } from "react-router-dom";
import { Cog6ToothIcon } from "@heroicons/react/24/solid";
import { IconButton } from "@material-tailwind/react";
import {
  Sidenav,
  DashboardNavbar,
  Configurator,
  Footer,
} from "@/widgets/layout";
import { routes} from "@/routes";
import { useMaterialTailwindController, setOpenConfigurator } from "@/context";
import Cookies from "js-cookie";
import { HomeIcon } from "lucide-react";

export function Dashboard() {
  const [controller, dispatch] = useMaterialTailwindController();
  const { sidenavType } = controller;
  
  let menuDimanic = null;

  if(Cookies.get("menu") || Cookies.get("user")){
  const menu = JSON.parse(Cookies.get("menu"));
  const user = Cookies.get("user");

  const mappedData = Object.values(
    menu.reduce((acc, vista) => {
      if (!acc[vista.moduloId]) {
        acc[vista.moduloId] = {
          name: vista.nombreModulo,
          path: `/${vista.nombreModulo.toLowerCase()}`,
          element: `<ComponenteModulo />`,
          children: []
        };
      }
      acc[vista.moduloId].children.push({
        name: vista.nombreVista,
        path: `/${vista.RutaVista.toLowerCase()}`,
        element: `<ComponenteVista />`
      });
      return acc;
    }, {})
  );

  menuDimanic = [
    {
    title: "Pagina principal",
    layout: "dashboard",
    pages:[ 
      {
        name: "Inicio",
        path: "/home",
      },
      ...mappedData] 
    }
  ]
  }

  return (
    <div
      className="min-h-screen"
      style={{
        backgroundColor: "#e5e5e5",
      }}

    >
      <Sidenav
        routes={menuDimanic? menuDimanic : routes}
        brandImg={
          sidenavType === "dark" ? "/img/logo-ct.png" : "/img/logo-ct-dark.png"
        }
      />
      <div className="p-4 xl:ml-80">
        <DashboardNavbar className="text-dark"/>
        <Configurator />
        <IconButton
          size="lg"
          color="white"
          className="fixed bottom-8 right-8 z-40 rounded-full shadow-blue-gray-900/10"
          ripple={false}
          onClick={() => setOpenConfigurator(dispatch, true)}
        >
          <Cog6ToothIcon className="h-5 w-5" />
        </IconButton>
        <Routes>
          {routes.map(
            ({ layout, pages }) =>
              layout === "dashboard" &&
              pages.map(({ path, element }) => (
                <Route exact path={path} element={element} />
              ))
          )}
        </Routes>
        <div className="text-dark">
          <Footer />
        </div>
      </div>
    </div>
  );
}

Dashboard.displayName = "/src/layout/dashboard.jsx";

export default Dashboard;
