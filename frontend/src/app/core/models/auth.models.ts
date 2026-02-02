export interface AuthResponse {
  token: string;
  username: string;
  role: string;
  message: string;
}

export interface User {
  username: string;
  role: string;
}
