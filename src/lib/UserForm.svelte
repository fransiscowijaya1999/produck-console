<script>
    import { createEventDispatcher } from "svelte";

    export let user = {
        name: "",
        username: "",
        password: "",
        claims: []
    };
    export let showClaimSelection = false;

    const dispatch = createEventDispatcher();

    function handleSelectClaimClick() {
        dispatch("handleSelectClaimClick");
    }
</script>

<div class="mb-3">
    <label for="user-name" class="form-label">Name</label>
    <input bind:value={user.name} type="text" id="user-name" class="form-control" required>
</div>
<div class="mb-3">
    <label for="user-username" class="form-label">Username</label>
    <input bind:value={user.username} type="text" id="user-username" class="form-control" required>
</div>
<div class="mb-3">
    <label for="user-password" class="form-label">Password</label>
    <input bind:value={user.password} type="password" id="user-password" class="form-control" required>
</div>
{#if showClaimSelection}
    <div class="mb-3">
        {#if user.claims}
            <div class="d-flex gap-1 mb-2">
                {#each user.claims as claim}
                    <span class="badge text-bg-secondary">{claim.name}</span>            
                {/each}
            </div>
        {/if}
        <div class="input-group">
            <button on:click={handleSelectClaimClick} class="btn btn-secondary">Select Claim</button>
        </div>
    </div>
{/if}