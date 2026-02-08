"use client";

import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";
import { getErrorMessage } from "../lib/utils";
import useAxios from "./axios";
import { VerifyEmailSchema } from "../validations/account-verification";

// ============================================================================
// Vérifier l'email avec un code
// ============================================================================

export const useVerifyEmail = () => {
  const axios = useAxios();

  return useMutation({
    mutationFn: async (data: VerifyEmailSchema) => {
      return (await axios.post("/account-verification/verify-email", data))
        .data;
    },
    onSuccess: () => {
      toast.success("Email vérifié avec succès");
    },
    onError: (error: any) => {
      const message = getErrorMessage(error?.response?.data?.message);
      toast.error(message);
    },
  });
};

// ============================================================================
// Renvoyer le code de vérification
// ============================================================================

export const useResendVerification = () => {
  const axios = useAxios();

  return useMutation({
    mutationFn: async () => {
      return (await axios.post("/account-verification/resend-code")).data;
    },
    onSuccess: () => {
      toast.success("Un nouveau code a été envoyé à votre email");
    },
    onError: (error: any) => {
      const message = getErrorMessage(error?.response?.data?.message);
      toast.error(message);
    },
  });
};
