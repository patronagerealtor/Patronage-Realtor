import { useQuery } from "@tanstack/react-query";
import {
  fetchPropertiesFromSupabase,
  checkSupabaseConnection,
  type PropertyRow,
} from "@/lib/supabase";
import { useEffect } from "react";

const FALLBACK_PROPERTIES: PropertyRow[] = [
  {
    id: 1,
    title: "Modern Villa",
    location: "Beverly Hills, CA",
    price: "$2,500,000",
    beds: 4,
    baths: 3,
    sqft: "3,200",
    status: "For Sale",
  },
  {
    id: 2,
    title: "Downtown Loft",
    location: "New York, NY",
    price: "$1,200,000",
    beds: 2,
    baths: 2,
    sqft: "1,400",
    status: "For Rent",
  },
  {
    id: 3,
    title: "Seaside Condo",
    location: "Miami, FL",
    price: "$850,000",
    beds: 3,
    baths: 2,
    sqft: "1,800",
    status: "For Sale",
  },
  {
    id: 4,
    title: "Mountain Retreat",
    location: "Aspen, CO",
    price: "$3,100,000",
    beds: 5,
    baths: 4,
    sqft: "4,500",
    status: "For Sale",
  },
  {
    id: 5,
    title: "Lakeside Cottage",
    location: "Lake Tahoe, CA",
    price: "$950,000",
    beds: 3,
    baths: 2,
    sqft: "2,100",
    status: "For Sale",
  },
  {
    id: 6,
    title: "City Penthouse",
    location: "Chicago, IL",
    price: "$1,800,000",
    beds: 3,
    baths: 3,
    sqft: "2,800",
    status: "For Rent",
  },
];

export function useProperties() {
  const query = useQuery({
    queryKey: ["properties"],
    queryFn: async () => {
      const fromDb = await fetchPropertiesFromSupabase();
      if (fromDb.length > 0) return fromDb;
      return FALLBACK_PROPERTIES;
    },
  });

  const properties = query.data ?? FALLBACK_PROPERTIES;
  const dataSource: "supabase" | "fallback" =
    query.data != null && query.data !== FALLBACK_PROPERTIES
      ? "supabase"
      : "fallback";

  // In dev, run connection check once and log result
  useEffect(() => {
    if (import.meta.env.DEV) {
      checkSupabaseConnection().then((result) => {
        if (result.connected) {
          console.log(
            `[Supabase] ${result.message} (${result.count} row(s) in properties)`
          );
        } else {
          console.warn("[Supabase]", result.message);
        }
      });
    }
  }, []);

  return {
    properties,
    dataSource,
    isLoading: query.isLoading,
    isError: query.isError,
    error: query.error,
  };
}
