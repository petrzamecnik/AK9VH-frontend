<script lang="ts">
    import "../app.css";
    import {goto} from "\$app/navigation";

    function navigateToRegister() {
        goto("/register");
    }

    function navigateToLogin() {
        goto("/login");
    }


</script>

<main class="flex items-center justify-center min-h-screen">
    <div class="flex flex-col mx-auto p-4">
        <button on:click={navigateToLogin} class="bg-blue-700 my-2 px-8 py-2 rounded font-bold hover:scale-110">
            Login
        </button>
        <button on:click={navigateToRegister} class="bg-blue-700 my-2 px-8 py-2 rounded font-bold hover:scale-110">
            Register
        </button>
    </div>
</main>

<style lang="css">

</style>


