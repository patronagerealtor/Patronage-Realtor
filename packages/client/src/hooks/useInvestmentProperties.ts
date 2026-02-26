import { useState, useCallback, useEffect } from "react";
import {
  getInvestmentProperties,
  addCommercial as addCommercialStorage,
  addLand as addLandStorage,
  removeCommercial as removeCommercialStorage,
  removeLand as removeLandStorage,
  type CommercialItem,
  type LandItem,
} from "../lib/investmentStorage";

export function useInvestmentProperties() {
  const [data, setData] = useState<{ commercial: CommercialItem[]; land: LandItem[] }>(() =>
    getInvestmentProperties()
  );

  const refresh = useCallback(() => {
    setData(getInvestmentProperties());
  }, []);

  useEffect(() => {
    const onStorage = (e: StorageEvent) => {
      if (e.key?.includes("investment_properties")) refresh();
    };
    window.addEventListener("storage", onStorage);
    return () => window.removeEventListener("storage", onStorage);
  }, [refresh]);

  const addCommercial = useCallback(
    (item: Omit<CommercialItem, "id">) => {
      const added = addCommercialStorage(item);
      refresh();
      return added;
    },
    [refresh]
  );

  const addLand = useCallback(
    (item: Omit<LandItem, "id">) => {
      const added = addLandStorage(item);
      refresh();
      return added;
    },
    [refresh]
  );

  const removeCommercial = useCallback(
    (id: number) => {
      removeCommercialStorage(id);
      refresh();
    },
    [refresh]
  );

  const removeLand = useCallback(
    (id: number) => {
      removeLandStorage(id);
      refresh();
    },
    [refresh]
  );

  return {
    commercial: data.commercial,
    land: data.land,
    addCommercial,
    addLand,
    removeCommercial,
    removeLand,
    refresh,
  };
}
