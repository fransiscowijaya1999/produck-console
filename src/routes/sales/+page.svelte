<script>
    import { fetchServer } from "$lib/fetch.js";
    import { displayMargin } from "$lib/marginCalculator";
    import { toStringDelimit } from "$lib/numbering";
    import { addMonths } from "date-fns";

    import Pagination from "$lib/Pagination.svelte";

    export let data;

    let listCurrentPage = 1;
    let startDate = null;
    let endDate = null;

    $: searchPromise = (searchKeyword)(startDate, endDate, listCurrentPage)

    async function searchKeyword(startDate = "", endDate = "", currentPage = 1) {
        const returnData = {
            payload: [],
            totalProfit: 0,
            pagination: {
                totalPages: 1,
                page: 1
            }
        };

        if (!startDate) startDate = new Date().toDateString();
        if (!endDate) endDate = addMonths(new Date(startDate), 1).toDateString();

        const res = await fetchServer(`sales?startDate=${startDate}&endDate=${endDate}&page=${currentPage}&pageSize=20`, {
            headers: { "Authorization": `Bearer ${data.authToken}`}
        });
        const result = await res.json();

        if (result.payload.sales) {
            returnData.payload = result.payload.sales;
            returnData.totalProfit = result.payload.totalProfit;
        }
        returnData.pagination = result.pagination;

        if (!result.payload && listCurrentPage > 1) listCurrentPage -= 1;

        return returnData;
    }
</script>

<div class="container-fluid p-3">
    <h1 class="content-title mb-3">Sales</h1>
    <div class="mb-3">
        <div class="row">
            <div class="col">
                <label for="start-date" class="form-label">Start Date</label>
                <input bind:value={startDate} type="date" id="date" class="form-control specific-w-150" required>
            </div>
            <div class="col">
                <label for="end-date" class="form-label">End Date</label>
                <input bind:value={endDate} type="date" id="date" class="form-control specific-w-150" required>
            </div>
        </div>
    </div>
    {#await searchPromise}
    <h3>Loading...</h3>
    {:then { payload, totalProfit, pagination }} 
        {#if payload.length > 0}
            <h3>Total Profit: <span class="text-secondary">{toStringDelimit(totalProfit)}</span></h3>
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