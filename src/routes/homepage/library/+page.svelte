<script lang="ts">
    import { onMount } from 'svelte';
    import { goto } from "$app/navigation";
    import { authStore } from '../../../stores/authStore';
    import { ROUTES } from '../../../config/constants';
    import Navbar from "$lib/components/Navbar.svelte";
    import type { Game } from '$lib/types/game';
    import { fetchApi } from "$lib/utils/api";

    $: user = $authStore.user;
    $: isAuthenticated = $authStore.isAuthenticated;

    let purchasedGames: Game[] = [];
    let isLoading = true;
    let error: string | null = null;
    let downloadProgress: { [gameId: number]: number } = {}; // Track download progress for each game

    onMount(async () => {
        authStore.initialize();

        if (!isAuthenticated) {
            goto(ROUTES.LOGIN);
        }

        await fetchPurchasedGames();
    });

    async function fetchPurchasedGames() {
        try {
            const response = await fetchApi(`/api/purchases/${$authStore.user?.userId}`, {
                method: 'GET',
                auth: true
            });

            if (response.ok) {
                purchasedGames = await response.json();
            } else {
                const errorData = await response.json();
                error = errorData.message || "Failed to load purchased games.";
            }
        } catch (err) {
            console.error("Error fetching purchased games:", err);
            error = "An unexpected error occurred while loading purchased games.";
        } finally {
            isLoading = false;
        }
    }

    async function handleDownload(game: Game) {
        if (game.download_url) {
            try {
                downloadProgress[game.id] = 0; // Initialize progress to 0

                const response = await fetch(game.download_url, {
                    method: 'GET',
                    redirect: 'follow'
                });

                if (response.ok) {
                    const reader = response.body?.getReader();
                    const contentLength = +response.headers.get('Content-Length')!;

                    let receivedLength = 0;
                    let chunks = [];

                    while (true) {
                        const { done, value } = await reader!.read();

                        if (done) {
                            break;
                        }

                        chunks.push(value);
                        receivedLength += value.length;

                        // Update download progress
                        downloadProgress[game.id] = Math.round((receivedLength / contentLength) * 100);
                    }

                    const blob = new Blob(chunks);
                    const url = window.URL.createObjectURL(blob);
                    const link = document.createElement('a');
                    link.href = url;
                    link.setAttribute('download', `${game.title}.${game.download_url.split('.').pop()}`);
                    document.body.appendChild(link);
                    link.click();
                    link.remove();

                    // Reset progress after download
                    downloadProgress[game.id] = 0;
                } else {
                    console.error('Failed to download game:', response.status, response.statusText);
                    alert('Failed to download game.');
                }
            } catch (error) {
                console.error('Error during download:', error);
                alert('An error occurred while downloading.');
            }
        } else {
            alert('Download link not available.');
        }
    }
</script>

<main class="min-h-screen bg-gray-800 p-4">
    <Navbar />

    <div class="max-w-6xl mx-auto mt-24">
        <h1 class="text-3xl font-bold text-white mb-8">My Library</h1>

        {#if isLoading}
            <p class="text-white">Loading purchased games...</p>
        {:else if error}
            <p class="text-red-500">{error}</p>
        {:else if purchasedGames.length > 0}
            <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {#each purchasedGames as game}
                    <div class="bg-gray-900 rounded-lg shadow-xl overflow-hidden flex flex-col">
                        <img src={game.image_url} alt={game.title} class="w-full h-48 object-cover" />
                        <div class="p-4 flex flex-col flex-grow">
                            <h2 class="text-xl font-bold text-white mb-2">{game.title}</h2>
                            <p class="text-gray-400 mb-4 flex-grow">{game.description}</p>
                            <div class="flex items-center justify-between">
                                <button
                                        on:click={() => handleDownload(game)}
                                        class="bg-blue-700 px-4 py-2 rounded font-bold hover:bg-blue-600 transition-all duration-200 text-white"
                                >
                                    Download
                                </button>
                                {#if downloadProgress[game.id] > 0}
                                    <progress value={downloadProgress[game.id]} max="100" class="w-1/2"></progress>
                                    <span class="text-white">{downloadProgress[game.id]}%</span>
                                {/if}
                            </div>
                        </div>
                    </div>
                {/each}
            </div>
        {:else}
            <p class="text-white">No purchased games yet.</p>
        {/if}
    </div>
</main>