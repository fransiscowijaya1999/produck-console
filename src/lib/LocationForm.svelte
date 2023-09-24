<script>
    import { createEventDispatcher } from "svelte";

    export let location = {
        name: "",
        parentLocation: null
    };

    const dispatch = createEventDispatcher();

    function handleResetLocationClick() {
        location.parentLocation = null;
    }

    function handleSelectLocationClick() {
        dispatch("handleSelectLocationClick");
    }
</script>

<div class="mb-3">
    <label for="location-name" class="form-label">Name</label>
    <input bind:value={location.name} type="text" id="location-name" class="form-control" required>
</div>
<div class="mb-3">
    <label for="parent-location" class="form-label">Parent Location</label>
    <div class="input-group">
        <button on:click={handleSelectLocationClick} class="btn btn-secondary">{location.parentLocation ? location.parentLocation.name : "Select Location"}</button>
        <button on:click={handleResetLocationClick} class="btn btn-danger">Reset</button>
    </div>
</div>