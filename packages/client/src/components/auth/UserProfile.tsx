import { useMemo, useState, useCallback } from "react";
import { jwtDecode } from "jwt-decode";
import { Button } from "../ui/button";
import { AUTH_KEYS, getStoredJwt, clearAuth, type DecodedUser } from "../../lib/auth";
import { logout as apiLogout } from "../../lib/authApi";
import { cn } from "../../lib/utils";

type StoredUser = { id?: string; email?: string; name?: string; picture?: string };

function getStoredUser(): StoredUser | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = localStorage.getItem(AUTH_KEYS.USER);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as unknown;
    return parsed && typeof parsed === "object" ? (parsed as StoredUser) : null;
  } catch {
    return null;
  }
}

function getUserFromJwt(): StoredUser | null {
  const token = getStoredJwt();
  if (!token) return null;
  try {
    const decoded = jwtDecode(token) as DecodedUser;
    return {
      id: decoded.sub,
      email: decoded.email,
      name: decoded.name,
      picture: decoded.picture,
    };
  } catch {
    return null;
  }
}

export function UserProfile({ className }: { className?: string }) {
  const [forceLogout, setForceLogout] = useState(false);

  const user = useMemo(() => {
    if (forceLogout) return null;
    const stored = getStoredUser();
    if (stored?.name || stored?.email) return stored;
    return getUserFromJwt();
  }, [forceLogout]);

  const handleLogout = useCallback(() => {
    apiLogout();
    setForceLogout(true);
  }, []);

  if (!user) return null;

  return (
    <div
      className={cn(
        "flex items-center gap-3 rounded-lg border border-border bg-card p-3",
        className
      )}
    >
      {user.picture && (
        <img
          src={user.picture}
          alt=""
          className="h-10 w-10 rounded-full object-cover"
          width={40}
          height={40}
        />
      )}
      <div className="min-w-0 flex-1">
        {user.name && (
          <p className="truncate text-sm font-medium text-foreground">{user.name}</p>
        )}
        {user.email && (
          <p className="truncate text-xs text-muted-foreground">{user.email}</p>
        )}
      </div>
      <Button type="button" variant="outline" size="sm" onClick={handleLogout}>
        Log out
      </Button>
    </div>
  );
}
