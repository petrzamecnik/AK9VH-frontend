<script lang="ts">
    import "../../app.css";

    let username = "";
    let email = "";
    let password = "";

    let usernameError = "";
    let emailError = "";
    let passwordError = "";
    let registerServerError = "";
    let isRegisterSuccess = false;
    let registerSuccessMessage = "Registration was successful, you can go back to login!"

    async function handleRegister() {
        console.log("Username:", username);
        console.log("Email:", email);
        console.log("Password:", password);

        usernameError = emailError = passwordError = "";
        registerServerError = emailError = "";
        isRegisterSuccess = false;

        if (!username) {
            usernameError = "Username is required";
        }

        if (!email) {
            emailError = "Email is required";
        }

        if (!password) {
            passwordError = "Password is required";
        }

        // return if validation fails
        if (usernameError || emailError || passwordError) return;

        const userData = {
            username,
            email,
            password
        };

        // post to backend
        try {
            const response = await fetch("http://localhost:3000/api/users/register", {
                method: "POST",
                headers: {"Content-Type": "application/json"},
                body: JSON.stringify(userData)
            });

            if (response.ok) {
                isRegisterSuccess = true;
                return
            } else {
                const errorData = await response.json();
                registerServerError = errorData.message;
                console.error("Registration failed:", registerServerError);
            }

        } catch (error) {
            console.error("Error while creating user: ", error);
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

    <!-- register fields -->
    <div class="flex flex-col w-96">
        <label class="text-lg font-medium text-white mb-1" for="username">Username</label>
        <input id="username"
               type="text"
               placeholder="Enter your username"
               bind:value={username}
               class="mb-4 p-2 rounded-md focus:outline-none focus:ring w-full text-gray-600 placeholder-gray-400 {usernameError ? 'border-red-500 border-2' : ''}">

        <label class="text-lg font-medium text-white mb-1" for="email">Email Address</label>
        <input id="email"
               type="email"
               placeholder="Enter your email"
               bind:value={email}
               class="mb-4 p-2 rounded-md focus:outline-none focus:ring w-full text-gray-600 placeholder-gray-400 {emailError ? 'border-red-500 border-2' : ''}">

        <label class="text-lg font-medium text-white mb-1" for="password">Password</label>
        <input id="password"
               type="password"
               placeholder="Enter your password"
               bind:value={password}
               class="mb-4 p-2 rounded-md focus:outline-none focus:ring w-full text-gray-600 placeholder-gray-400 {passwordError ? 'border-red-500 border-2' : ''}">

        <!-- register button -->
        <button on:click={handleRegister}
                class="bg-blue-700 my-2 py-2 rounded font-bold hover:bg-blue-600 text-white">
            Register
        </button>

        <!-- message -->
        <div class="min-h-[40px]">
            {#if registerServerError}
                <p class="text-red-500 text-sm break-words">{registerServerError}</p>
            {/if}
            {#if isRegisterSuccess}
                <p class="text-green-500 text-sm break-words">{registerSuccessMessage}</p>
            {/if}
        </div>

        <!-- login link -->
        <div class="text-center mt-2">
            <p class="text-white text-sm">
                Already have an account?
                <a href="/login" class="text-blue-400 hover:underline">Login here</a>
            </p>
        </div>
    </div>
</main>

<style lang="css">
</style>