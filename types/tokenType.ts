export type TokenStore = {
  refreshToken: string;
  accessToken: string | null;
  expiresAt: number;
};
