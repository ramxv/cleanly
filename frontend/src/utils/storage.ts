// ============================================================
// Cleanly - localStorage helpers
// Simula una base de datos clave-valor con operaciones CRUD
// ============================================================

export function getStore<T>(key: string): T[] {
  try {
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

export function setStore<T>(key: string, data: T[]): void {
  localStorage.setItem(key, JSON.stringify(data));
}

export function getOne<T extends { id: string }>(
  key: string,
  id: string,
): T | undefined {
  const items = getStore<T>(key);
  return items.find((item) => item.id === id);
}

export function insertOne<T extends { id: string }>(
  key: string,
  item: T,
): T {
  const items = getStore<T>(key);
  items.push(item);
  setStore(key, items);
  return item;
}

export function updateOne<T extends { id: string }>(
  key: string,
  id: string,
  updates: Partial<T>,
): T | undefined {
  const items = getStore<T>(key);
  const index = items.findIndex((item) => item.id === id);
  if (index === -1) return undefined;
  const updated = { ...items[index], ...updates } as T;
  items[index] = updated;
  setStore(key, items);
  return updated;
}

export function deleteOne<T extends { id: string }>(
  key: string,
  id: string,
): boolean {
  const items = getStore<T>(key);
  const filtered = items.filter((item) => item.id !== id);
  if (filtered.length === items.length) return false;
  setStore(key, filtered);
  return true;
}

export function query<T>(
  key: string,
  predicate: (item: T) => boolean,
): T[] {
  const items = getStore<T>(key);
  return items.filter(predicate);
}

// Simula una llamada asíncrona con delay
export function delay<T>(data: T, ms = 500): Promise<T> {
  return new Promise((resolve) => setTimeout(() => resolve(data), ms));
}

export function delayError(message: string, ms = 500): Promise<never> {
  return new Promise((_, reject) =>
    setTimeout(() => reject(new Error(message)), ms),
  );
}
