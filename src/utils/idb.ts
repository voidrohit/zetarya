// idb.ts
export function openTarChunkDB(): Promise<IDBDatabase> {
    return new Promise((resolve, reject) => {
        const request = indexedDB.open("TarChunkDB", 1);

        request.onupgradeneeded = () => {
            const db = request.result;
            if (!db.objectStoreNames.contains("chunks")) {
                db.createObjectStore("chunks", { keyPath: "chunkNumber" });
            }
        };

        request.onsuccess = () => resolve(request.result);
        request.onerror = () => reject(request.error);
    });
}

export async function storeTarChunk(db: IDBDatabase, chunkNumber: number, data: Blob) {
    return new Promise<void>((resolve, reject) => {
        const tx = db.transaction("chunks", "readwrite");
        const store = tx.objectStore("chunks");
        store.put({ chunkNumber, data });

        tx.oncomplete = () => resolve();
        tx.onerror = () => reject(tx.error);
    });
}

export async function getAllTarChunks(db: IDBDatabase): Promise<Blob[]> {
    return new Promise((resolve, reject) => {
        const tx = db.transaction("chunks", "readonly");
        const store = tx.objectStore("chunks");

        const request = store.getAll();

        request.onsuccess = () => {
            const sorted = request.result.sort((a, b) => a.chunkNumber - b.chunkNumber);
            resolve(sorted.map((entry) => entry.data));
        };

        request.onerror = () => reject(request.error);
    });
}
