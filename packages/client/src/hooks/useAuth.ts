import { useEffect, useState } from "react";
import type { User, Session } from "@supabase/supabase-js";
import { supabase } from "@/lib/supabase";

export type AuthState = {
  user: User | null;
  session: Session | null;
  loading: boolean;
  error: string | null;
  logout: () => Promise<void>;
};

/**
 * Auth state from Supabase. When Supabase is not configured, returns no user and no-op logout.
 */
export function useAuth(): AuthState {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!supabase) {
      setLoading(false);
      return;
    }

    supabase.auth.getSession().then(({ data: { session: s } }) => {
      setSession(s);
      setUser(s?.user ?? null);
      setLoading(false);
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, s) => {
      setSession(s);
      setUser(s?.user ?? null);
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  const logout = async () => {
    setError(null);
    if (!supabase) return;
    await supabase.auth.signOut();
  };

  return {
    user,
    session,
    loading,
    error,
    logout,
  };
}
