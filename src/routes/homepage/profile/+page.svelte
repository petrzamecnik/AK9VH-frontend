<script lang="ts">
    import {onMount} from 'svelte';
    import {goto} from "$app/navigation";
    import {authStore} from '../../../stores/authStore';
    import {ROUTES} from '../../../config/constants';
    import Navbar from "$lib/components/Navbar.svelte";


    $: user = $authStore.user;
    $: isAuthenticated = $authStore.isAuthenticated;


    onMount(() => {
        // Initialize auth store
        authStore.initialize();

        // Check authentication
        if (!isAuthenticated) {
            goto(ROUTES.LOGIN);
        }
    });


</script>

<main class="min-h-screen bg-gray-800 p-4">
    <!-- Top Navigation Bar -->
    <Navbar/>

    <!-- Main Content -->
    {#if user}
        <div class="max-w-6xl mx-auto mt-24">

            <!-- User profile card -->
            <div class="bg-gray-900 rounded-lg p-6 shadow-xl mb-8">
                <div class="flex items-center justify-between mb-6">
                    <div>
                        <h2 class="text-2xl font-bold text-white mb-2">Profile</h2>
                        <p class="text-gray-400">Member since {user.joinDate}</p>
                    </div>
                </div>

                <div class="grid md:grid-cols-2 gap-4">
                    <div class="bg-gray-800 p-4 rounded">
                        <p class="text-gray-400 text-sm">Username</p>
                        <p class="text-white">{user.username}</p>
                    </div>
                    <div class="bg-gray-800 p-4 rounded">
                        <p class="text-gray-400 text-sm">Email</p>
                        <p class="text-white">{user.email}</p>
                    </div>
                </div>
            </div>

            <!-- rest of content here i guess?-->
        </div>
    {/if}
</main>