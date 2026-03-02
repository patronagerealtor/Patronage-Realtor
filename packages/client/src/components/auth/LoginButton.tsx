import { useState } from "react";
import { Button } from "../ui/button";
import { authService } from "../../services/auth";
import { env } from "../../config/env";
import { cn } from "../../lib/utils";

const DEFAULT_REDIRECT = env.afterSignInRedirect || "/";

type LoginButtonProps = {
  /** Path to redirect to after successful sign-in (default: VITE_AFTER_SIGNIN_REDIRECT or /) */
  redirectTo?: string;
  onError?: (message: string) => void;
  className?: string;
  disabled?: boolean;
  /** Button label. Default: "Sign in with Google". Use "Sign up with Google" for sign-up. */
  label?: string;
  /** Loading label when OAuth is in progress. Default: "Signing in…" */
  loadingLabel?: string;
  /** Button variant. Use "default" for a solid primary Sign up button. */
  variant?: "default" | "outline" | "ghost" | "link" | "destructive" | "secondary";
};

export function LoginButton({
  redirectTo = DEFAULT_REDIRECT,
  onError,
  className,
  disabled = false,
  label = "Sign in with Google",
  loadingLabel = "Signing in…",
  variant = "outline",
}: LoginButtonProps) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSignIn() {
    setError(null);
    setLoading(true);
    try {
      const { error: signInError } = await authService.signInWithOAuth(redirectTo);
      if (signInError) {
        const isProviderDisabled =
          signInError.message?.toLowerCase().includes("provider is not enabled") ||
          (signInError as { msg?: string }).msg?.toLowerCase().includes("provider is not enabled");
        const message = isProviderDisabled
          ? "Google sign-in is not enabled. In Supabase Dashboard go to Authentication → Providers and enable Google."
          : signInError.message;
        setError(message);
        onError?.(message);
        setLoading(false);
        return;
      }
      // OAuth redirects the page; if we're still here, something blocked the redirect
      setLoading(false);
    } catch (err) {
      const message = err instanceof Error ? err.message : "Sign-in failed";
      setError(message);
      onError?.(message);
      setLoading(false);
    }
  }

  const isDisabled = disabled || loading;

  return (
    <div className="flex flex-col gap-2">
      <Button
        type="button"
        variant={variant}
        disabled={isDisabled}
        onClick={handleSignIn}
        className={cn("gap-2", className)}
        aria-busy={loading}
      >
        {loading ? (
          <>
            <span
              className="inline-block h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent"
              aria-hidden
            />
            {loadingLabel}
          </>
        ) : (
          label
        )}
      </Button>
      {error && (
        <p className="text-sm text-destructive" role="alert">
          {error}
        </p>
      )}
    </div>
  );
}
