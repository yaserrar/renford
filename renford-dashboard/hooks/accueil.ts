import { EtablissementAccueilData, RenfordAccueilData } from "@/types/accueil";
import { useQuery } from "@tanstack/react-query";
import useAxios from "./axios";

export const useEtablissementAccueil = () => {
  const axios = useAxios();

  return useQuery({
    queryKey: ["etablissement-accueil"],
    queryFn: async () => {
      return (await axios.get("/etablissement/accueil"))
        .data as EtablissementAccueilData;
    },
    staleTime: 1000 * 60 * 20,
  });
};

export const useRenfordAccueil = () => {
  const axios = useAxios();

  return useQuery({
    queryKey: ["renford-accueil"],
    queryFn: async () => {
      return (await axios.get("/renford/accueil")).data as RenfordAccueilData;
    },
    staleTime: 1000 * 60 * 20,
  });
};
