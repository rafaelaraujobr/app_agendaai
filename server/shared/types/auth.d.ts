declare module "#auth-utils" {
  interface User {
    id: string;
    firstName: string;
    lastName?: string;
    avatarUrl?: string;
    email?: string;
    preferences?: UserPreferences;
    business?: Business;
  }

  interface UserSession {
    loggedInAt?: number;
  }

  interface SecureSessionData {
    userId?: string;
  }
}

export {};
