<script lang="ts">
    import {onMount} from 'svelte';
    import {goto} from "$app/navigation";
    import {authStore} from '../../stores/authStore';
    import {ROUTES} from '../../config/constants';
    import {Gamepad2, PackageOpen, Settings, User} from 'lucide-svelte';


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

    async function handleLogout() {
        try {
            const response = await fetch("http://localhost:3000/api/users/logout", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${$authStore.token}`
                }
            });

            if (response.ok) {
                authStore.logout();
                await goto(ROUTES.LOGIN);
            }
        } catch (error) {
            console.error("Logout error:", error);
            authStore.logout();
            await goto(ROUTES.LOGIN);
        }
    }


</script>

<main class="min-h-screen bg-gray-800 p-4">
    <!-- Top Navigation Bar -->
    <nav class="bg-gray-900 fixed top-0 left-0 right-0 p-4 shadow-lg">
        <div class="max-w-6xl mx-auto flex justify-between items-center">
            <h1 class="text-2xl font-bold text-white">Dashboard</h1>

            <!-- Navigation Items -->
            <div class="flex items-center gap-10">
                <a class="flex flex-col items-center text-gray-400 hover:text-white transition-colors duration-200"
                   href={ROUTES.HOMEPAGE}>
                    <User size="24"/>
                    <span class="text-xs mt-1">Profile</span>
                </a>
                <a class="flex flex-col items-center text-gray-400 hover:text-white transition-colors duration-200"
                   href={ROUTES.STORE}>
                    <PackageOpen size="24"/>
                    <span class="text-xs mt-1">Store</span>
                </a>
                <a class="flex flex-col items-center text-gray-400 hover:text-white transition-colors duration-200"
                   href={ROUTES.LIBRARY}>
                    <Gamepad2 size="24"/>
                    <span class="text-xs mt-1">Library</span>
                </a>
                <a class="flex flex-col items-center text-gray-400 hover:text-white transition-colors duration-200"
                   href={ROUTES.SETTINGS}>
                    <Settings size="24"/>
                    <span class="text-xs mt-1">Settings</span>
                </a>
            </div>


            {#if user}
                <div class="flex items-center gap-4">
                    <span class="text-gray-300">Welcome, {user?.username}!</span>
                    <button
                            on:click={handleLogout}
                            class="bg-red-600 px-4 py-2 rounded font-bold hover:bg-red-700 transition-all duration-200 text-white">
                        Logout
                    </button>
                </div>
            {/if}
        </div>
    </nav>

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