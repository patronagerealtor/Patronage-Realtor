import { useState, useEffect, useCallback } from "react";
import type { User, Session } from "@supabase/supabase-js";
import { supabase } from "../lib/supabase";

export type AuthState = {
  user: User | null;
  session: Session | null;
  loading: boolean;
  error: string | null;
  logout: () => Promise<void>;
};

/**
 * Hook that provides Supabase auth state: user, session, loading, error, and logout.
 * Subscribes to auth changes on mount and cleans up on unmount.
 */
export function useAuth(): AuthState {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const logout = useCallback(async () => {
    setError(null);
    if (!supabase) return;
    try {
      await supabase.auth.signOut();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to sign out");
    }
  }, []);

  useEffect(() => {
    if (!supabase) {
      setLoading(false);
      return;
    }

    let cancelled = false;

    async function init() {
      try {
        const { data: { session: initialSession }, error: sessionError } =
          await supabase.auth.getSession();
        if (cancelled) return;
        if (sessionError) {
          setError(sessionError.message);
          setSession(null);
          setUser(null);
        } else {
          setSession(initialSession ?? null);
          setUser(initialSession?.user ?? null);
        }
      } catch (err) {
        if (!cancelled) {
          setError(err instanceof Error ? err.message : "Failed to get session");
          setSession(null);
          setUser(null);
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    init();

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, newSession) => {
      if (cancelled) return;
      setSession(newSession);
      setUser(newSession?.user ?? null);
      setError(null);
    });

    return () => {
      cancelled = true;
      subscription.unsubscribe();
    };
  }, []);

  return { user, session, loading, error, logout };
}
