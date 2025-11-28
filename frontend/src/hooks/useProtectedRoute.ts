import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useSession } from "./useSession";

export const useProtectedRoute = () => {
  const { session, loading } = useSession();
  const navigate = useNavigate();

  useEffect(() => {
    if (!loading && !session) {
      navigate("/login", { replace: true });
    }
  }, [loading, session, navigate]);

  return { session, loading };
};

