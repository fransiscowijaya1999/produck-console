<script>
    import { fetchServer } from "$lib/fetch";
    import { createEventDispatcher } from "svelte";

    import Pagination from "$lib/Pagination.svelte";
    
    /** @type {number | null} */
    export let excludeId = null;
    export let productIdToExclude = null;

    const dispatch = createEventDispatcher();

    let selectedLocations = [];
    /** @type {number} */
    let locationsSearchTimer;
    /** @type {string} */
    let locationsSearchInputValue = "";
    let locationsCurrentPage = 1;

    $: lastSelectedLocationId = selectedLocations.length > 0 ? selectedLocations[selectedLocations.length - 1].id : null;
    $: locationsPromise = (searchLocation)(locationsSearchInputValue, lastSelectedLocationId, locationsCurrentPage, excludeId, productIdToExclude);

    function handleBreadcrumbClick(index) {
        selectedLocations.splice(index + 1, selectedLocations.length - (index + 1));
        selectedLocations = selectedLocations;
    }

    /** @param {*} event */
    const searchLocationsDebounce = (event = { target: { value: "" } }) => {
        clearTimeout(locationsSearchTimer);
        locationsSearchTimer = setTimeout(() => {
            locationsSearchInputValue = event.target.value;
            locationsCurrentPage = 1;
        }, 500);
    }

    /** @param {*} location */
    function handleLocationClick(location) {
        dispatch("handleLocationClick", { location });
    }

    async function searchLocation(keyword = "", parentId = null, currentPage = 1, exclude = null, idToExclude = null) {
        const returnData = {
            locations: [],
            pagination: {
                totalPages: 1,
                page: 1,
                pageSize: 10
            }
        };

        let searchParams = "";

        if (parentId) searchParams += `&parentId=${parentId}`;
        if (exclude) searchParams += `&exclude=${exclude}`;
        if (idToExclude) searchParams += `&productIdToExclude=${idToExclude}`;

        const res = await fetchServer(`locations/?keyword=${keyword}${searchParams}&page=${currentPage}`);
        const result = await res.json();

        if (result.payload) {   
            returnData.locations = result.payload;
            returnData.pagination = result.pagination;
        }

        if (!result.payload && locationsCurrentPage > 1) locationsCurrentPage -= 1;

        return returnData;
    }
</script>

<div class="modal" style="z-index: 9999;">
    <div class="modal-dialog">
        <div class="modal-content">
            <div class="modal-header">
                <h1 class="modal-title fs-5">Select Location</h1>
                <button on:click={() => dispatch("handleModalClose")} type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
            </div>
            <div class="modal-body">
                <nav class="mt-3" aria-label="Locations Breadcrumb">
                    <ol class="breadcrumb">
                        <li class="breadcrumb-item" class:active={selectedLocations.length == 0}>
                            {#if selectedLocations.length == 0}
                                root
                            {:else}
                                <a href="#top" on:click={() => selectedLocations = []}>root</a>
                            {/if}
                        </li>
                        {#each selectedLocations as selectedLocation, i}
                            {#if i == selectedLocations.length - 1}
                                <li class="breadcrumb-item active" aria-current="page">{selectedLocation.name}</li>
                            {:else}
                                <li class="breadcrumb-item"><a on:click={() => handleBreadcrumbClick(i)} href="#top">{selectedLocation.name}</a></li>
                            {/if}
                        {/each}
                    </ol>
                </nav>
                <input on:keyup={searchLocationsDebounce} type="text" id="locations-search" class="form-control">
                {#await locationsPromise}
                    <p>Loading...</p>
                {:then { locations, pagination }}
                    {#if locations.length > 0}
                        <div class="list-group mt-3 mb-2">
                            {#each locations as location}
                                <a href="#top" class="list-group-item list-group-item-action">
                                    <button on:click={() => selectedLocations = [...selectedLocations, location]} class="btn btn-sm btn-secondary">Step In</button>
                                    <button on:click={() => handleLocationClick(location)} class="btn btn-sm btn-outline-primary">Select</button>
                                    <span class="ms-2">{location.name}</span>
                                </a>
                            {/each}
                        </div>
                        <Pagination
                            on:prevPage={() => locationsCurrentPage -= 1}
                            on:nextPage={() => locationsCurrentPage += 1}
                            totalPages={pagination.totalPages}
                            currentPage={pagination.page}
                        />
                    {/if}
                {:catch error}
                    <p>{error}</p>
                {/await}
            </div>
        </div>
    </div>
</div>

<style>
    @import "./style.css";
</style>