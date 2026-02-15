import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  supabase,
  fetchPropertyListings,
  insertPropertyListing,
  updatePropertyListing,
  deletePropertyListing,
} from "../lib/supabase";
import {
  createPropertyId,
  DEFAULT_PROPERTIES,
  loadProperties,
  saveProperties,
  type Property,
} from "../lib/propertyStore";
import { useCallback, useEffect, useMemo, useState } from "react";

/** Property shape used by DataEntry - matches Property from propertyStore */
function toProperty(row: {
  id: string;
  title: string;
  location: string;
  price: string;
  beds: number;
  baths: number;
  sqft: string;
  status: string;
  description?: string | null;
  images?: string[];
  amenities?: string[];
  highlights?: string[];
}): Property {
  return {
    id: String(row.id),
    title: row.title,
    location: row.location ?? "",
    price: row.price ?? "",
    beds: Number(row.beds ?? 0),
    baths: Number(row.baths ?? 0),
    sqft: String(row.sqft ?? ""),
    status: (row.status as Property["status"]) ?? "For Sale",
    description: row.description ?? undefined,
    images: row.images,
    amenities: row.amenities,
    highlights: row.highlights,
  };
}

/** localStorage-backed fallback (same API as useProperties) */
function usePropertiesLocal() {
  const [properties, setPropertiesState] = useState<Property[]>(() =>
    loadProperties(),
  );

  useEffect(() => {
    const onChange = () => setPropertiesState(loadProperties());
    window.addEventListener("patronage:properties:changed", onChange);
    window.addEventListener("storage", onChange);
    return () => {
      window.removeEventListener("patronage:properties:changed", onChange);
      window.removeEventListener("storage", onChange);
    };
  }, []);

  const setProperties = useCallback((next: Property[]) => {
    setPropertiesState(next);
    saveProperties(next);
  }, []);

  const upsertProperty = useCallback(
    (partial: Omit<Property, "id"> & { id?: string }): Promise<string> => {
      const id = partial.id ?? createPropertyId();
      const next: Property[] = (() => {
        const existingIdx = properties.findIndex((p) => p.id === id);
        if (existingIdx === -1)
          return [{ ...partial, id } as Property, ...properties];
        const copy = properties.slice();
        copy[existingIdx] = { ...copy[existingIdx], ...partial, id };
        return copy;
      })();
      setProperties(next);
      return Promise.resolve(id);
    },
    [properties, setProperties],
  );

  const deleteProperty = useCallback(
    (id: string) => {
      setProperties(properties.filter((p) => p.id !== id));
    },
    [properties, setProperties],
  );

  const resetToDefaults = useCallback(() => {
    setProperties(DEFAULT_PROPERTIES);
  }, [setProperties]);

  const byId = useMemo(() => {
    const map = new Map<string, Property>();
    properties.forEach((p) => map.set(p.id, p));
    return map;
  }, [properties]);

  return {
    properties,
    byId,
    upsertProperty,
    deleteProperty,
    resetToDefaults,
    dataSource: "local" as const,
    isLoading: false,
    error: null,
    mutationError: null,
    isMutating: false,
  };
}

/** Supabase-backed DataEntry properties */
export function useDataEntryProperties() {
  const queryClient = useQueryClient();
  const useSupabase = !!supabase;

  const query = useQuery({
    queryKey: ["property_listings"],
    queryFn: fetchPropertyListings,
    enabled: useSupabase,
  });

  const insertMutation = useMutation({
    mutationFn: ({
      row,
      id,
    }: {
      row: Omit<import("../lib/supabase").PropertyListingRow, "id">;
      id: string;
    }) => insertPropertyListing(row, id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["property_listings"] });
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, row }: { id: string; row: Parameters<typeof updatePropertyListing>[1] }) =>
      updatePropertyListing(id, row),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["property_listings"] });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: deletePropertyListing,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["property_listings"] });
    },
  });

  const properties = useSupabase
    ? (query.data ?? []).map(toProperty)
    : ([] as Property[]);

  const byId = useMemo(() => {
    const map = new Map<string, Property>();
    properties.forEach((p) => map.set(p.id, p));
    return map;
  }, [properties]);

  const upsertProperty = useCallback(
    async (partial: Omit<Property, "id"> & { id?: string }): Promise<string> => {
      if (!useSupabase) return partial.id ?? "";
      const id =
        partial.id ??
        (typeof crypto !== "undefined" && crypto.randomUUID
          ? crypto.randomUUID()
          : createPropertyId());
      const row = {
        title: partial.title,
        location: partial.location,
        price: partial.price,
        beds: partial.beds,
        baths: partial.baths,
        sqft: partial.sqft,
        status: partial.status,
        description: partial.description ?? null,
        images: partial.images ?? [],
        amenities: partial.amenities ?? [],
        highlights: partial.highlights ?? [],
      };
      try {
        if (partial.id && properties.some((p) => p.id === partial.id)) {
          await updateMutation.mutateAsync({ id, row });
        } else {
          const insertedId = await insertMutation.mutateAsync({ row, id });
          return insertedId ?? id;
        }
        return id;
      } catch (e) {
        throw e;
      }
    },
    [useSupabase, properties, insertMutation, updateMutation],
  );

  const deleteProperty = useCallback(
    (id: string) => {
      if (!useSupabase) return;
      deleteMutation.mutate(id);
    },
    [useSupabase, deleteMutation],
  );

  const resetToDefaults = useCallback(async () => {
    if (!useSupabase) return;
    // Load sample into Supabase
    await Promise.all(
      DEFAULT_PROPERTIES.map((p) =>
        insertPropertyListing({
          title: p.title,
          location: p.location,
          price: p.price,
          beds: p.beds,
          baths: p.baths,
          sqft: p.sqft,
          status: p.status,
          description: p.description ?? null,
          images: p.images ?? [],
          amenities: p.amenities ?? [],
          highlights: p.highlights ?? [],
        })
      )
    );
    queryClient.invalidateQueries({ queryKey: ["property_listings"] });
  }, [useSupabase, queryClient]);

  const mutationError =
    insertMutation.error ?? updateMutation.error ?? deleteMutation.error;

  return {
    properties,
    byId,
    upsertProperty,
    deleteProperty,
    resetToDefaults,
    dataSource: "supabase" as const,
    isLoading: query.isLoading,
    error: query.error,
    mutationError: mutationError ?? null,
    isMutating:
      insertMutation.isPending ||
      updateMutation.isPending ||
      deleteMutation.isPending,
  };
}

/** Unified hook: uses Supabase when configured, localStorage otherwise */
export function useDataEntryPropertiesOrLocal() {
  const supabaseHook = useDataEntryProperties();
  const localHook = usePropertiesLocal();

  if (supabase) {
    return supabaseHook;
  }
  return localHook;
}
