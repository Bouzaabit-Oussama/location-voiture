import Dexie, { type Table } from "dexie";
import type { Inspection } from "@/types/database";

type InspectionInsert = Partial<Inspection>;

export interface OfflineSyncItem<T> {
  id: string; // local UUID
  data: T;
  type: "inspection" | "client" | "booking";
  action: "create" | "update";
  createdAt: string;
  status: "pending" | "syncing" | "failed";
  retryCount: number;
  lastError?: string;
}

export class LocationVoitureDatabase extends Dexie {
  // Sync queue for offline mutations
  syncQueue!: Table<OfflineSyncItem<any>, string>;

  // Cached read-only data for offline use
  cachedVehicles!: Table<any, string>;
  cachedBookings!: Table<any, string>;

  constructor() {
    super("LocationVoitureDatabase");
    this.version(1).stores({
      syncQueue: "id, type, action, status, createdAt",
      cachedVehicles: "id, plate_number, status",
      cachedBookings: "id, vehicle_id, status",
    });
  }
}

export const db = new LocationVoitureDatabase();

/**
 * Queue an item for background sync.
 */
export async function queueForSync<T>(
  type: "inspection" | "client" | "booking",
  action: "create" | "update",
  data: T
): Promise<string> {
  const id = crypto.randomUUID();
  await db.syncQueue.add({
    id,
    data,
    type,
    action,
    createdAt: new Date().toISOString(),
    status: "pending",
    retryCount: 0,
  });

  // Attempt to trigger service worker background sync if available
  if ("serviceWorker" in navigator && "SyncManager" in window) {
    try {
      const registration = await navigator.serviceWorker.ready;
      // @ts-ignore - TS doesn't know about sync yet
      await registration.sync.register("location-voiture-sync");
    } catch (err) {
      console.warn("Background sync registration failed:", err);
      // Fallback to manual sync trigger here if needed
    }
  }

  return id;
}
