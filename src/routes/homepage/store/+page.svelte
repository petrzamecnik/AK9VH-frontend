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

    let games: Game[] = [];
    let isLoading = true;
    let error: string | null = null;
    let purchaseSuccess = false;
    let purchaseMessage = "";

    let purchasedGames: Game[] = [];
    $: purchasedGameIds = purchasedGames.map(game => game.id);

    onMount(async () => {
        authStore.initialize();

        if (!isAuthenticated) {
            goto(ROUTES.LOGIN);
        }

        await fetchGames();
        await fetchPurchasedGames();

        isLoading = false;
    });

    async function fetchGames() {
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
        }
    }

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
                console.error("Failed to fetch purchased games:", errorData.message);
            }
        } catch (err) {
            console.error("Error fetching purchased games:", err);
        }
    }

    function isGamePurchased(gameId: number): boolean {
        return purchasedGameIds.includes(gameId);
    }

    async function handlePurchase(game: Game) {
        try {
            const response = await fetchApi('/api/purchases', {
                method: 'POST',
                auth: true,
                body: JSON.stringify({ user_id: $authStore.user?.userId, game_id: game.id })
            });

            if (response.ok) {
                purchasedGames = [...purchasedGames, game];

                purchaseSuccess = true;
                purchaseMessage = "Game purchased successfully! You can now view it in your library.";

                setTimeout(() => {
                    purchaseSuccess = false;
                    purchaseMessage = "";
                }, 5000);

            } else {
                const errorData = await response.json();
                error = errorData.message || "Failed to purchase game.";
            }
        } catch (err) {
            console.error("Error purchasing game:", err);
            error = "An unexpected error occurred while purchasing the game.";
        }
    }
</script>

<main class="min-h-screen bg-gray-800 p-4">
    <Navbar />

    <div class="max-w-6xl mx-auto mt-24">
        <h1 class="text-3xl font-bold text-white mb-8">Game Store</h1>

        {#if purchaseSuccess}
            <div class="bg-green-500 text-white p-4 rounded mb-4">
                {purchaseMessage}
                <a href={ROUTES.LIBRARY} class="text-blue-200 underline ml-2">Go to Library</a>
            </div>
        {/if}

        {#if isLoading}
            <p class="text-white">Loading games...</p>
        {:else if error}
            <p class="text-red-500">{error}</p>
        {:else if games.length > 0}
            <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {#each games as game}
                    <div class="bg-gray-900 rounded-lg shadow-xl overflow-hidden flex flex-col">
                        <img src={game.image_url} alt={game.title} class="w-full h-48 object-cover" />
                        <div class="p-4 flex flex-col flex-grow">
                            <h2 class="text-xl font-bold text-white mb-2">{game.title}</h2>
                            <p class="text-gray-400 mb-4 flex-grow">{game.description}</p>
                            <div class="flex items-center justify-between">
                                <span class="text-lg font-semibold text-white">{game.price}</span>
                                {#if isGamePurchased(game.id)}
                                    <span class="text-green-500 font-bold">Purchased</span>
                                {:else}
                                    <button
                                            on:click={() => handlePurchase(game)}
                                            class="bg-green-600 px-4 py-2 rounded font-bold hover:bg-green-500 transition-all duration-200 text-white"
                                    >
                                        Purchase
                                    </button>
                                {/if}
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