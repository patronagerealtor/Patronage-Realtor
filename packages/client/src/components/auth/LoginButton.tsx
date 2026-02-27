import { useState } from "react";
import { useGoogleLogin } from "@react-oauth/google";
import { Button } from "../ui/button";
import { AUTH_KEYS } from "../../lib/auth";
import { exchangeGoogleToken } from "../../lib/authApi";
import { cn } from "../../lib/utils";

type LoginButtonProps = {
  onSuccess?: () => void;
  onError?: (message: string) => void;
  className?: string;
  disabled?: boolean;
};

export function LoginButton({
  onSuccess,
  onError,
  className,
  disabled = false,
}: LoginButtonProps) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const googleLogin = useGoogleLogin({
    onSuccess: async (tokenResponse) => {
      setError(null);
      setLoading(true);
      try {
        const accessToken = tokenResponse.access_token;
        if (!accessToken) {
          setError("No access token received");
          onError?.("No access token received");
          return;
        }
        localStorage.setItem(AUTH_KEYS.GOOGLE_ACCESS_TOKEN, accessToken);
        const result = await exchangeGoogleToken(accessToken);
        if (result.success) {
          onSuccess?.();
        } else {
          setError(result.error);
          onError?.(result.error);
        }
      } catch (err) {
        const message = err instanceof Error ? err.message : "Login failed";
        setError(message);
        onError?.(message);
      } finally {
        setLoading(false);
      }
    },
    onError: (err) => {
      const message = err?.error_description ?? err?.error ?? "Google sign-in failed";
      setError(message);
      setLoading(false);
      onError?.(message);
    },
    flow: "implicit",
  });

  const isDisabled = disabled || loading;

  return (
    <div className="flex flex-col gap-2">
      <Button
        type="button"
        variant="outline"
        disabled={isDisabled}
        onClick={() => googleLogin()}
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
