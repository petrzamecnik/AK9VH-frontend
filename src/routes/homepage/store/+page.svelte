<script lang="ts">
    import {onMount} from 'svelte';
    import {goto} from "$app/navigation";
    import {authStore} from '../../../stores/authStore';
    import {ROUTES} from '../../../config/constants';
    import Navbar from "$lib/components/Navbar.svelte";
    import type {Game} from '$lib/types/game';
    import {fetchApi} from "$lib/utils/api";


    $: user = $authStore.user;
    $: isAuthenticated = $authStore.isAuthenticated;


    let games: Game[] = [];
    let isLoading = true;
    let error: string | null = null;


    onMount(async () => {
        // Initialize auth store
        authStore.initialize();

        // Check authentication
        if (!isAuthenticated) {
            goto(ROUTES.LOGIN);
        }


        try {
            const response = await fetchApi('/api/games', {
                method: 'GET',
                auth: true
            });

            if (response.ok) {
                games = await response.json();
            } else {
                const errorData = await response.json();
                error = errorData.message || "Failed to load games.";
            }
        } catch (err) {
            console.error("Error fetching games:", err);
            error = "An unexpected error occurred while loading games.";
        } finally {
            isLoading = false;
        }
    });


</script>

<main class="min-h-screen bg-gray-800 p-4">
    <!-- Top Navigation Bar -->
    <Navbar/>

    <!-- Main Content -->
    <div class="max-w-6xl mx-auto mt-24">
        <h1 class="text-3xl font-bold text-white mb-8">Game Store</h1>

        {#if isLoading}
            <p class="text-white">Loading games...</p>
        {:else if error}
            <p class="text-red-500">{error}</p>
        {:else if games.length > 0}
            <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {#each games as game}
                    <div class="bg-gray-900 rounded-lg shadow-xl overflow-hidden flex flex-col">
                        <img src={game.image_url} alt={game.title} class="w-full h-48 object-cover"/>
                        <div class="p-4 flex flex-col flex-grow">
                            <h2 class="text-xl font-bold text-white mb-2">{game.title}</h2>
                            <p class="text-gray-400 mb-4 flex-grow">{game.description}</p>
                            <div class="flex items-center justify-between">
                                <span class="text-lg font-semibold text-white">{game.price}</span>
                                <button
                                        class="bg-blue-700 px-4 py-2 rounded font-bold hover:bg-blue-600 transition-all duration-200 text-white"
                                >
                                    Download
                                </button>
                            </div>
                        </div>
                    </div>
                {/each}
            </div>
        {:else}
            <p class="text-white">No games available at the moment.</p>
        {/if}
    </div>
</main>