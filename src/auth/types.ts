export type AuthTokens = {
  id_token: string;
  refresh_token: string;
  access_token?: string;
};

export type User = {
  id?: string;
  email?: string;
  name?: string;
  preferred_username?: string;
  /** False for a Google-only account: offer "set a password", not "change". */
  has_password?: boolean;
};

/** Challenges the backend can return instead of tokens. */
export type ChallengeName =
  | "SOFTWARE_TOKEN_MFA"
  | "EMAIL_OTP"
  | "ACCOUNT_DEACTIVATED"
  | "CONFIRM_SIGNUP";

/** Everything /auth/signin, /auth/mfa/respond and the OAuth callback can
 *  return: a full token set, or a challenge to answer first. */
export type AuthResponse = Partial<AuthTokens> & {
  challenge_name?: ChallengeName;
  session?: string;
  preferred_username?: string;
  username?: string;
  deleted_at?: number;
  purge_at?: number;
  user?: User;
  needs_username?: boolean;
};

export type MfaChallenge = {
  session: string;
  username: string;
  challengeName: "SOFTWARE_TOKEN_MFA" | "EMAIL_OTP";
};

export function hasTokens(res: AuthResponse): res is AuthResponse & AuthTokens {
  return !!res.id_token && !!res.refresh_token;
}
