<script>
    import { fetchServer } from "$lib/fetch";
    import { createEventDispatcher } from "svelte";

    import SelectPurchaseModal from "./SelectPurchaseModal.svelte";
    import Pagination from "$lib/Pagination.svelte";
    import { toStringDelimit } from "$lib/numbering";

    export let authToken = "";

    const dispatch = createEventDispatcher();

    /** @type {number} */
    let keywordTimer;
    /** @type {string} */
    let keyword = "";
    let listCurrentPage = 1;

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

    let purchase = null;
    let showSelectPurchaseModal = false;

    $: searchPromise = (search)(purchase ? purchase.id : null, listCurrentPage);

    async function search(purchaseId = purchase.id, currentPage = 1) {
        const returnData = {
            payload: [],
            pagination: {
                totalPages: 1,
                page: 1
            }
        };

        if (purchaseId == null) return returnData;

        const res = await fetchServer(`purchaseorders/purchases/${purchaseId}?page=${currentPage}&pageSize=50`, {
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

{#if showSelectPurchaseModal}<SelectPurchaseModal on:handleItemClick={(event) => purchase = event.detail.item} on:handleModalClose={() => showSelectPurchaseModal = false} {authToken} />{/if}

<div class="modal" style="z-index: 999;">
    <div class="modal-dialog" style="max-width: 90vw; width: 90vw;">
        <div class="modal-content">
            <div class="modal-header">
                <h1 class="modal-title fs-5">Select Purchase Order</h1>
                <button on:click={() => dispatch("handleModalClose")} type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
            </div>
            <div class="modal-body">
                <button on:click={() => showSelectPurchaseModal = true} type="button" class="btn btn-secondary d-block w-100">{"Select Purchase"}</button>
                <!-- <input on:keyup={keywordDebounce} type="text" id="keyword-search" class="form-control"> -->
                {#await searchPromise}
                    <h3>Loading...</h3>
                {:then { payload, pagination }}
                    {#if payload.length > 0}
                        <table class="table table-hover mb-3">
                            <thead>
                                <tr>
                                    <th>Description</th>
                                    <th>Qty / Delivered</th>
                                    <th>Cost</th>
                                </tr>
                            </thead>
                            <tbody>
                                {#each payload as item}
                                    <tr>
                                        <th>
                                            <a class="link-secondary link-underline-opacity-0" href="#top" on:click={() => handleItemClick(item)}>{item.description}</a>
                                        </th>
                                        <td>
                                            <strong>{toStringDelimit(item.quantity)}</strong>
                                            /
                                            {#if item.delivered >= item.quantity}
                                                <span class="badge text-bg-success">{toStringDelimit(item.delivered)}</span>
                                            {:else}
                                                <span class="badge text-bg-warning">{toStringDelimit(item.delivered)}</span>
                                            {/if}
                                        </td>
                                        <td>{toStringDelimit(item.cost)}</td>
                                    </tr>
                                {/each}
                            </tbody>
                        </table>
                        <Pagination
                            on:prevPage={() => listCurrentPage -= 1}
                            on:nextPage={() => listCurrentPage += 1}
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