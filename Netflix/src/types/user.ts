export interface User {
  id: string;
  name: string;
  email: string;
  favorites: number[];
  createdAt: string;
}

export interface AuthFormData {
  name?: string;
  email: string;
  password: string;
  confirmPassword?: string;
}

export interface ApiResponse<T> {
  data: T;
  message?: string;
  error?: string;
}