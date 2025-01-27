<script lang="ts">
    import { onMount } from 'svelte';
    import { goto } from "$app/navigation";
    import { authStore } from '../../../stores/authStore';
    import { downloadsStore } from '../../../stores/downloadsStore';
    import { ROUTES } from '../../../config/constants';
    import Navbar from "$lib/components/Navbar.svelte";
    import { open } from '@tauri-apps/plugin-dialog';

    $: user = $authStore.user;
    $: isAuthenticated = $authStore.isAuthenticated;
    $: downloadDirectory = $downloadsStore.downloadDirectory;

    onMount(() => {
        authStore.initialize();
        downloadsStore.initialize();

        if (!isAuthenticated) {
            goto(ROUTES.LOGIN);
        }
    });

    async function selectDownloadDirectory() {
        try {
            const selected = await open({
                directory: true,
                multiple: false,
                title: 'Select Download Directory'
            });

            if (typeof selected === 'string') {
                downloadsStore.setDownloadDirectory(selected);
            } else if (selected === null) {
                console.log("User cancelled the selection");
            } else {
                console.error("Unexpected result from directory selection:", selected);
            }
        } catch (error) {
            console.error("Failed to open directory picker:", error);
        }
    }

    function clearDownloadDirectory() {
        downloadsStore.clearDownloadDirectory();
    }
</script>

<main class="min-h-screen bg-gray-800 p-4">
    <Navbar />

    <div class="max-w-6xl mx-auto mt-24">
        <h2 class="text-2xl font-bold text-white mb-6">Settings</h2>

        <div class="bg-gray-900 rounded-lg p-6 shadow-xl">
            <h3 class="text-lg font-semibold text-white mb-4">Downloads</h3>

            <div class="flex items-center gap-4 mb-4">
                <button
                        on:click={selectDownloadDirectory}
                        class="bg-blue-700 px-4 py-2 rounded font-bold hover:bg-blue-600 transition-all duration-200 text-white"
                >
                    Select Download Folder
                </button>

                {#if downloadDirectory}
                    <button
                            on:click={clearDownloadDirectory}
                            class="bg-red-600 px-4 py-2 rounded font-bold hover:bg-red-700 transition-all duration-200 text-white"
                    >
                        Clear
                    </button>
                {/if}
            </div>

            {#if downloadDirectory}
                <p class="text-gray-300">Current download directory: <span class="text-white">{downloadDirectory}</span></p>
            {:else}
                <p class="text-gray-300">No download directory selected.</p>
            {/if}
        </div>
    </div>
</main>