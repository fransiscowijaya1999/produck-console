<script>
    import { format } from "date-fns";

    import { fetchServer } from "$lib/fetch.js";
    import { toStringDelimit } from "$lib/numbering.js";

    import OrderItemList from "$lib/OrderItemList.svelte";
    import Pagination from "$lib/Pagination.svelte";

    export let data;

    let order = data.payload;

    let keyword = "";
    let keywordTimer = 0;
    let listCurrentPage = 1;

    $: searchPromise = (searchKeyword)(keyword, listCurrentPage)

    function keywordDebounce(event) {
        clearTimeout(keywordTimer);
        keywordTimer = setTimeout(() => keyword = event.target.value, 500);
    }

    async function searchKeyword(keyword = "", currentPage = 1) {
        const returnData = {
            payload: [],
            pagination: {
                totalPages: 1,
                page: 1
            }
        };

        const res = await fetchServer(`orderitems/orders/${order.id}?keyword=${keyword}&page=${currentPage}&pageSize=20`, {
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

    function simpleDateTime(datetime) {
        return format(new Date(datetime), "dd MMM yyyy '-' hh:mm a");
    }
</script>

<div class="container-fluid p-3">
    <h1 class="mb-3">Order Details</h1>
    <div class="mt-3">
        <div class="card mb-3">
            <div class="card-body">
                <h5 class="card-title">
                    {#if order.hasReturn}
                        <span class="badge text-bg-danger">has return</span>
                    {/if}
                    {simpleDateTime(order.createdAt)}
                </h5>
                <div class="card-text">
                    <strong>Total Price</strong>: {toStringDelimit(order.totalPrice)}<br>
                    <strong>Total Cost</strong>: {toStringDelimit(order.totalCost)}<br>
                    <strong>Served by</strong>: {order.servedBy.username}
                </div>
            </div>
        </div>
        <input on:keyup={keywordDebounce} type="text" id="keyword" class="form-control specific-w-250 mb-3" placeholder="Search point of sale">
        {#await searchPromise}
            <h1>Loading...</h1>
        {:then { payload, pagination }}
            {#if payload.length > 0}
                <OrderItemList {payload} />
                <Pagination
                    on:nextPage={() => listCurrentPage += 1}
                    on:prevPage={() => listCurrentPage -= 1}
                    totalPages={pagination.totalPages}
                    currentPage={pagination.page}
                />
            {:else}
                <h3 class="text-center mt-5 mb-5">No order item found.</h3>
            {/if}
        {/await}
    </div>
</div>