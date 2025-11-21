import axios from "axios";

import { AuthStorage } from "@/lib/authStorage";
import { AuthResponse, Credentials } from "@/types/auth";
import { API_BASE_URL } from "@/utils/constants";

export const login = async (credentials: Credentials) => {
  const response = await axios.post<AuthResponse>(
    `${API_BASE_URL}auth/login`,
    credentials,
    {
      withCredentials: true,
    },
  );
  if (response.data.token) {
    AuthStorage.setToken(response.data.token);
  }
  const email =
    (response.data.data as { email?: string } | undefined)?.email ??
    credentials.email;
  if (email) {
    AuthStorage.setUserEmail(email);
  }
  return response.data;
};

export const register = async (credentials: Credentials) => {
  const response = await axios.post<AuthResponse>(
    `${API_BASE_URL}auth/register`,
    credentials,
    {
      withCredentials: true,
    },
  );
  return response.data;
};

