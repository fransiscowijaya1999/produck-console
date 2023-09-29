<script>
    import UserForm from "$lib/UserForm.svelte";
    import { fetchServer } from "$lib/fetch";
    import SelectClaimModal from "$lib/modals/SelectClaimModal.svelte";

    export let data;

    let buttonState = "normal";
    let errorMessage = "";
    let successMessage = "";

    let userRaw = {
        username: "",
        name: "",
        password: "",
        claims: []
    };

    let user = Object.assign({}, userRaw);

    let showSelectClaimModal = false;

    async function saveUser() {
        try {
            buttonState = "saving";

            const res = await fetchServer(`users`, {
                method: "POST",
                headers: { "Content-Type": "application/json", "Authorization": `Bearer ${data.authToken}` },
                body: JSON.stringify(user)
            });
    
            
            if (res.status != 204) {
                const result = await res.json();
                if (result.isError) return errorMessage = result.responseException.exceptionMessage;
            }

            user = Object.assign({}, userRaw);
            successMessage = "User saved";
        } catch (/** @type {*} */ error) {
            errorMessage = error;
        } finally {
            buttonState = "normal";
            setTimeout(() => successMessage = "", 5000);
            setTimeout(() => errorMessage = "", 5000);
        }
    }

    function handleClaimClick(event) {
        const { claim } = event.detail;
        const existingClaim = user.claims.filter(x => x.id == claim.id);

        if (existingClaim.length > 0) return;
        user.claims = [...user.claims, claim];
    }
</script>

{#if showSelectClaimModal}
    <SelectClaimModal authToken={data.authToken} on:handleClaimClick={handleClaimClick} on:handleModalClose={() => showSelectClaimModal = false} />
{/if}
<div class="container-fluid">
    <button class="btn btn-secondary mt-3" on:click={() => history.back()}>Back</button>
    <h1 class="mt-3">New User</h1>
    <div class="form-wrapper specific-w-350">
        <UserForm bind:user={user} on:handleSelectClaimClick={() => showSelectClaimModal = true} />
        <button on:click={saveUser} class="btn btn-primary btn-lg mt-3" class:disabled={buttonState == "saving"} type="button">
            {#if buttonState == "normal"}
                Save
            {:else if buttonState == "saving"}
                Saving...
            {/if}
        </button>
        {#if errorMessage}
            <div class="alert alert-danger mt-3">
                {errorMessage}
            </div>
        {:else if successMessage}
            <div class="alert alert-success mt-3">
                {successMessage}
            </div>
        {/if}
    </div>
</div>