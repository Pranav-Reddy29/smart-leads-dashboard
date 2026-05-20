import { useQuery } from "@tanstack/react-query";
import { useEffect } from "react";

import PageLoader from "./components/common/PageLoader";
import AppRoutes from "./routes/AppRoutes";
import { bootstrapSession } from "./services/authService";
import useAuthStore from "./store/authStore";

function App() {
  const {
    token,
    setBootstrapContext,
    clearSession,
  } = useAuthStore();

  const bootstrapQuery = useQuery({
    queryKey: ["auth-bootstrap", token],
    queryFn: bootstrapSession,
    enabled: Boolean(token),
    retry: false,
  });

  useEffect(() => {
    if (bootstrapQuery.isSuccess) {
      setBootstrapContext(
        bootstrapQuery.data
      );
    }
  }, [
    bootstrapQuery.data,
    bootstrapQuery.isSuccess,
    setBootstrapContext,
  ]);

  if (!token) {
    return <AppRoutes />;
  }

  if (bootstrapQuery.isPending) {
    return <PageLoader />;
  }

  if (bootstrapQuery.isError) {
    clearSession();
    return <AppRoutes />;
  }

  return <AppRoutes />;
}

export default App;
