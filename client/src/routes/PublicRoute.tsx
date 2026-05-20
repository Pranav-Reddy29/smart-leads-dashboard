import { Navigate } from "react-router-dom";

import useAuthStore from "../store/authStore";

function PublicRoute({
  children,
}: {
  children: React.ReactNode;
}) {
  const { token, user, organization } =
    useAuthStore();

  if (token && user && organization) {
    return (
      <Navigate
        to="/dashboard"
        replace
      />
    );
  }

  return children;
}

export default PublicRoute;
