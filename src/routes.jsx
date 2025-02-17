import {
  HomeIcon,
  UserCircleIcon,
  TableCellsIcon,
  InformationCircleIcon,
  ServerStackIcon,
  RectangleStackIcon,
} from "@heroicons/react/24/solid";
import { Home, Profile, Tables, Notifications } from "@/pages/dashboard";
import { SignIn, SignUp } from "@/pages/auth";
import { element } from "prop-types";
import ForgotPassword from "./pages/auth/ForgotPassword";

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
        name: "tables",
        path: "/tables",
        element: <Tables />,
      },
      {
        icon: <InformationCircleIcon {...icon} />,
        name: "notifications",
        path: "/notifications",
        element: <Notifications />,
      },
      {
        icon: <InformationCircleIcon {...icon} />,
        name: "prueba",
        path: "/vista1",
        element: <Home />,
      },
      {
        icon: <InformationCircleIcon {...icon} />,
        name: "prueba",
        path: "/vista2",
        element: <Tables />,
      },
      {
        icon: <InformationCircleIcon {...icon} />,
        name: "prueba",
        path: "/vista3",
        element: <Profile />,
      },
      {
        icon: <InformationCircleIcon {...icon} />,
        name: "prueba",
        path: "/vista4",
        element: <Home />,
      },
      {
        icon: <InformationCircleIcon {...icon} />,
        name: "prueba",
        path: "/vista5",
        element: <Tables />,
      },
    ],
  },
  routes_auth,
];

export default routes;

