<script>
    import { goto } from "$app/navigation";

    let user = {
        username: "",
        password: ""
    };

    let errorMessage = "";

    async function login() {
        const formData = new FormData();
        formData.append("username", user.username);
        formData.append("password", user.password);

        const res = await fetch("/login", {
            method: "POST",
            body: formData
        });

        const result = await res.json();

        if (result.type == "failure") return errorMessage = result.data;
        goto("/");
    }
</script>

<div class="login-wrapper d-flex align-items-center justify-content-center">
    <div class="card specific-w-350">
        <div class="card-body">
            {#if errorMessage}
                <div class="alert alert-danger">{errorMessage}</div>
            {/if}
            <h3 class="card-title mb-3">Login</h3>
            <div class="mb-3">
                <label for="user-username" class="form-label">Username</label>
                <input bind:value={user.username} type="text" id="user-username" class="form-control" required>
            </div>
            <div class="mb-3">
                <label for="user-password" class="form-label">Password</label>
                <input bind:value={user.password} type="password" id="user-password" class="form-control" required>
            </div>
            <button on:click={login} type="button" class="btn btn-lg btn-primary d-block w-100">Sign In</button>
        </div>
    </div>
</div>

<style>
    .login-wrapper {
        background-color: white;
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
    }
</style>