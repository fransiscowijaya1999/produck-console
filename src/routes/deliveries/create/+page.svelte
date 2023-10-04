<script>
    import { goto } from "$app/navigation";
    import { fetchServer } from "$lib/fetch";

    import DeliveryForm from "$lib/DeliveryForm.svelte";
    import SelectLocationModal from "$lib/modals/SelectLocationModal.svelte";
    
    export let data;

    let buttonState = "normal";
    let errorMessage = "";
    let successMessage = "";

    let delivery = {
        date: "",
        biller: "",
        sourceLocation: null,
        targetLocation: null,
        isPurchase: true
    };

    let showSourceLocationModal = false;
    let showTargetLocationModal = false;

    async function save() {
        const payload = Object.assign({}, delivery);
        payload.sourceLocationId = payload.sourceLocation ? payload.sourceLocation.id : null;
        payload.targetLocationId = payload.targetLocation ? payload.targetLocation.id : null;

        try {
            buttonState = "saving";

            const res = await fetchServer("landedcosts", {
                method: "POST",
                headers: { "Content-Type": "application/json", "Authorization": `Bearer ${data.authToken}` },
                body: JSON.stringify(payload)
            });
            
            const result = await res.json();
            if (res.status != 204) {
                if (result.isError) return errorMessage = result.responseException.exceptionMessage;
            }

            successMessage = "Delivery saved";
            goto("/deliveries/" + result.result);
        } catch (/** @type {*} */ error) {
            errorMessage = error;
        } finally {
            buttonState = "normal";
            setTimeout(() => successMessage = "", 5000);
            setTimeout(() => errorMessage = "", 5000);
        }
    }
</script>

{#if showSourceLocationModal}<SelectLocationModal on:handleLocationClick={event => {delivery.sourceLocation = event.detail.location; showSourceLocationModal = false;}} on:handleModalClose={() => showSourceLocationModal = false} authToken={data.authToken} />{/if}
{#if showTargetLocationModal}<SelectLocationModal on:handleLocationClick={event => {delivery.targetLocation = event.detail.location; showTargetLocationModal = false;}} on:handleModalClose={() => showTargetLocationModal = false} authToken={data.authToken} />{/if}

<div class="container-fluid">
    <button class="btn btn-secondary mt-3" on:click={() => history.back()}>Back</button>
    <h1 class="mt-3">New Delivery</h1>
    <div class="form-wrapper border-bottom pb-3">
        <DeliveryForm
            bind:delivery={delivery}
            on:rootSourceLocation={() => delivery.sourceLocation = null}
            on:rootTargetLocation={() => delivery.targetLocation = null}
            on:showSourceLocationModal={() => showSourceLocationModal = true}
            on:showTargetLocationModal={() => showTargetLocationModal = true}
        />
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