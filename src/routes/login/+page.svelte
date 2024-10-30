<script lang="ts">
    import "../../app.css";
    import { goto } from "$app/navigation";
    import { authStore } from '../../stores/authStore';
    import { fetchApi } from '$lib/utils/api';
    import { ROUTES } from '../../config/constants';

    let username = "";
    let password = "";

    let usernameError = "";
    let passwordError = "";
    let loginServerError = "";
    let isLoginSuccess = false;
    let loginSuccessMessage = "Login successful! Redirecting...";
    let isLoading = false;

    async function handleLogin() {
        // Reset errors and success state
        usernameError = passwordError = "";
        loginServerError = "";
        isLoginSuccess = false;
        isLoading = true;

        try {
            // Validate inputs
            if (!username) {
                usernameError = "Username is required";
            }
            if (!password) {
                passwordError = "Password is required";
            }
            if (usernameError || passwordError) {
                isLoading = false;
                return;
            }

            // Attempt login
            const response = await fetchApi('/api/users/login', {
                method: 'POST',
                body: JSON.stringify({ username, password })
            });

            if (response.ok) {
                const data = await response.json();

                // Create user data object
                const userData = {
                    userId: data.user.userId,
                    username: data.user.username,
                    email: data.user.email,
                    joinDate: data.user.joinDate || new Date().toLocaleDateString()
                };

                // Update auth store
                authStore.login(userData, data.token);

                isLoginSuccess = true;
                loginSuccessMessage = "Login successful! Redirecting...";

                // Clear form
                username = "";
                password = "";

                // Redirect after showing success message
                setTimeout(() => {
                    goto(ROUTES.HOMEPAGE);
                }, 1000);
            } else {
                const errorData = await response.json();
                loginServerError = errorData.message || "Login failed. Please try again.";
            }
        } catch (error) {
            console.error("Login error:", error);
            loginServerError = "An error occurred while trying to log in";
        } finally {
            isLoading = false;
        }
    }

    function navigateToHome() {
        goto(ROUTES.HOME);
    }

    // Handle Enter key press
    function handleKeyPress(event: KeyboardEvent) {
        if (event.key === 'Enter') {
            handleLogin();
        }
    }

    // Initialize auth store and check if already logged in
    authStore.initialize();
    if ($authStore.isAuthenticated) {
        goto(ROUTES.HOMEPAGE);
    }
</script>

<main class="flex items-center justify-center min-h-screen relative bg-gray-800">
    <!-- Back button -->
    <button
            on:click={navigateToHome}
            class="absolute top-4 left-4 bg-blue-700 px-4 py-2 rounded font-bold flex items-center hover:scale-110 text-white">
        <svg class="w-5 h-5 mr-2 fill-current text-white" xmlns="http://www.w3.org/2000/svg">
            <path d="M10 15l-5-5 5-5v10z"/>
        </svg>
        Back
    </button>

    <!-- Login fields -->
    <div class="flex flex-col w-96">
        <!-- Username field -->
        <label
                class="text-lg font-medium text-white mb-1"
                for="username">
            Username
        </label>
        <input
                id="username"
                type="text"
                placeholder="Enter your username"
                bind:value={username}
                class="mb-4 p-2 rounded-md focus:outline-none focus:ring w-full text-gray-600 placeholder-gray-400 {usernameError ? 'border-red-500 border-2' : ''}"
        >
        {#if usernameError}
            <p class="text-red-500 text-sm mb-2">{usernameError}</p>
        {/if}

        <!-- Password field -->
        <label
                class="text-lg font-medium text-white mb-1"
                for="password">
            Password
        </label>
        <input
                id="password"
                type="password"
                placeholder="Enter your password"
                bind:value={password}
                class="mb-4 p-2 rounded-md focus:outline-none focus:ring w-full text-gray-600 placeholder-gray-400 {passwordError ? 'border-red-500 border-2' : ''}"
        >
        {#if passwordError}
            <p class="text-red-500 text-sm mb-2">{passwordError}</p>
        {/if}

        <!-- Login button -->
        <button
                on:click={handleLogin}
                class="bg-blue-700 my-2 py-2 rounded font-bold hover:bg-blue-600 transition-colors duration-200 text-white">
            Login
        </button>

        <!-- Status messages -->
        <div class="min-h-[40px]">
            {#if loginServerError}
                <p class="text-red-500 text-sm break-words">{loginServerError}</p>
            {/if}
            {#if isLoginSuccess}
                <p class="text-green-500 text-sm break-words">{loginSuccessMessage}</p>
            {/if}
        </div>

        <!-- Register link -->
        <div class="text-center mt-2">
            <p class="text-white text-sm">
                Don't have an account?
                <a
                        href={ROUTES.REGISTER}
                        class="text-blue-400 hover:underline">
                    Register here
                </a>
            </p>
        </div>
    </div>
</main>