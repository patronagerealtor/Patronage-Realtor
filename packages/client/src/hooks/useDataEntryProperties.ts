import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  fetchPropertiesFromSupabase,
  isBackendConfigured,
  insertPropertyBackend,
  updatePropertyBackend,
  upsertPropertyBackend,
  deletePropertyBackend,
  syncPropertyImagesBackend,
  syncPropertyAmenitiesBackend,
} from "../lib/supabase";
import type { PropertyRow } from "../lib/supabase";
import {
  createPropertyId,
  DEFAULT_PROPERTIES,
  loadProperties,
  saveProperties,
  type Property,
} from "../lib/propertyStore";
import { useCallback, useMemo } from "react";
import { useEffect, useState } from "react";

/** Map PropertyRow (from backend) to Property (used by DataEntry/UI) */
function toProperty(row: PropertyRow): Property {
  const priceStr =
    row.price_min != null && row.price_max != null
      ? `${row.price_min} - ${row.price_max}`
      : row.price_value != null
        ? String(row.price_value)
        : "";
  return {
    id: String(row.id),
    title: row.title,
    location: row.location ?? "",
    address: row.address ?? "",
    price: priceStr,
    beds: Number(row.beds ?? 0),
    baths: Number(row.baths ?? 0),
    sqft: String(row.sqft ?? ""),
    status: (row.status as Property["status"]) ?? "Under Construction",
    description: row.description ?? undefined,
    images: row.images ?? [],
    amenities: row.amenities ?? [],
    highlights: [],
    developer: row.developer,
    property_type: row.property_type,
    city: undefined,
    possession_date: row.possession_date ?? undefined,
    bhk_type: row.bhk_type ?? undefined,
    possession_by: row.possession_by ?? undefined,
    latitude: row.latitude,
    longitude: row.longitude,
    google_map_link: row.google_map_link ?? undefined,
    price_value: row.price_value,
    price_min: row.price_min,
    price_max: row.price_max,
    slug: undefined,
    rera_applicable: row.rera_applicable ?? false,
    rera_number: row.rera_number ?? undefined,
  };
}

/** Sync property_images (backend-agnostic). */
async function syncPropertyImages(
  propertyId: string,
  imageUrls: string[]
): Promise<void> {
  await syncPropertyImagesBackend(propertyId, imageUrls);
}

/** Sync property_amenities (backend-agnostic). */
async function syncPropertyAmenities(
  propertyId: string,
  amenityIds: string[]
): Promise<void> {
  await syncPropertyAmenitiesBackend(propertyId, amenityIds);
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

/** Backend-backed DataEntry properties (Firebase or Supabase) */
export function useDataEntryProperties() {
  const queryClient = useQueryClient();
  const useSupabase = isBackendConfigured();

  const query = useQuery({
    queryKey: ["properties"],
    queryFn: fetchPropertiesFromSupabase,
    enabled: useSupabase,
    staleTime: 1000 * 60 * 5, // 5 min – reduce Supabase requests, cache at edge
    refetchOnWindowFocus: false,
  });

  const properties = useSupabase
    ? (query.data ?? []).map(toProperty)
    : ([] as Property[]);

  const byId = useMemo(() => {
    const map = new Map<string, Property>();
    properties.forEach((p) => map.set(p.id, p));
    return map;
  }, [properties]);

  const insertMutation = useMutation({
    mutationFn: async ({
      payload,
      id,
    }: {
      payload: Record<string, unknown>;
      id: string;
    }) => {
      if (!useSupabase) throw new Error("Backend not configured");
      await insertPropertyBackend(id, { ...payload, id });
      return id;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["properties"] });
    },
  });

  const updateMutation = useMutation({
    mutationFn: async ({
      id,
      payload,
    }: {
      id: string;
      payload: Record<string, unknown>;
    }) => {
      if (!useSupabase) throw new Error("Backend not configured");
      await updatePropertyBackend(id, payload);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["properties"] });
    },
  });

  const upsertMutation = useMutation({
    mutationFn: async ({
      id,
      payload,
    }: {
      id: string;
      payload: Record<string, unknown>;
    }) => {
      if (!useSupabase) throw new Error("Backend not configured");
      await upsertPropertyBackend(id, payload);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["properties"] });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      if (!useSupabase) throw new Error("Backend not configured");
      await deletePropertyBackend(id);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["properties"] });
    },
  });

  const upsertProperty = useCallback(
    async (partial: Omit<Property, "id"> & { id?: string }): Promise<string> => {
      if (!useSupabase) return partial.id ?? "";
      const id =
        partial.id ??
        (typeof crypto !== "undefined" && crypto.randomUUID
          ? crypto.randomUUID()
          : createPropertyId());

      const propertyPayload = {
        title: partial.title,
        slug: partial.slug ?? null,
        developer: partial.developer ?? "",
        location: partial.location,
        address: partial.address ?? null,
        city: partial.city ?? null,
        price_value: partial.price_value ?? null,
        price_min: (partial as { price_min?: number | null }).price_min ?? null,
        price_max: (partial as { price_max?: number | null }).price_max ?? null,
        beds: partial.beds ?? null,
        baths: partial.baths ?? null,
        sqft: partial.sqft,
        property_type: partial.property_type ?? "",
        construction_status: partial.status,
        possession_date: partial.possession_date ?? null,
        bhk_type: partial.bhk_type ?? null,
        possession_by: partial.possession_by ?? null,
        description: partial.description ?? null,
        latitude: partial.latitude ?? null,
        longitude: partial.longitude ?? null,
        google_map_link: partial.google_map_link ?? null,
        rera_applicable: partial.rera_applicable ?? false,
        rera_number: partial.rera_number ?? null,
      };

      const amenityIds = Array.isArray(partial.amenities)
        ? partial.amenities.map((a) => (typeof a === "string" ? a : a.id))
        : [];

      try {
        await upsertMutation.mutateAsync({ id, payload: { ...propertyPayload, id } });
        if (!useSupabase) await syncPropertyImages(id, partial.images ?? []);
        await syncPropertyAmenities(id, amenityIds);
        return id;
      } catch (e) {
        throw e;
      }
    },
    [useSupabase, upsertMutation],
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
    for (const p of DEFAULT_PROPERTIES) {
      const id = p.id ?? createPropertyId();
      const payload = {
        title: p.title,
        slug: null,
        developer: "",
        location: p.location,
        address: null,
        city: null,
        price_value: p.price_value ?? null,
        price_min: null,
        price_max: null,
        beds: p.beds,
        baths: p.baths,
        sqft: p.sqft,
        property_type: "",
        construction_status: p.status,
        possession_date: null,
        description: p.description ?? null,
        latitude: null,
        longitude: null,
        google_map_link: null,
        rera_applicable: false,
        rera_number: null,
      };
      await insertPropertyBackend(id, { ...payload, id });
      await syncPropertyImages(id, p.images ?? []);
      const defaultAmenityIds = Array.isArray(p.amenities)
        ? p.amenities.map((a) => (typeof a === "string" ? a : a.id))
        : [];
      await syncPropertyAmenities(id, defaultAmenityIds);
    }
    queryClient.invalidateQueries({ queryKey: ["properties"] });
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

/** Unified hook: uses backend (Firebase or Supabase) when configured, localStorage otherwise. */
export function useDataEntryPropertiesOrLocal() {
  const supabaseHook = useDataEntryProperties();
  const localHook = usePropertiesLocal();
  const useBackend = isBackendConfigured();
  return useBackend ? supabaseHook : localHook;
}
