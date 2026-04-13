import { useQuery } from "@tanstack/react-query";
import useAxios from "./axios";
import useSession from "@/stores/session-store";
import { CurrentAdminUser } from "@/types/utilisateur";

export const useCurrentAdminUser = () => {
  const axios = useAxios();
  const { session } = useSession();

  return useQuery({
    queryKey: ["admin-me"],
    queryFn: async () => {
      return (await axios.get("/admin/me")).data as CurrentAdminUser;
    },
    enabled: !!session,
    staleTime: 1000 * 60 * 5,
    retry: false,
  });
};
