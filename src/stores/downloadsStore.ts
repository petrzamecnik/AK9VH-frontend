import { writable } from 'svelte/store';

interface DownloadsStore {
    downloadDirectory: string | null;
}

const localStorageKey = 'downloadDirectory';

function createDownloadsStore() {
    const storedDirectory = localStorage.getItem(localStorageKey) || null;
    const initialState: DownloadsStore = {
        downloadDirectory: storedDirectory,
    };

    const { subscribe, set, update } = writable<DownloadsStore>(initialState);

    return {
        subscribe,
        setDownloadDirectory: (directory: string) => {
            localStorage.setItem(localStorageKey, directory);
            set({ downloadDirectory: directory });
        },
        clearDownloadDirectory: () => {
            localStorage.removeItem(localStorageKey);
            set({ downloadDirectory: null });
        },
        initialize: () => {
            const storedDirectory = localStorage.getItem(localStorageKey) || null;
            set({ downloadDirectory: storedDirectory });
        }
    };
}

export const downloadsStore = createDownloadsStore();