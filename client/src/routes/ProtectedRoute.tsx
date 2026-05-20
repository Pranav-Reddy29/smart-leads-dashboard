import { Navigate, useLocation } from "react-router-dom";

import useAuthStore from "../store/authStore";

function ProtectedRoute({
  children,
}: {
  children: React.ReactNode;
}) {
  const location = useLocation();
  const { token, user, organization } =
    useAuthStore();

  if (!token || !user || !organization) {
    return (
      <Navigate
        to="/login"
        replace
        state={{ from: location.pathname }}
      />
    );
  }

  return children;
}

export default ProtectedRoute;
