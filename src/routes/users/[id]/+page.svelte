<script>
    import { goto } from "$app/navigation";
    import UserForm from "$lib/UserForm.svelte";
    import { fetchServer } from "$lib/fetch";
    import SelectClaimModal from "$lib/modals/SelectClaimModal.svelte";

    export let data;

    let buttonState = "normal";
    let errorMessage = "";
    let successMessage = "";

    let user = data.payload;

    let showSelectClaimModal = false;

    async function saveUser() {
        try {
            buttonState = "saving";

            const res = await fetchServer(`users/${user.id}`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(user)
            });
    
            
            if (res.status != 204) {
                const result = await res.json();
                if (result.isError) return errorMessage = result.responseException.exceptionMessage;
            }

            successMessage = "User saved";
        } catch (/** @type {*} */ error) {
            errorMessage = error;
        } finally {
            buttonState = "normal";
            setTimeout(() => successMessage = "", 5000);
            setTimeout(() => errorMessage = "", 5000);
        }
    }

    async function deleteUser() {
        try {
            const res = await fetchServer(`users/${user.id}`, {
                method: "DELETE"
            });
    
            if (res.status != 204) {
                const result = await res.json();
                if (result.isError) return errorMessage = result.responseException.exceptionMessage;
            }

            goto("/users");
        } catch (/** @type {*} */ error) {
            errorMessage = error;
        } finally {
            buttonState = "normal";
            setTimeout(() => successMessage = "", 5000);
            setTimeout(() => errorMessage = "", 5000);
        }
    }

    async function refreshUser() {
        const res = await fetchServer(`users/${user.id}`);
        const result = await res.json();

        user = result.payload;
    }

    async function handleClaimClick(event) {
        if (!user.claims) user.claims = [];

        const { claim } = event.detail;
        const existingClaim = user.claims.filter(x => x.id == claim.id);

        if (existingClaim.length > 0) return;

        const claimAssignment = {
            userId: user.id,
            claimId: claim.id
        };

        try {
            const res = await fetchServer("claims/assign", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(claimAssignment)
            });
    
            if (res.status != 204) {
                const result = await res.json();
                if (result.isError) return errorMessage = result.responseException.exceptionMessage;
            }
        } catch (/** @type {*} */ error) {
            if (error.isError) return errorMessage = error.responseException.exceptionMessage;
            errorMessage = error.message;
        } finally {
            buttonState = "normal";
            setTimeout(() => errorMessage = "", 5000);
        }

        await refreshUser();
    }
</script>

{#if showSelectClaimModal}
    <SelectClaimModal on:handleClaimClick={handleClaimClick} on:handleModalClose={() => showSelectClaimModal = false} />
{/if}
<div class="container-fluid">
    <button class="btn btn-secondary mt-3" on:click={() => history.back()}>Back</button>
    <h1 class="mt-3">Edit User</h1>
    <div class="form-wrapper specific-w-350">
        <UserForm showClaimSelection={true} bind:user={user} on:handleSelectClaimClick={() => showSelectClaimModal = true} />
        <div class="d-flex mt-3 gap-2">
            <button on:click={saveUser} class="btn btn-primary btn-lg d-block w-100" class:disabled={buttonState == "saving"} type="button">
                {#if buttonState == "normal"}
                    Save
                {:else if buttonState == "saving"}
                    Saving...
                {/if}
            </button>
            <button on:click={deleteUser} type="button" class="btn btn-danger btn-lg">Delete</button>
        </div>
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