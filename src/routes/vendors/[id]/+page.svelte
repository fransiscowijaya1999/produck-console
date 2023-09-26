<script>
    import { goto } from "$app/navigation";
    import { fetchServer } from "$lib/fetch";

    import VendorForm from "$lib/VendorForm.svelte";

    export let data;

    let buttonState = "normal";
    let errorMessage = "";
    let successMessage = "";

    let vendor = data.payload;

    async function save() {
        try {
            buttonState = "saving";

            const res = await fetchServer(`vendors/${vendor.id}`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(vendor)
            });
            
            if (res.status != 204) {
                const result = await res.json();
                if (result.isError) return errorMessage = result.responseException.exceptionMessage;
            }

            successMessage = "Vendor saved";
        } catch (/** @type {*} */ error) {
            errorMessage = error;
        } finally {
            buttonState = "normal";
            setTimeout(() => successMessage = "", 5000);
            setTimeout(() => errorMessage = "", 5000);
        }
    }

    async function deleteOne() {
        try {
            const res = await fetchServer(`vendors/${vendor.id}`, {
                method: "DELETE"
            });
    
            if (res.status != 204) {
                const result = await res.json();
                if (result.isError) return errorMessage = result.responseException.exceptionMessage;
            }

            goto("/vendors");
        } catch (/** @type {*} */ error) {
            errorMessage = error;
        } finally {
            buttonState = "normal";
            setTimeout(() => successMessage = "", 5000);
            setTimeout(() => errorMessage = "", 5000);
        }
    }
</script>

<div class="container-fluid">
    <button class="btn btn-secondary mt-3" on:click={() => history.back()}>Back</button>
    <h1 class="mt-3">Edit Vendor</h1>
    <div class="form-wrapper specific-w-350">
        <VendorForm bind:vendor={vendor} />
        <div class="d-flex mt-3 gap-2">
            <button on:click={save} class="btn btn-primary btn-lg d-block w-100" class:disabled={buttonState == "saving"} type="button">
                {#if buttonState == "normal"}
                    Save
                {:else if buttonState == "saving"}
                    Saving...
                {/if}
            </button>
            <button on:click={deleteOne} type="button" class="btn btn-danger btn-lg">Delete</button>
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