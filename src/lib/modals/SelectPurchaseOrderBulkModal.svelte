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

    /** @type {* | null} */
    let purchase = null;
    let showSelectPurchaseModal = false;

    let selectedItems = [];

    $: searchPromise = (search)(purchase ? purchase.id : null, listCurrentPage);

    function handleCheckboxAllChange(event, items) {
        if (selectedItems.length < items.length) {
            selectedItems = [...items];
        } else {
            selectedItems = [];
        }
    }

    function handleCheckboxChange(item) {
        if (selectedItems.includes(item)) {
            const deletedItems = [...selectedItems];
            const deleteIndex = deletedItems.findIndex((i) => i.id === item.id);
            deletedItems.splice(deleteIndex, 1);

            selectedItems = [...deletedItems];
        } else {
            selectedItems = [...selectedItems, item];
        }
    }

    function handleSelectItems() {
        dispatch("selectItems", { items: selectedItems });
        dispatch("handleModalClose");
    }

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
    <div class="modal-dialog" style="max-width: 90vw; width: 90vw; max-height: 75vh;">
        <div class="modal-content">
            <div class="modal-header">
                <h1 class="modal-title fs-5">Select Purchase Order</h1>
                <button on:click={() => dispatch("handleModalClose")} type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
            </div>
            <div class="modal-body">
                <div class="row">
                    <div class="col">
                        <button on:click={() => showSelectPurchaseModal = true} type="button" class="btn btn-secondary d-block w-100">{"Select Purchase"}</button>
                    </div>
                    <div class="col-auto">
                        <button on:click={handleSelectItems} type="button" class="btn btn-primary" disabled={purchase === null}>Select Items</button>
                    </div>
                </div>
                {#await searchPromise}
                    <h3>Loading...</h3>
                {:then { payload, pagination }}
                    {#if payload.length > 0}
                        <table class="table table-hover mb-3">
                            <thead>
                                <tr>
                                    <th>
                                        <input
                                            checked={selectedItems.length == payload.length}
                                            on:click={(event) => handleCheckboxAllChange(event, payload)}
                                            type="checkbox" name="selectAll" id="selectAll">
                                    </th>
                                    <th>Description</th>
                                    <th>Qty / Delivered</th>
                                    <th>Cost</th>
                                </tr>
                            </thead>
                            <tbody>
                                {#each payload as item}
                                    <tr>
                                        <th>
                                            <input
                                                checked={selectedItems.includes(item)}
                                                on:click={() => handleCheckboxChange(item)}
                                                type="checkbox" name="select-{item.id}" id="select-{item.id}">
                                        </th>
                                        <td>
                                            <a class="link-secondary link-underline-opacity-0" href="#top" on:click={() => handleItemClick(item)}>{item.description}</a>
                                        </td>
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