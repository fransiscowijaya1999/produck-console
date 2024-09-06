<script>
    import { fetchServer } from "$lib/fetch.js";
    import { displayMargin } from "$lib/marginCalculator";
    import { toStringDelimit } from "$lib/numbering";

    import Pagination from "$lib/Pagination.svelte";

    /** @type {import('./$types').PageData} */
    export let data;

    let listCurrentPage = 1;
    let keyword = "";

    $: searchPromise = (searchKeyword)(keyword, listCurrentPage)

    async function searchKeyword(keyword = "", currentPage = 1) {
        const returnData = {
            payload: [],
            pagination: {
                totalPages: 1,
                page: 1
            }
        };

        const res = await fetchServer(`sales/session/${data.payload.id}?keyword=${keyword}&page=${currentPage}&pageSize=20`, {
            headers: { "Authorization": `Bearer ${data.authToken}`}
        });
        const result = await res.json();

        if (result.payload) {
            returnData.payload = result.payload;
        }
        returnData.pagination = result.pagination;

        if (!result.payload && listCurrentPage > 1) listCurrentPage -= 1;

        return returnData;
    }
</script>

<div class="container-fluid p-3">
    <h1 class="content-title mb-3">Sales</h1>
    <div class="mb-3">
        <input bind:value={keyword} id="keyword" class="form-control specific-w-150">
    </div>
    {#await searchPromise}
    <h3>Loading...</h3>
    {:then { payload, pagination }} 
        {#if payload.length > 0}
            <table class="table table-hover">
                <thead>
                    <tr>
                        <th>Product</th>
                        <th>Total Sales</th>
                        <th>Total Cost</th>
                        <th>Profits / Margin</th>
                        <th>Total Sold</th>
                    </tr>
                </thead>
                <tbody>
                    {#each payload as product, i}
                        <tr>
                            <th><a href="/products/{product.productId.toString()}">{product.productName}</a></th>
                            <th>{toStringDelimit(product.totalSalePrice)}</th>
                            <th>{toStringDelimit(product.totalSaleCost)}</th>
                            <th>{toStringDelimit(product.totalSalePrice - product.totalSaleCost)} / {@html displayMargin(product.totalSalePrice, product.totalSaleCost)}</th>
                            <th>{toStringDelimit(product.totalSold)}</th>
                        </tr>
                    {/each}
                </tbody>
            </table>
            <Pagination
                on:nextPage={() => listCurrentPage += 1}
                on:prevPage={() => listCurrentPage -= 1}
                totalPages={pagination.totalPages}
                currentPage={pagination.page}
            />
        {:else if payload.length == 0}
            <h1 class="text-center mt-5 mb-5">No sale found.</h1>
        {:else}
            <h1 class="text-center mt-5 mb-5">Loading...</h1>
        {/if}
    {/await}
</div>
