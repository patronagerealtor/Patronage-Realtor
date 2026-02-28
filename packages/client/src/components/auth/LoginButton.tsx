import { useState } from "react";
import { Button } from "../ui/button";
import { supabase } from "../../lib/supabase";
import { cn } from "../../lib/utils";

type LoginButtonProps = {
  /** Path to redirect to after successful sign-in (default: /dashboard) */
  redirectTo?: string;
  onError?: (message: string) => void;
  className?: string;
  disabled?: boolean;
};

export function LoginButton({
  redirectTo = "/dashboard",
  onError,
  className,
  disabled = false,
}: LoginButtonProps) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSignIn() {
    if (!supabase) {
      const msg = "Supabase is not configured.";
      setError(msg);
      onError?.(msg);
      return;
    }
    setError(null);
    setLoading(true);
    try {
      const origin = typeof window !== "undefined" ? window.location.origin : "";
      const redirect = `${origin}${redirectTo.startsWith("/") ? redirectTo : `/${redirectTo}`}`;
      const { error: signInError } = await supabase.auth.signInWithOAuth({
        provider: "google",
        options: { redirectTo: redirect },
      });
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
        variant="outline"
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
            Signing in…
          </>
        ) : (
          "Sign in with Google"
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
