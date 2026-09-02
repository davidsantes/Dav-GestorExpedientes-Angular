export type Rol = 'LECTOR' | 'EDITOR';

export interface LoginRequest {
  user: string;
  pass: string;
}

export interface LoginResponse {
  token: string;
  user: string;
  rol: Rol;
}

export interface TokenPayload {
  user: string;
  rol: Rol;
  exp: number;
}
