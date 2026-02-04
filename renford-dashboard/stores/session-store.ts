import { JwtToken } from "../types/utilisateur";
import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

type SessionStore = {
  session: JwtToken | null;
  setSession: (session: JwtToken) => void;
  logout: () => void;
};

const useSession = create(
  persist<SessionStore>(
    (set) => ({
      session: null,
      setSession: (session) =>
        set(() => {
          return { session: session };
        }),
      logout: async () => {
        return set(() => ({ session: null }));
      },
    }),
    { name: "session", storage: createJSONStorage(() => localStorage) }
  )
);

export default useSession;
