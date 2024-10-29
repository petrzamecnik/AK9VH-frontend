<script lang="ts">
    import "../../app.css";

    let username = "";
    let password = "";

    let usernameError = "";
    let passwordError = "";
    let loginServerError = "";
    let isLoginSuccess = false;
    let loginSuccessMessage = "Login successful! Redirecting...";

    async function handleLogin() {
        console.log("Username:", username);
        console.log("Password:", password);

        usernameError = passwordError = "";
        loginServerError = "";
        isLoginSuccess = false;

        if (!username) {
            usernameError = "Username is required";
        }

        if (!password) {
            passwordError = "Password is required";
        }

        // return if validation fails
        if (usernameError || passwordError) return;

        const loginData = {
            username,
            password
        };

        // post to backend
        try {
            const response = await fetch("http://localhost:3000/api/users/login", {
                method: "POST",
                headers: {"Content-Type": "application/json"},
                body: JSON.stringify(loginData)
            });

            if (response.ok) {
                isLoginSuccess = true;

                // somehow update app's auth state
                // redirect to home page

                return;
            } else {
                const errorData = await response.json();
                loginServerError = errorData.message;
                console.error("Login failed:", loginServerError);
            }

        } catch (error) {
            console.error("Error while logging in: ", error);
            loginServerError = "An error occurred while trying to log in";
        }
    }

    function navigateToPreviousScreen() {
        window.history.back();
    }
</script>

<main class="flex items-center justify-center min-h-screen relative bg-gray-800">
    <!-- back button -->
    <button on:click={navigateToPreviousScreen}
            class="absolute top-4 left-4 bg-blue-700 px-4 py-2 rounded font-bold flex items-center hover:scale-110 text-white">
        <svg class="w-5 h-5 mr-2 fill-current text-white" xmlns="http://www.w3.org/2000/svg">
            <path d="M10 15l-5-5 5-5v10z"/>
        </svg>
        Back
    </button>

    <!-- login fields -->
    <div class="flex flex-col w-96">
        <label class="text-lg font-medium text-white mb-1" for="username">Username</label>
        <input id="username"
               type="text"
               placeholder="Enter your username"
               bind:value={username}
               class="mb-4 p-2 rounded-md focus:outline-none focus:ring w-full text-gray-600 placeholder-gray-400 {usernameError ? 'border-red-500 border-2' : ''}">

        <label class="text-lg font-medium text-white mb-1" for="password">Password</label>
        <input id="password"
               type="password"
               placeholder="Enter your password"
               bind:value={password}
               class="mb-4 p-2 rounded-md focus:outline-none focus:ring w-full text-gray-600 placeholder-gray-400 {passwordError ? 'border-red-500 border-2' : ''}">

        <!-- login button -->
        <button on:click={handleLogin}
                class="bg-blue-700 my-2 py-2 rounded font-bold hover:bg-blue-600 text-white">
            Login
        </button>

        <!-- message -->
        <div class="min-h-[40px]">
            {#if loginServerError}
                <p class="text-red-500 text-sm break-words">{loginServerError}</p>
            {/if}
            {#if isLoginSuccess}
                <p class="text-green-500 text-sm break-words">{loginSuccessMessage}</p>
            {/if}
        </div>

        <!-- register link -->
        <div class="text-center mt-2">
            <p class="text-white text-sm">
                Don't have an account?
                <a href="/register" class="text-blue-400 hover:underline">Register here</a>
            </p>
        </div>
    </div>
</main>

<style lang="css">
</style>