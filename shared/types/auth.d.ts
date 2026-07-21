declare module "#auth-utils" {
  interface SessionBusiness {
    id: string;
    name: string;
    slug: string;
    businessType?: {
      id: string;
      name: string;
    } | null;
    maxServices?: number | null;
    maxCollaborators?: number | null;
    servicesCount?: number;
    collaboratorsCount?: number;
    customersCount?: number;
  }

  interface UserPreferences {
    id?: string;
    theme?: string | null;
    currency?: string | null;
    timezone?: string | null;
    language?: string | null;
  }

  interface User {
    id: string;
    firstName: string;
    lastName?: string;
    avatarUrl?: string;
    email?: string;
    preferences?: UserPreferences;
    business?: SessionBusiness | null;
  }

  interface UserSession {
    loggedInAt?: number;
  }

  interface SecureSessionData {
    userId?: string;
  }
}

export {};
