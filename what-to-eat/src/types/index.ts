import { Session, User } from '@supabase/supabase-js';

export type AuthState = {
  user: User | null;
  session: Session | null;
  loading: boolean;
};

export type AuthContextType = AuthState & {
  signUp: (email: string, password: string) => Promise<void>;
  signIn: (email: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
};
