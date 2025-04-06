// types/authentication.ts

// User type definition for your project
export type User = {
  id: number;
  username: string;
  email: string;
};

// Authentication context type definition
export type AuthContextType = {
  user: User | null;
  token: string | null;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  register: (username: string, email: string, password: string) => Promise<boolean>;
  logout: () => void;
};

// Login request type
export type LoginRequest = {
  email: string;
  password: string;
};

// Register request type
export type RegisterRequest = {
  username: string;
  email: string;
  password: string;
};

// Authentication response from API
export type AuthResponse = {
  user: User;
  token: string;
  expiresIn: number;
};
