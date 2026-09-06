export interface LoginRequest {
  username: string;
  password: string;
}

export interface AuthenticatedUser {
  username: string;
  name: string;
}

export interface LoginResponse {
  token: string;
  user: AuthenticatedUser;
}
