// hooks/useRequireAuth.ts
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";

export const useRequireAuth = (redirectTo: string = "/") => {
  const router = useRouter();
  const { user, token, isLoading } = useAuth();

  useEffect(() => {
    if (!isLoading && !token) {
      router.push(redirectTo);
    }
  }, [token, isLoading, router, redirectTo]);

  return { user, token, isLoading };
};
