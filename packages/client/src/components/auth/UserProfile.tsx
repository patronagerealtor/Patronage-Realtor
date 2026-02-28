import { Button } from "../ui/button";
import { useAuth } from "../../hooks/useAuth";
import { cn } from "../../lib/utils";

export function UserProfile({ className }: { className?: string }) {
  const { user, logout } = useAuth();

  if (!user) return null;

  const name = user.user_metadata?.full_name ?? user.user_metadata?.name ?? user.email ?? null;
  const picture = user.user_metadata?.avatar_url ?? user.user_metadata?.picture ?? null;

  return (
    <div
      className={cn(
        "flex items-center gap-3 rounded-lg border border-border bg-card p-3",
        className
      )}
    >
      {picture && (
        <img
          src={picture}
          alt=""
          className="h-10 w-10 rounded-full object-cover"
          width={40}
          height={40}
        />
      )}
      <div className="min-w-0 flex-1">
        {name && (
          <p className="truncate text-sm font-medium text-foreground">{name}</p>
        )}
        {user.email && (
          <p className="truncate text-xs text-muted-foreground">{user.email}</p>
        )}
      </div>
      <Button type="button" variant="outline" size="sm" onClick={() => logout()}>
        Log out
      </Button>
    </div>
  );
}
