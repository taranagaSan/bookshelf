export interface JwtPayload {
  email: string;
}

export interface LoginStatus {
  email: string;
  id: string;
  accessToken: string;
  expiresIn?: any;
}
