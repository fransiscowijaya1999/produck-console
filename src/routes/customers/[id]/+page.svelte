<script>
    import { fetchServer } from "$lib/fetch";
    
    import CustomerForm from "$lib/CustomerForm.svelte";
    import { goto } from "$app/navigation";

    export let data;

    const authHeader = { "Authorization": `Bearer ${data.authToken}` };

    let buttonState = "normal";
    let errorMessage = "";
    let successMessage = "";

    let customer = data.payload;

    async function save() {
        try {
            buttonState = "saving";

            const res = await fetchServer(`customers/${customer.id}`, {
                method: "PUT",
                headers: { "Content-Type": "application/json", ...authHeader },
                body: JSON.stringify(customer)
            });
            
            if (res.status != 204) {
                const result = await res.json();
                if (result.isError) return errorMessage = result.responseException.exceptionMessage;
            }

            successMessage = "Customer saved";
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
            const res = await fetchServer(`customers/${customer.id}`, {
                method: "DELETE",
                headers: authHeader
            });
    
            if (res.status != 204) {
                const result = await res.json();
                if (result.isError) return errorMessage = result.responseException.exceptionMessage;
            }

            goto("/customers");
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
    <h1 class="mt-3">Edit Customer</h1>
    <div class="form-wrapper specific-w-350">
        <CustomerForm bind:customer={customer} />
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