import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase, fetchPropertiesFromSupabase } from "../lib/supabase";
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

const PROPERTIES_TABLE = "properties";
const PROPERTY_IMAGES_TABLE = "property_images";
const STORAGE_BUCKET = "property-images";

/** Extract storage path from public URL: ".../property-images/{propertyId}/file" -> "{propertyId}/file" */
function getStoragePathsFromImageUrls(urls: { image_url: string }[]): string[] {
  const paths: string[] = [];
  for (const { image_url } of urls) {
    if (!image_url || typeof image_url !== "string") continue;
    const parts = image_url.split(`/${STORAGE_BUCKET}/`);
    if (parts.length >= 2 && parts[1]) paths.push(parts[1].trim());
  }
  return paths;
}

/** Map PropertyRow (from Supabase) to Property (used by DataEntry/UI) */
function toProperty(row: PropertyRow): Property {
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
    price_value: row.price_value,
    slug: undefined,
  };
}

/** Sync property_images table: replace all rows for property_id with given image URLs */
async function syncPropertyImages(
  propertyId: string,
  imageUrls: string[]
): Promise<void> {
  if (!supabase) return;
  const { error: delError } = await supabase
    .from(PROPERTY_IMAGES_TABLE)
    .delete()
    .eq("property_id", propertyId);
  if (delError) console.error("[Supabase] delete property_images error:", delError);
  if (imageUrls.length === 0) return;
  const { error: insertError } = await supabase
    .from(PROPERTY_IMAGES_TABLE)
    .insert(
      imageUrls.map((image_url, index) => ({
        property_id: propertyId,
        image_url,
        sort_order: index,
      }))
    );
  if (insertError) console.error("[Supabase] insert property_images error:", insertError);
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

/** Supabase-backed DataEntry properties (properties + property_images only) */
export function useDataEntryProperties() {
  const queryClient = useQueryClient();
  const useSupabase = !!supabase;

  const query = useQuery({
    queryKey: ["properties"],
    queryFn: fetchPropertiesFromSupabase,
    enabled: useSupabase,
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
      if (!supabase) throw new Error("Supabase not configured");
      const { data, error } = await supabase
        .from(PROPERTIES_TABLE)
        .insert({ ...payload, id })
        .select("id")
        .single();
      if (error) throw error;
      return data?.id != null ? String(data.id) : id;
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
      if (!supabase) throw new Error("Supabase not configured");
      const { error } = await supabase
        .from(PROPERTIES_TABLE)
        .update(payload)
        .eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["properties"] });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      if (!supabase) throw new Error("Supabase not configured");
      try {
        const { data: imageRows } = await supabase
          .from(PROPERTY_IMAGES_TABLE)
          .select("image_url")
          .eq("property_id", id);
        const urls = Array.isArray(imageRows) ? imageRows : [];
        const paths = getStoragePathsFromImageUrls(urls);
        if (paths.length > 0) {
          try {
            const { error: storageError } = await supabase.storage
              .from(STORAGE_BUCKET)
              .remove(paths);
            if (storageError) {
              console.error("[Supabase] storage cleanup error:", storageError);
            }
          } catch (e) {
            console.error("[Supabase] storage cleanup exception:", e);
          }
        }
        const { error: imagesError } = await supabase
          .from(PROPERTY_IMAGES_TABLE)
          .delete()
          .eq("property_id", id);
        if (imagesError) {
          console.error("[Supabase] delete property_images error:", imagesError);
        }
        const { error: propError } = await supabase
          .from(PROPERTIES_TABLE)
          .delete()
          .eq("id", id);
        if (propError) {
          console.error("[Supabase] delete property error:", propError);
        }
      } catch (e) {
        console.error("[Supabase] delete property exception:", e);
      }
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
        city: partial.city ?? null,
        price_display: partial.price,
        price_value: partial.price_value ?? null,
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
        amenities: partial.amenities ?? [],
      };

      try {
        if (partial.id && properties.some((p) => p.id === partial.id)) {
          await updateMutation.mutateAsync({ id, payload: propertyPayload });
          await syncPropertyImages(id, partial.images ?? []);
        } else {
          await insertMutation.mutateAsync({ payload: propertyPayload, id });
          await syncPropertyImages(id, partial.images ?? []);
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
    if (!useSupabase || !supabase) return;
    for (const p of DEFAULT_PROPERTIES) {
      const id = p.id ?? createPropertyId();
      const payload = {
        title: p.title,
        slug: null,
        developer: "",
        location: p.location,
        city: null,
        price_display: p.price,
        price_value: null,
        beds: p.beds,
        baths: p.baths,
        sqft: p.sqft,
        property_type: "",
        construction_status: p.status,
        possession_date: null,
        description: p.description ?? null,
        latitude: null,
        longitude: null,
        amenities: p.amenities ?? [],
      };
      await supabase.from(PROPERTIES_TABLE).insert({ ...payload, id });
      await syncPropertyImages(id, p.images ?? []);
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

/** Unified hook: uses Supabase when configured, localStorage otherwise. Both hooks called unconditionally to preserve React hook order. */
export function useDataEntryPropertiesOrLocal() {
  const supabaseHook = useDataEntryProperties();
  const localHook = usePropertiesLocal();
  const useSupabase = !!supabase;
  return useSupabase ? supabaseHook : localHook;
}
