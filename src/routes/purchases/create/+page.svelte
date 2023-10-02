<script>
    import { goto } from "$app/navigation";
    import { fetchServer } from "$lib/fetch";
    import SelectVendorModal from "$lib/modals/SelectVendorModal.svelte";
    
    import PurchaseForm from "$lib/PurchaseForm.svelte";

    export let data;

    let buttonState = "normal";
    let errorMessage = "";
    let successMessage = "";
    let showVendorModal = false;

    let purchase = {
        vendor: {
            id: null,
            name: ""
        },
        date: "",
        sourceDocument: "",
        memo: ""
    };

    async function save() {
        const payload = Object.assign({}, purchase);
        payload.vendorId = payload.vendor.id;

        try {
            buttonState = "saving";

            const res = await fetchServer("purchases", {
                method: "POST",
                headers: { "Content-Type": "application/json", "Authorization": `Bearer ${data.authToken}` },
                body: JSON.stringify(payload)
            });
            
            if (res.status != 204) {
                const result = await res.json();
                if (result.isError) return errorMessage = result.responseException.exceptionMessage;
            }

            successMessage = "Purchase saved";
            goto("/purchases");
        } catch (/** @type {*} */ error) {
            errorMessage = error;
        } finally {
            buttonState = "normal";
            setTimeout(() => successMessage = "", 5000);
            setTimeout(() => errorMessage = "", 5000);
        }
    }
</script>

{#if showVendorModal}
    <SelectVendorModal on:handleItemClick={(event) => purchase.vendor = event.detail.item} on:handleModalClose={() => showVendorModal = false} authToken={data.authToken} />
{/if}

<div class="container-fluid">
    <button class="btn btn-secondary mt-3" on:click={() => history.back()}>Back</button>
    <h1 class="mt-3">New Purchase</h1>
    <div class="form-wrapper border-bottom pb-3">
        <PurchaseForm on:showVendorModal={() => showVendorModal = true} bind:purchase={purchase} />
        <button on:click={save} class="btn btn-primary btn-lg" class:disabled={buttonState == "saving"} type="button">
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