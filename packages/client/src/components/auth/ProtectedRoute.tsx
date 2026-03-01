import { Redirect, useLocation } from "wouter";
import { useAuth } from "../../hooks/useAuth";
import { LoginButton } from "./LoginButton";
import { Header } from "../layout/Header";

type ProtectedRouteProps = {
  children: React.ReactNode;
  loginPath?: string;
  /** Comma-separated emails (case-insensitive). Only these can access; others redirected to /?access_denied=1 */
  allowedEmails?: string;
};

function normalizeEmail(email: string | undefined): string {
  return (email ?? "").trim().toLowerCase();
}

function parseAllowedEmails(value: string | undefined): string[] {
  if (!value || typeof value !== "string") return [];
  return value
    .split(",")
    .map((e) => e.trim().toLowerCase())
    .filter(Boolean);
}

/**
 * If the user is authenticated (Supabase session), renders children.
 * If allowedEmails is set, only those emails can access; others are redirected to /?access_denied=1.
 * If not authenticated, redirects to login with ?redirect= current path.
 * Shows a loading spinner while auth is being checked.
 */
export function ProtectedRoute({ children, loginPath = "/login", allowedEmails: allowedEmailsProp }: ProtectedRouteProps) {
  const { user, loading } = useAuth();
  const [pathname] = useLocation();
  const allowedList = parseAllowedEmails(allowedEmailsProp);

  if (loading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center" role="status" aria-label="Checking authentication">
        <span className="inline-block h-10 w-10 animate-spin rounded-full border-2 border-primary border-t-transparent" />
      </div>
    );
  }

  if (!user) {
    const to = pathname ? `${loginPath}?redirect=${encodeURIComponent(pathname)}` : loginPath;
    return <Redirect to={to} />;
  }

  if (allowedList.length > 0) {
    const userEmail = normalizeEmail(user.email);
    const allowed = allowedList.some((e) => e === userEmail);
    if (!allowed) {
      return <Redirect to="/?access_denied=1" />;
    }
  }

  return <>{children}</>;
}

const DEFAULT_AFTER_SIGNIN =
  (typeof import.meta !== "undefined" && import.meta.env?.VITE_AFTER_SIGNIN_REDIRECT) || "/";

/**
 * Login page: shows LoginButton and redirects to ?redirect= or VITE_AFTER_SIGNIN_REDIRECT after success.
 */
export function LoginPage() {
  const redirect =
    typeof window !== "undefined"
      ? new URLSearchParams(window.location.search).get("redirect") || DEFAULT_AFTER_SIGNIN
      : DEFAULT_AFTER_SIGNIN;

  return (
    <>
      <Header />
      <div className="container mx-auto flex min-h-[60vh] flex-col items-center justify-center px-4 py-12">
        <div className="w-full max-w-sm space-y-6 rounded-lg border border-border bg-card p-6 shadow-sm">
          <h1 className="text-center text-xl font-semibold">Sign in or Sign up</h1>
          <p className="text-center text-sm text-muted-foreground">
            Use your Google account to continue.
          </p>
          <div className="flex flex-col gap-4">
            <LoginButton redirectTo={redirect} variant="outline" />
            <p className="text-center text-xs text-muted-foreground">New here?</p>
            <LoginButton
              redirectTo={redirect}
              label="Sign up with Google"
              loadingLabel="Signing up…"
              variant="default"
            />
          </div>
        </div>
      </div>
    </>
  );
}
