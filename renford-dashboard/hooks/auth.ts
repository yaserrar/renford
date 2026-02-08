"use client";

import { API_BASE_URL } from "@/lib/env";
import { useMutation } from "@tanstack/react-query";
import axios from "axios";
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
    mutationFn: async (data: Omit<SignupSchema, "acceptTerms">) => {
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
    mutationFn: (data: EmailSchema) => {
      return axios.post(`${API_BASE_URL}/password-reset/send-code`, data);
    },
    onSuccess: async () => {
      toast.success("Code envoyé");
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
