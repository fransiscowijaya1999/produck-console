<script>
    import { fetchServer } from "$lib/fetch";
    import { createEventDispatcher } from "svelte";
    import { format } from "date-fns";

    import Pagination from "$lib/Pagination.svelte";
    import { toStringDelimit } from "$lib/numbering";

    function simpleDateTime(date) {
        return format(new Date(date), "dd MMM yyyy");
    }

    export let authToken = "";

    const dispatch = createEventDispatcher();

    /** @type {number} */
    let keywordTimer;
    /** @type {string} */
    let keyword = "";
    let listCurrentPage = 1;
    let showNotDelivered = false;

    /** @param {*} event */
    const keywordDebounce = (event = { target: { value: "" } }) => {
        clearTimeout(keywordTimer);
        keywordTimer = setTimeout(() => {
            keyword = event.target.value;
            listCurrentPage = 1;
        }, 500);
    }

    /** @param {*} item */
    function handleItemClick(item) {
        dispatch("handleItemClick", { item });
        dispatch("handleModalClose");
    }

    $: searchPromise = (searchKeyword)(keyword, listCurrentPage, showNotDelivered);

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

        const res = await fetchServer(`purchases?keyword=${keyword}${searchParams}&page=${currentPage}&pageSize=20`, {
            headers: { "Authorization": `Bearer ${authToken}`}
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

<div class="modal" style="z-index: 9999;">
    <div class="modal-dialog" style="max-width: 90vw; width: 90vw; max-height: 75vh;">
        <div class="modal-content">
            <div class="modal-header">
                <h1 class="modal-title fs-5">Select Purchase</h1>
                <button on:click={() => dispatch("handleModalClose")} type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
            </div>
            <div class="modal-body">
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
                        <table class="table table-hover">
                            <thead>
                                <tr>
                                    <th>Date</th>
                                    <th>Vendor</th>
                                    <th>Source Document</th>
                                    <th>Total Cost</th>
                                    <th>Delivery</th>
                                </tr>
                            </thead>
                            <tbody>
                                {#each payload as data, i}
                                    <tr>
                                        <th>
                                            <a class="link-secondary link-underline-opacity-0" href="#top" on:click={() => handleItemClick(data)}>{simpleDateTime(data.date)}</a>
                                        </th>
                                        <td>{data.vendor.name}</td>
                                        <td>{data.sourceDocument ?? ""}</td>
                                        <td>{data.totalCost ? toStringDelimit(data.totalCost) : ""}</td>
                                        <td>
                                            {#if data.allDelivered}
                                                <span class="badge text-bg-success">All delivered</span>
                                            {:else}
                                                <span class="badge text-bg-warning">Not yet delivered</span>
                                            {/if}
                                        </td>
                                    </tr>
                                {/each}
                            </tbody>
                        </table>
                    {:else}
                        <h3 class="text-center mt-5 mb-5">No purchases found.</h3>
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
    </div>
</div>

<style>
    @import "./style.css";
</style>