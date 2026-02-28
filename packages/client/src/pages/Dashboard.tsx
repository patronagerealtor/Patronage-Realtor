import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { useAuth } from "@/hooks/useAuth";
import { Link } from "wouter";

export default function Dashboard() {
  const { user } = useAuth();
  const name = user?.user_metadata?.full_name ?? user?.user_metadata?.name ?? user?.email ?? "there";

  const accessDenied =
    typeof window !== "undefined" && new URLSearchParams(window.location.search).get("access_denied") === "1";

  return (
    <div className="min-h-screen bg-background flex flex-col font-sans">
      <Header />
      <main className="flex-1 container mx-auto px-4 py-12">
        {accessDenied && (
          <div className="mb-6 rounded-lg border border-amber-200 bg-amber-50 px-4 py-3 text-amber-800 dark:border-amber-800 dark:bg-amber-950/50 dark:text-amber-200">
            You don’t have access to Data Entry. Only the allowed email can use that page.
          </div>
        )}
        <h1 className="text-2xl font-semibold mb-2">Welcome, {name}</h1>
        <p className="text-muted-foreground mb-6">
          You are signed in. Use the menu to navigate.
        </p>
        <Link href="/data-entry" className="text-primary underline underline-offset-4">
          Go to Data Entry →
        </Link>
      </main>
      <Footer />
    </div>
  );
}
