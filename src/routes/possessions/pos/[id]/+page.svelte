<script>
    import { fetchServer } from "$lib/fetch";
    
    import Pagination from "$lib/Pagination.svelte";
    import PosSessionList from "$lib/PosSessionList.svelte";

    export let data;

    let pos = data.payload;

    let keyword = "";
    let listCurrentPage = 1;
    let startDate = null;
    let endDate = null;

    $: posPromise = (searchKeyword)(keyword, listCurrentPage, startDate, endDate);

    async function searchKeyword(keyword = "", currentPage = 1, startDate = null, endDate = null) {
        const returnData = {
            payload: [],
            pagination: {
                totalPages: 1,
                page: 1
            }
        };

        let searchParams = "";
        if (startDate) searchParams += `&startDate=${startDate}`;
        if (endDate) searchParams += `&endDate=${endDate}`;

        const res = await fetchServer(`possessions/?keyword=${keyword}${searchParams}&posId=${pos.id}&page=${currentPage}`);
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
    <h1 class="mb-3">Sessions: <span class="text-secondary">{pos.name}</span></h1>
    <div class="mt-3">
        {#await posPromise}
            <h1>Loading...</h1>
        {:then { payload, pagination }}
            {#if payload.length > 0}
                <PosSessionList payload={payload} />
            {:else}
                <h3 class="text-center mt-5 mb-5">No session found.</h3>
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