<script>
    import { goto } from "$app/navigation";
    import { fetchServer } from "$lib/fetch";
    
    import Pagination from "$lib/Pagination.svelte";
    import CustomerList from "$lib/CustomerList.svelte";

    export let data;

    let keyword = "";
    let keywordTimer = 0;
    let paginationCurrentPage = 1;

    $: customersPromise = (searchCustomers)(keyword, paginationCurrentPage);

    function keywordDebounce(event) {
        clearTimeout(keywordTimer);
        keywordTimer = setTimeout(() => keyword = event.target.value, 500);
    }

    async function searchCustomers(keyword = "", currentPage = 1) {
        const returnData = {
            payload: [],
            pagination: {
                page: 1,
                totalPages: 1
            }
        };

        let searchParams = "";

        const res = await fetchServer(`customers?keyword=${keyword}${searchParams}&page=${currentPage}`, {
            headers: { "Authorization": `Bearer ${data.authToken}`}
        });
        const result = await res.json();
        
        if (result.payload) returnData.payload = result.payload;
        returnData.pagination = result.pagination;
        
        return returnData;
    }
</script>

<div class="container-fluid p-3">
    <h1 class="mb-3">Customers</h1>
    <button on:click={() => goto("/customers/create")} class="btn-lg btn btn-primary">Create</button>
    <div class="mt-3">
        <input on:keyup={keywordDebounce} type="text" id="keyword" class="form-control specific-w-250 mb-3" placeholder="Search customers">
        {#await customersPromise}
            <h1>Loading...</h1>
        {:then { payload, pagination }}
            {#if payload.length > 0}
                <CustomerList {payload} />
            {:else}
                <h3 class="text-center mt-5 mb-5">No customer found.</h3>
            {/if}
            <Pagination
                on:nextPage={() => paginationCurrentPage += 1}
                on:prevPage={() => paginationCurrentPage -= 1}
                totalPages={pagination.totalPages}
                currentPage={pagination.page}
            />
        {/await}
    </div>
</div>