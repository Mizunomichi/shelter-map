// Service Worker registration and offline queue management

export function registerServiceWorker() {
  if ('serviceWorker' in navigator) {
    window.addEventListener('load', async () => {
      try {
        const registration = await navigator.serviceWorker.register('/sw.js', {
          type: 'module'
        })
        console.log('Service Worker registered:', registration)

        // Register Background Sync for offline queue
        if ('sync' in registration) {
          console.log('Background Sync supported')
        }
      } catch (error) {
        console.error('Service Worker registration failed:', error)
      }
    })
  }
}

// IndexedDB helper for offline queue
const DB_NAME = 'shelter-map-offline'
const STORE_NAME = 'queue'
const DB_VERSION = 1

export interface OfflineQueueItem {
  id: string
  shelter_id: string
  pin: string
  current_occupancy: number
  queued_at: string
  synced: boolean
  failed?: boolean
}

function openDB(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, DB_VERSION)

    request.onerror = () => reject(request.error)
    request.onsuccess = () => resolve(request.result)

    request.onupgradeneeded = (event) => {
      const db = (event.target as IDBOpenDBRequest).result
      if (!db.objectStoreNames.contains(STORE_NAME)) {
        const store = db.createObjectStore(STORE_NAME, { keyPath: 'id' })
        store.createIndex('synced', 'synced', { unique: false })
      }
    }
  })
}

export async function enqueueOfflineSubmission(
  shelter_id: string,
  pin: string,
  current_occupancy: number
): Promise<string> {
  const db = await openDB()
  const item: OfflineQueueItem = {
    id: crypto.randomUUID(),
    shelter_id,
    pin,
    current_occupancy,
    queued_at: new Date().toISOString(),
    synced: false
  }

  return new Promise((resolve, reject) => {
    const transaction = db.transaction([STORE_NAME], 'readwrite')
    const store = transaction.objectStore(STORE_NAME)
    const request = store.add(item)

    request.onsuccess = () => resolve(item.id)
    request.onerror = () => reject(request.error)
  })
}

export async function getQueuedCount(): Promise<number> {
  const db = await openDB()
  return new Promise((resolve, reject) => {
    const transaction = db.transaction([STORE_NAME], 'readonly')
    const store = transaction.objectStore(STORE_NAME)
    const index = store.index('synced')
    const request = index.count(IDBKeyRange.only(false))

    request.onsuccess = () => resolve(request.result)
    request.onerror = () => reject(request.error)
  })
}

export async function getPendingItems(): Promise<OfflineQueueItem[]> {
  const db = await openDB()
  return new Promise((resolve, reject) => {
    const transaction = db.transaction([STORE_NAME], 'readonly')
    const store = transaction.objectStore(STORE_NAME)
    const index = store.index('synced')
    const request = index.getAll(IDBKeyRange.only(false))

    request.onsuccess = () => resolve(request.result)
    request.onerror = () => reject(request.error)
  })
}

export async function markItemSynced(id: string, failed: boolean = false): Promise<void> {
  const db = await openDB()
  return new Promise((resolve, reject) => {
    const transaction = db.transaction([STORE_NAME], 'readwrite')
    const store = transaction.objectStore(STORE_NAME)
    const getRequest = store.get(id)

    getRequest.onsuccess = () => {
      const item = getRequest.result
      if (item) {
        item.synced = true
        item.failed = failed
        item.pin = '' // Clear PIN after sync
        const updateRequest = store.put(item)
        updateRequest.onsuccess = () => resolve()
        updateRequest.onerror = () => reject(updateRequest.error)
      } else {
        resolve()
      }
    }
    getRequest.onerror = () => reject(getRequest.error)
  })
}
