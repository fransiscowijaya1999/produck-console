<script>
    import { fetchServer } from "$lib/fetch";

    import LocationForm from "$lib/LocationForm.svelte";
    import SelectLocationModal from "$lib/modals/SelectLocationModal.svelte";

    export let data;

    let locationRaw = {
        name: "",
        parentLocation: data ? data.payload : null
    }
    let buttonState = "normal";
    let errorMessage = "";
    let successMessage = "";

    let showSelectLocationModal = false;

    let location = Object.assign({}, locationRaw);

    async function saveLocation() {
        try {
            buttonState = "saving";

            const resBody = {
                name: location.name,
                locationId: location.parentLocation ? location.parentLocation.id : null
            };

            const res = await fetchServer("locations", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(resBody)
            });

            const result = await res.json();

            if (result.isError) return errorMessage = result.responseException.exceptionMessage;

            successMessage = "Location saved.";
            location = Object.assign({}, locationRaw);
        } catch (/** @type {*} */ error) {
            errorMessage = error;
        } finally {
            buttonState = "normal";
            setTimeout(() => successMessage = "", 5000);
            setTimeout(() => errorMessage = "", 5000);
        }
    }

    function handleLocationClick(event) {
        location.parentLocation = event.detail.location;
        showSelectLocationModal = false;
    }
</script>

{#if showSelectLocationModal}
    <SelectLocationModal on:handleModalClose={() => showSelectLocationModal = false} on:handleLocationClick={handleLocationClick} />
{/if}

<div class="container-fluid">
    <button class="btn btn-secondary mt-3" on:click={() => history.back()}>Back</button>
    <h1 class="mt-3">New Location</h1>
    <div class="form-wrapper specific-w-350">
        <LocationForm
            on:handleSelectLocationClick={() => showSelectLocationModal = true}
            bind:location={location} />
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