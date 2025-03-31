// hooks/useRequireAuth.ts
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";

export const useRequireAuth = () => {
  const router = useRouter();
  const { user, token, isLoading } = useAuth();

  useEffect(() => {
    if (!token && !isLoading) {
      router.push("/");
    }
  }, [token, isLoading, router]);

  return { user, token, isLoading };
};
