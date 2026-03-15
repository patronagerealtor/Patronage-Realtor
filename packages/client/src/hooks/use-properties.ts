import { useQuery } from "@tanstack/react-query";
import { fetchPropertiesFromSupabase, type PropertyRow } from "@/lib/supabase";

export function useProperties() {
  const query = useQuery<PropertyRow[]>({
    queryKey: ["properties"],
    queryFn: fetchPropertiesFromSupabase,
    staleTime: 1000 * 60 * 10, // 10 minutes cache (matches our client cache)
    retry: 1,
    refetchOnWindowFocus: false,
  });

  return {
    properties: query.data ?? [],
    dataSource: "supabase",
    isLoading: query.isLoading,
    isError: query.isError,
    error: query.error,
  };
}
