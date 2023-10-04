<script>
    import { fetchServer } from "$lib/fetch.js";

    import DeliveryList from "$lib/DeliveryList.svelte";
    import Pagination from "$lib/Pagination.svelte";
    import { goto } from "$app/navigation";

    export let data;

    let keyword = "";
    let keywordTimer = 0;
    let listCurrentPage = 1;
    let showNotDelivered = false;

    $: searchPromise = (searchKeyword)(keyword, listCurrentPage, showNotDelivered)

    function keywordDebounce(event) {
        clearTimeout(keywordTimer);
        keywordTimer = setTimeout(() => keyword = event.target.value, 500);
    }

    async function searchKeyword(keyword = "", currentPage = 1, showNotDelivered = false) {
        const returnData = {
            payload: [],
            pagination: {
                totalPages: 1,
                page: 1
            }
        };

        let searchParams = "";
        if (showNotDelivered) searchParams += `&showNotDelivered=true`;

        const res = await fetchServer(`landedcosts?keyword=${keyword}${searchParams}&page=${currentPage}&pageSize=20`, {
            headers: { "Authorization": `Bearer ${data.authToken}`}
        });
        const result = await res.json();

        if (result.payload) {
            returnData.payload = result.payload;
            returnData.pagination = result.pagination;
        }

        if (!result.payload && listCurrentPage > 1) listCurrentPage -= 1;

        return returnData;
    }
</script>

<div class="container-fluid p-3">
    <h1 class="mb-3">Deliveries</h1>
    <button on:click={() => goto("/deliveries/create")} class="btn-lg btn btn-primary">Create</button>
    <div class="mt-3">
        <div class="d-flex gap-3">
            <input on:keyup={keywordDebounce} type="text" id="keyword" class="form-control specific-w-250 mb-3" placeholder="Search purchases">
            <div class="form-check form-switch">
                <input class="form-check-input" type="checkbox" role="switch" on:click={() => showNotDelivered = !showNotDelivered} id="show-not-delivered">
                <label class="form-check-label" for="show-not-delivered">
                  Not Delivered
                </label>
            </div>
        </div>
        {#await searchPromise}
            <h1>Loading...</h1>
        {:then { payload, pagination }}
            {#if payload.length > 0}
                <DeliveryList {payload} />
            {:else}
                <h3 class="text-center mt-5 mb-5">No delivery found.</h3>
            {/if}
            <Pagination
                on:nextPage={() => listCurrentPage += 1}
                on:prevPage={() => listCurrentPage -= 1}
                totalPages={pagination.totalPages}
                currentPage={pagination.page}
            />
        {/await}
    </div>
</div>