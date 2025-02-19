import {
  HomeIcon,
  UserCircleIcon,
  TableCellsIcon,
  InformationCircleIcon,
  ServerStackIcon,
  RectangleStackIcon,
} from "@heroicons/react/24/solid";
import { Home, Profile, Notifications } from "@/pages/dashboard";
import { element } from "prop-types";
import ForgotPassword from "./pages/auth/ForgotPassword";
import ResetPassword from "./pages/auth/ResetPassword";
import { TableView } from "./pages/dashboard/View";
import AccesUser from "./pages/dashboard/acces-users";
import RolTable from "./pages/dashboard/Rol";
import TableModule from "./pages/dashboard/module";
import TableUser from "./pages/dashboard/user";
import SignIn from "./pages/auth/sign-in";
import { SignUp } from "./pages/auth";
import Formulario from "./pages/dashboard/form-builder-and-response";


const icon = {
  className: "w-5 h-5 text-inherit",
};

export const routes_auth = {
  title: "auth pages",
  layout: "auth",
  pages: [
    {
      icon: <ServerStackIcon {...icon} />,
      name: "sign in",
      path: "/sign-in",
      element: <SignIn />,
    },
    {
      icon: <RectangleStackIcon {...icon} />,
      name: "sign up",
      path: "/sign-up",
      element: <SignUp />,
    },

    {
      icon: <RectangleStackIcon {...icon} />,
      name: "forgo",
      path: "/forgot-password",
      element : <ForgotPassword/>,


      
    },
    {
      icon : <RectangleStackIcon {...icon} />,
      name : "reset",
      path : "/reset-password",
      element : <ResetPassword/>,
    },
  ],
}

export const routes = [
  {
    layout: "dashboard",
    pages: [
      {
        icon: <HomeIcon {...icon} />,
        name: "dashboard",
        path: "/home",
        element: <Home />,
      },
      {
        icon: <UserCircleIcon {...icon} />,
        name: "profile",
        path: "/profile",
        element: <Profile />,
      },
      {
        icon: <TableCellsIcon {...icon} />,
        name: "accesUser",
        path: "/acces-user",
        element: <AccesUser />,
      },
      //Tablas 
      {
        icon: <TableCellsIcon {...icon} />,
        name: "Vistas",
        path: "/view",
        element: <TableView  />,
      },
      {
        icon: <TableCellsIcon {...icon} />,
        name: "Roels",
        path: "/Rol",
        element: <RolTable />,
      },
      {
        name: "Modulos",
        path: "/module",
        element: <TableModule  />,
      },
      {
        name: "Usuarios",
        path: "/user",
        element: <TableUser  />,
      },
      {
        name: "Notificaciones",
        path: "/notifications",
        element: <Notifications />,
      },
{
  name: "Cuestioanrios",
  path: "/Cuestioanrios",
  element: <Formulario />,
}
    ],
  },
  {
    title: "auth pages",
    layout: "auth",
    pages: [
      {
        icon: <ServerStackIcon {...icon} />,
        name: "sign in",
        path: "/sign-in",
        element: <SignIn />,
      },
      {
        icon: <RectangleStackIcon {...icon} />,
        name: "sign up",
        path: "/sign-up",
        element: <SignUp />,
      },

    {
        icon: <RectangleStackIcon {...icon} />,
        name: "forgot password",
        path: "/forgot-password",
        element : <ForgotPassword/>,


        
      },
      {
        icon : <RectangleStackIcon {...icon} />,
        name : "reset password",
        path : "/reset-password",
        element : <ResetPassword/>,
      }, 
    ],
  },
];

export default routes;
