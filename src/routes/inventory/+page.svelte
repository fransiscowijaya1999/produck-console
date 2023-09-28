<script>
    import { goto } from "$app/navigation";
    import { fetchServer } from "$lib/fetch";
    import LocationList from "$lib/LocationList.svelte";

    import Pagination from "$lib/Pagination.svelte";

    export let data;

    const authHeader = { "Authorization": `Bearer ${data.authToken}` };

    let locationsSearchInputElement;
    /** @type {number | undefined} */
    let locationsSearchInputTimer;
    let locationsSearchInputValue = "";
    let locationsCurrentPage = 1;

    /** @type {string | any[]} */
    let selectedLocations = [];

    $: lastSelectedLocationId = selectedLocations.length > 0 ? selectedLocations[selectedLocations.length - 1].id : null;
    $: locationsPromise = (searchLocations)(locationsSearchInputValue, lastSelectedLocationId, locationsCurrentPage);

    function handleBreadcrumbClick(index) {
        selectedLocations.splice(index + 1, selectedLocations.length - (index + 1));
        selectedLocations = selectedLocations;
    }

    async function deleteLocation(event) {
        const { locationId } = event.detail;
        
        await fetchServer(`locations/${locationId}`, {
            method: "DELETE",
            headers: authHeader
        });

        locationsPromise = (searchLocations)(locationsSearchInputValue, lastSelectedLocationId, locationsCurrentPage);
    }

    function selectLocation(event) {
        const { location } = event.detail;
        selectedLocations = [...selectedLocations, location];

        locationsSearchInputElement.value = "";
        locationsSearchInputValue = "";
        locationsCurrentPage = 1;
    }

    function handleLocationsSearchInputKeyup(event) {
        clearTimeout(locationsSearchInputTimer);
        locationsSearchInputTimer = setTimeout(() => locationsSearchInputValue = event.target.value, 500);
    }

    async function searchLocations(keyword = "", parentLocationId = "", currentPage = 1) {
        const returnData = {
            locations: [],
            pagination: {
                totalPages: 1,
                page: 1
            }
        };

        let searchParams = "";
        if (parentLocationId) searchParams += `&parentId=${parentLocationId}`;
        if (!parentLocationId) searchParams += `&showOnlyRootChilds=true`;

        const res = await fetchServer(`locations?keyword=${keyword}${searchParams}&page=${currentPage}`, {
            headers: authHeader
        });
        const result = await res.json();


        if (result.payload) {
            returnData.locations = result.payload;
            returnData.pagination = result.pagination;
        }

        if (!result.payload && locationsCurrentPage > 1) locationsCurrentPage -= 1;

        return returnData;
    }
</script>

<div class="container-fluid p-3">
    <h1 class="mb-3">Inventory</h1>
    <div class="d-flex gap-2">
        <button class="btn btn-primary btn-lg" on:click={() => goto(`/inventory/create/${lastSelectedLocationId}`)}>Create</button>
        <button class="btn btn-secondary btn-lg" on:click={() => goto(`/inventory/stocks/${lastSelectedLocationId}`)}>📦 Products</button>
    </div>
    <nav class="mt-3" aria-label="Breadcrumb navigation example">
        <ol class="breadcrumb">
            <li class="breadcrumb-item">
                {#if selectedLocations.length == 0}
                    root
                {:else}
                    <a on:click={() => selectedLocations = []} href="/inventory">root</a>
                {/if}
            </li>
            {#each selectedLocations as location, i}
                <li class="breadcrumb-item active" class:active={i == selectedLocations.length - 1}>
                    {#if i == selectedLocations.length - 1}
                        {location.name}
                    {:else}
                        <a on:click={() => handleBreadcrumbClick(i)} href="/inventory">{location.name}</a>
                    {/if}
                </li>
            {/each}
        </ol>
    </nav>
    <input bind:this={locationsSearchInputElement} on:keyup={handleLocationsSearchInputKeyup} type="text" class="form-control mr-10 specific-w-250" placeholder="Search locations">
    <div class="mt-3">
        {#await locationsPromise}
            <h1>Loading...</h1>
        {:then { locations, pagination }}
            <LocationList on:deleteLocation={deleteLocation} on:selectLocation={selectLocation} {locations} />
            {#if locations.length > 0}
                <Pagination
                    on:prevPage={() => locationsCurrentPage -= 1}
                    on:nextPage={() => locationsCurrentPage += 1}
                    totalPages={pagination.totalPages}
                    currentPage={pagination.page}
                />
            {/if}
        {/await}
    </div>
</div>