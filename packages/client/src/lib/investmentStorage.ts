/**
 * Storage for investment page listings (Commercial + Land).
 * Separate from residential Data Entry; not linked from main nav.
 */

const STORAGE_KEY = "patronage:investment_properties:v1";

export type CommercialItem = {
  id: number;
  title: string;
  location: string;
  type: string;
  size: string;
  roi: string;
  status: string;
  price: string;
  img: string;
  badge: string;
};

export type LandItem = {
  id: number;
  title: string;
  location: string;
  acres: string;
  zoning: string;
  potential: string;
  price: string;
  img: string;
  badge: string;
};

export type InvestmentStorage = {
  commercial: CommercialItem[];
  land: LandItem[];
};

function getStored(): InvestmentStorage {
  try {
    const raw = typeof window !== "undefined" ? localStorage.getItem(STORAGE_KEY) : null;
    if (raw) {
      const parsed = JSON.parse(raw) as InvestmentStorage;
      if (Array.isArray(parsed.commercial) && Array.isArray(parsed.land)) return parsed;
    }
  } catch {
    // ignore
  }
  return { commercial: [], land: [] };
}

function setStored(data: InvestmentStorage): void {
  try {
    if (typeof window !== "undefined") localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  } catch {
    // ignore
  }
}

function nextId(items: { id: number }[]): number {
  const max = items.length ? Math.max(...items.map((i) => i.id)) : 0;
  return max + 1;
}

export function getInvestmentProperties(): InvestmentStorage {
  return getStored();
}

export function addCommercial(item: Omit<CommercialItem, "id">): CommercialItem {
  const stored = getStored();
  const newItem: CommercialItem = { ...item, id: nextId(stored.commercial) };
  stored.commercial.push(newItem);
  setStored(stored);
  return newItem;
}

export function addLand(item: Omit<LandItem, "id">): LandItem {
  const stored = getStored();
  const newItem: LandItem = { ...item, id: nextId(stored.land) };
  stored.land.push(newItem);
  setStored(stored);
  return newItem;
}

export function removeCommercial(id: number): void {
  const stored = getStored();
  stored.commercial = stored.commercial.filter((c) => c.id !== id);
  setStored(stored);
}

export function removeLand(id: number): void {
  const stored = getStored();
  stored.land = stored.land.filter((l) => l.id !== id);
  setStored(stored);
}

export function setInvestmentProperties(data: InvestmentStorage): void {
  setStored(data);
}
