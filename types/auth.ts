export type Credentials = {
  email: string;
  password: string;
};

export type AuthResponse<T = unknown> = {
  status: number;
  message: string;
  token?: string;
  data?: T;
};

