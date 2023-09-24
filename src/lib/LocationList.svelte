<script>
    import { goto } from "$app/navigation";
    import { createEventDispatcher } from "svelte";

    export let locations = [];
    const dispatch = createEventDispatcher();

    function deleteLocation(locationId) {
        dispatch("deleteLocation", { locationId });
    }

    function selectLocation(location) {
        dispatch("selectLocation", { location });
    }
</script>

{#if locations.length > 0}
    <table class="table table-hover">
        <thead>
            <tr>
                <th>Name</th>
            </tr>
        </thead>
        <tbody>
            {#each locations as location, i}
                <tr>
                    <th>
                        <button on:click={() => deleteLocation(location.id)} class="btn btn-sm btn-outline-danger me-1">x</button>
                        <button on:click={() => goto(`/inventory/${location.id}`)} class="btn btn-sm btn-secondary me-1">edit</button>
                        <a href="/inventory" on:click={() => selectLocation(location)}>{location.name}</a>
                    </th>
                </tr>
            {/each}
        </tbody>
    </table>
{:else if locations.length == 0}
    <h1 class="text-center mt-5 mb-5">No Location yet.</h1>
{:else}
    <h1 class="text-center mt-5 mb-5">Loading...</h1>
{/if}