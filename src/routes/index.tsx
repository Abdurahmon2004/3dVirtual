// src/routes/AppRoutes.tsx
import { createBrowserRouter } from "react-router-dom";
import MainLayout from "@/layouts/MainLayout";
import NotFoundPage from "@/components/NotFoundPage";
import HomeView from "@/pages/HomeView";
import Vizual from "@/pages/Vizual";
import AddImages from "@/pages/AddImages";
import LoginPage from "@/pages/sign-in";
import AddVizual from "@/pages/AddVizual";
import Companies from "@/pages/companies";
import Settings from "@/pages/Settings";
import Users from "@/pages/Users";
import OwnerSubscription from "@/pages/Users/OwnerSubscription";
import Roles from "@/pages/Roles/Roles";
import RolePermission from "@/pages/Roles/RolePermission";
import Objects from "@/pages/Objects/Objects";
import Blocks from "@/pages/Blocks/Blocks";
import Plans from "@/pages/Plans/Plans";
import PlanHomes from "@/pages/Plans/PlanHomes";
import EditVizual from "@/pages/EditVizual";
import Homes from "@/pages/Homes/Homes";
import HomeCreate from "@/pages/Homes/HomeCreate";

const AppRoutes = createBrowserRouter([
  {
    element: <MainLayout />,
    children: [
      {
        path: "/",
        element: <HomeView />,
      },

      // SETTINGS ROUTES
      {
        path: "/settings",
        element: <Settings />,
        children: [
          { path: "companies", element: <Companies /> },
          { path: "users", element: <Users /> },
          { path: "objects", element: <Objects /> },
          { path: "blocks", element: <Blocks /> },
          { path: "plans", element: <Plans /> },
          { path: "homes", element: <Homes /> },
          { path: "users", element: <Users /> },
          { path: "owner-subscription", element: <OwnerSubscription /> },
          { path: "roles", element: <Roles /> },
          { path: "role-permission", element: <RolePermission /> },
          { path: "plan-homes", element: <PlanHomes /> },
          { path: "homes", element: <Homes /> },
          { path: "home-create", element: <HomeCreate /> },
          { path: "add-images",  element: <AddImages />, },
        ],
      },

    ],
  },

  { path: "/add-vizual", element: <AddVizual /> },
  { path: "/edit-vizual", element: <EditVizual /> },
  { path: "/sign-in", element: <LoginPage /> },
  { path: "/vizual", element: <Vizual /> },
  { path: "*", element: <NotFoundPage /> },
]);


export default AppRoutes;
