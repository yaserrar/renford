import { CurrentUser } from "@/types/utilisateur";
import { useQuery } from "@tanstack/react-query";
import useAxios from "./axios";

// Hook pour récupérer l'utilisateur courant
export const useCurrentUser = () => {
  const axios = useAxios();

  return useQuery({
    queryKey: ["me"],
    queryFn: async () => {
      return (await axios.get("/utilisateur/me")).data as CurrentUser;
    },
    staleTime: 1000 * 60 * 5, // 5 minutes
    retry: false,
  });
};
