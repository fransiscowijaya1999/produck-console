<script>
    import { format } from "date-fns";

    import { fetchServer } from "$lib/fetch.js";
    import { toStringDelimit } from "$lib/numbering.js";

    import OrderList from "$lib/OrderList.svelte";
    import Pagination from "$lib/Pagination.svelte";

    export let data;

    let session = data.payload;

    let listCurrentPage = 1;

    $: ordersPromise = (searchKeyword)(listCurrentPage)

    async function searchKeyword(currentPage = 1) {
        const returnData = {
            payload: [],
            pagination: {
                totalPages: 1,
                page: 1
            }
        };

        const res = await fetchServer(`orders/possessions/${session.id}?page=${currentPage}&pageSize=20`, {
            headers: { "Authorization": `Bearer ${data.authToken}` }
        });
        const result = await res.json();

        if (result.payload) {
            returnData.payload = result.payload;
            returnData.pagination = result.pagination;
        }

        if (!result.payload && listCurrentPage > 1) listCurrentPage -= 1;

        return returnData;
    }

    function simpleDateTime(datetime) {
        return format(new Date(datetime), "dd MMM yyyy '-' hh:mm a");
    }
</script>

<div class="container-fluid p-3">
    <h1 class="mb-3">Orders: <span class="text-secondary">{session.pos.name}</span></h1>
    <div class="mt-3">
        <div class="card mb-3">
            <div class="card-body">
                <h5 class="card-title">Session Information</h5>
                <div class="vstack gap-2 border-top">
                    <div class="border-bottom pb-2 pt-2">
                        <strong>Session Opener</strong>: {session.sessionOpener.username}<br>
                    </div>
                    <div class="border-bottom pb-2">
                        <strong>Opened At</strong>: {simpleDateTime(session.openedAt)}<br>
                        <strong>Opening Balance</strong>: {toStringDelimit(session.openingBalance)}<br>
                        <strong>Closed At</strong>: {session.closedAt ? simpleDateTime(session.closedAt) : "Not yet closed."}<br>
                        <strong>Closing Balance</strong>: {toStringDelimit(session.closingBalance)}<br>
                    </div>
                    <div class="border-bottom pb-2">
                        <strong>Orders Count</strong>: {toStringDelimit(session.orderCount)}<br>
                        <strong>Total Sales</strong>: {toStringDelimit(session.totalSalesPrice)}<br>
                        <strong>Total Cost</strong>: {toStringDelimit(session.totalSalesCost)}
                    </div>
                    {#if session.closingRemark}
                        <div class="border-bottom pb-2">
                            <h6>Closing Remark</h6>
                            {session.closingRemark}
                        </div>
                    {/if}
                </div>
                <div class="card-text">
                </div>
            </div>
        </div>
        {#await ordersPromise}
            <h1>Loading...</h1>
        {:then { payload, pagination }}
            {#if payload.length > 0}
                <OrderList {payload} />
                <Pagination
                    on:nextPage={() => listCurrentPage += 1}
                    on:prevPage={() => listCurrentPage -= 1}
                    totalPages={pagination.totalPages}
                    currentPage={pagination.page}
                />
            {:else}
                <h3 class="text-center mt-5 mb-5">No order found.</h3>
            {/if}
        {/await}
    </div>
</div>