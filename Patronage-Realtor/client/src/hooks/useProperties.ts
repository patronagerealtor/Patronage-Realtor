import { useCallback, useEffect, useMemo, useState } from "react";
import {
  createPropertyId,
  DEFAULT_PROPERTIES,
  loadProperties,
  saveProperties,
  type Property,
} from "@/lib/propertyStore";

export function useProperties() {
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
    (partial: Omit<Property, "id"> & { id?: string }) => {
      const id = partial.id ?? createPropertyId();
      const next: Property[] = (() => {
        const existingIdx = properties.findIndex((p) => p.id === id);
        if (existingIdx === -1) return [{ ...partial, id } as Property, ...properties];
        const copy = properties.slice();
        copy[existingIdx] = { ...copy[existingIdx], ...partial, id };
        return copy;
      })();
      setProperties(next);
      return id;
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
    setProperties,
    upsertProperty,
    deleteProperty,
    resetToDefaults,
  };
}

