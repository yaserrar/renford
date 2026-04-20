"use client";

import { API_BASE_URL } from "@/lib/env";
import { auth, googleProvider } from "@/lib/firebase";
import { useMutation } from "@tanstack/react-query";
import axios from "axios";
import { signInWithPopup } from "firebase/auth";
import { toast } from "sonner";
import { getErrorMessage } from "../lib/utils";
import useSession from "../stores/session-store";
import { JwtToken } from "../types/utilisateur";
import {
  CodeSchema,
  EmailSchema,
  LoginSchema,
  PasswordResetSchema,
  SignupSchema,
} from "../validations/auth";

//-------------------------------------------------------------------------------------------------------------

export const useLogin = () => {
  const { setSession } = useSession();

  return useMutation({
    mutationFn: async (data: LoginSchema) => {
      return (await axios.post(`${API_BASE_URL}/auth/login`, data))
        .data as JwtToken;
    },
    onSuccess: async (data) => {
      console.log("Login successful, received token:", data); // Debug log
      toast.success("Connecté avec succès");
      setSession(data);
    },
    onError: async (error: any) => {
      const message = getErrorMessage(error?.response?.data?.message);
      toast.error(message);
    },
  });
};

//-------------------------------------------------------------------------------------------------------------

export const useSignup = () => {
  const { setSession } = useSession();

  return useMutation({
    mutationFn: async (
      data: Omit<SignupSchema, "acceptTerms"> & { parrainId?: string },
    ) => {
      return (await axios.post(`${API_BASE_URL}/auth/signup`, data))
        .data as JwtToken;
    },
    onSuccess: async (data) => {
      toast.success("Compte créé avec succès");
      setSession(data);
    },
    onError: async (error: any) => {
      const message = getErrorMessage(error?.response?.data?.message);
      toast.error(message);
    },
  });
};

//-------------------------------------------------------------------------------------------------------------

export const useSendCode = () => {
  return useMutation({
    mutationFn: async (data: EmailSchema) => {
      return (
        await axios.post(`${API_BASE_URL}/password-reset/send-code`, data)
      ).data as { message: string };
    },
    onSuccess: async (data) => {
      toast.success(
        data.message || "Code de réinitialisation envoyé par email",
      );
    },
    onError: async (error: any) => {
      const message = getErrorMessage(error?.response?.data?.message);
      toast.error(message);
    },
  });
};

export const useValidateCode = () => {
  return useMutation({
    mutationFn: (data: CodeSchema) => {
      return axios.post(`${API_BASE_URL}/password-reset/validate-code`, data);
    },
    onSuccess: async () => {
      toast.success("Le code est valide");
    },
    onError: async (error: any) => {
      const message = getErrorMessage(error?.response?.data?.message);
      toast.error(message);
    },
  });
};

export const useResetPassword = () => {
  return useMutation({
    mutationFn: (data: PasswordResetSchema) => {
      return axios.post(`${API_BASE_URL}/password-reset/update-password`, data);
    },
    onSuccess: async () => {
      toast.success("Le mot de passe a été modifié");
    },
    onError: async (error: any) => {
      const message = getErrorMessage(error?.response?.data?.message);
      toast.error(message);
    },
  });
};

//-------------------------------------------------------------------------------------------------------------

export const useGoogleAuth = () => {
  const { setSession } = useSession();

  return useMutation({
    mutationFn: async () => {
      // Open Google sign-in popup via Firebase
      const result = await signInWithPopup(auth, googleProvider);
      const idToken = await result.user.getIdToken();

      // Send the Firebase ID token to our backend for verification + user creation/login
      return (await axios.post(`${API_BASE_URL}/auth/google`, { idToken }))
        .data as JwtToken;
    },
    onSuccess: async (data) => {
      toast.success("Connecté avec succès");
      setSession(data);
    },
    onError: async (error: any) => {
      // Don't show error if user closed the popup
      if (error?.code === "auth/popup-closed-by-user") return;
      if (error?.code === "auth/cancelled-popup-request") return;

      const message =
        error?.response?.data?.message || getErrorMessage(error?.message);
      toast.error(message);
    },
  });
};
