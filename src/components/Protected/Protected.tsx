import { useMeQuery } from "@/app/api/authApi/authApi";
import { Role } from "@/constants";
import { NotFound } from "@/pages/NotFound";
import { Navigate, Outlet, useLocation } from "react-router-dom";
import { Permission } from "@/constants";
import { useSelector } from "react-redux";

export const Protected = () => {
  const location = useLocation();
  const branch = useSelector(
    (state: { branch?: { branch?: string } }) => state?.branch?.branch
  );
  const permissionRoutes: Record<string, string> = {
    "/teachers": Permission.TEACHERS,
    "/groups": Permission.GROUPS,
    "/students": Permission.STUDENTS,
    "/budget": Permission.BUDGET,
    "/leads": Permission.LEADS,
  };

  const { isLoading, data: user } = useMeQuery("");
  if (user && user?.role !== Role.CEO) {
    if (user.role === Role.TEACHER && location.pathname.startsWith("/groups")) {
      return <Outlet />;
    }
    if (location.pathname.startsWith("/settings")) return <NotFound />;
    const currentPath = Object.keys(permissionRoutes).find((path) =>
      location.pathname.startsWith(path)
    );

    if (
      currentPath &&
      !user.permissions.find(
        (permission) =>
          permission.name === permissionRoutes[currentPath] &&
          permission.branch === branch
      )
    ) {
      return <NotFound />;
    }
  }
  return !user && !isLoading ? <Navigate to="/login" /> : <Outlet />;
};
