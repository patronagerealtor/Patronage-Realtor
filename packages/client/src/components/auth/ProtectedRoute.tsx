import { Redirect, useLocation } from "wouter";
import { isAuthenticated } from "../../lib/auth";
import { LoginButton } from "./LoginButton";
import { Header } from "../layout/Header";

type ProtectedRouteProps = {
  children: React.ReactNode;
  loginPath?: string;
};

/**
 * Renders children if the user has a stored JWT; otherwise redirects to login with ?redirect= current path.
 */
export function ProtectedRoute({ children, loginPath = "/login" }: ProtectedRouteProps) {
  const [pathname] = useLocation();
  if (isAuthenticated()) {
    return <>{children}</>;
  }
  const to = pathname ? `${loginPath}?redirect=${encodeURIComponent(pathname)}` : loginPath;
  return <Redirect to={to} />;
}

/**
 * Login page: shows LoginButton and redirects to ?redirect= or / after success.
 */
export function LoginPage() {
  const [, setLocation] = useLocation();
  const redirect =
    typeof window !== "undefined"
      ? new URLSearchParams(window.location.search).get("redirect") || "/"
      : "/";

  return (
    <>
      <Header />
      <div className="container mx-auto flex min-h-[60vh] flex-col items-center justify-center px-4 py-12">
        <div className="w-full max-w-sm space-y-6 rounded-lg border border-border bg-card p-6 shadow-sm">
          <h1 className="text-center text-xl font-semibold">Sign in</h1>
          <p className="text-center text-sm text-muted-foreground">
            Use your Google account to continue.
          </p>
          <LoginButton onSuccess={() => setLocation(redirect)} />
        </div>
      </div>
    </>
  );
}
