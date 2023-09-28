<script>
    import SelectLocationModal from '$lib/modals/SelectLocationModal.svelte';
    import LocationForm from '$lib/LocationForm.svelte';
    import { fetchServer } from '$lib/fetch.js';

    export let data;

    let location = data.payload;

    let showSelectLocationModal = false;
    let buttonState = "normal";
    let errorMessage = "";
    let successMessage = "";

    /** @param {*} event */
    function handleLocationClick(event) {
        showSelectLocationModal = false;
        location.parentLocation = event.detail.location;
    }
    function handleSelectLocationClick() {
        showSelectLocationModal = !showSelectLocationModal;
    }

    async function saveLocation() {
        try {
            buttonState = "saving";

            const parentLocationId = location.parentLocation ? location.parentLocation.id : null;
            const body = {
                name: location.name,
                locationId: parentLocationId
            }
            const res = await fetchServer(`locations/${location.id}`, {
                method: "PUT",
                headers: { "Content-Type": "application/json", "Authorization": `Bearer ${data.authToken}` },
                body: JSON.stringify(body)
            });

            if (res.status != 204) {
                const result = await res.json();
                if (result.isError) return errorMessage = result.responseException.exceptionMessage;
            }

            successMessage = "Location saved.";
        } catch (/** @type {*} */ error) {
            errorMessage = error;
        } finally {
            buttonState = "normal";
            setTimeout(() => successMessage = "", 5000);
            setTimeout(() => errorMessage = "", 5000);
        }
    }
</script>

{#if showSelectLocationModal}
    <SelectLocationModal authToken={data.authToken} excludeId={data.payload.id} on:handleModalClose={() => showSelectLocationModal = false} on:handleLocationClick={handleLocationClick} />
{/if}
<div class="container-fluid">
    <button class="btn btn-secondary mt-3" on:click={() => history.back()}>Back</button>
    <h1 class="mt-3">Edit Location</h1>
    <div class="form-wrapper specific-w-350">
        <LocationForm
            on:handleSelectLocationClick={handleSelectLocationClick}
            bind:location={location}
        />
        <button on:click={saveLocation} class="btn btn-primary btn-lg mt-3" class:disabled={buttonState == "saving"} type="button">
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