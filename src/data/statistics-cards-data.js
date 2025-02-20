import {
  BanknotesIcon,
  UserPlusIcon,
  UsersIcon,
  ChartBarIcon,
} from "@heroicons/react/24/solid";

export const statisticsCardsData = [
  {
    color: "green",
    icon: UsersIcon,
    title: "registro de",
    value: "Aprendices",
    footer: {
      color: "text-green-500",
      value: "125.000.000",
      label: "aprendices registrados",
    },
  },
  {
    color: "green",
    icon: ChartBarIcon,
    title: "registro de",
    value: "Deserciones",
    footer: {
      color: "text-green-500",
      value: "50",
      label: "deserciones registradas",
    },
  },
  {
    color: "green",
    icon: UserPlusIcon,
    title: "registro de",
    value: "deserciones sin aprobar",
    footer: {
      color: "text-green-500",
      value: "20",
      label: "registros",
    },
  },
  {
    color: "green",
    icon: ChartBarIcon,
    title: "Registro de",
    value: "deserciones aprobadas",
    footer: {
      color: "text-green-500",
      value: "30",
      label: "registros",
    },
  },
];

export default statisticsCardsData;
