<script>
    import { createEventDispatcher } from "svelte";
    import { toStringDelimit } from "./numbering";
    import { fetchServer } from "./fetch";
    import SelectPurchaseOrderModal from "./modals/SelectPurchaseOrderModal.svelte";

    const dispatch = createEventDispatcher();

    export let payload = [];
    export let authToken = "";

    let errorMessage = "";
    let newItemRaw = {
        purchaseOrder: null,
        cost: null,
        qty: null
    };
    let newItem = Object.assign({}, newItemRaw);
    let isBulk = false;
    let showSelectPurchaseOrderModal = false;

    let keyword = "";
    let editedItem = null;
    let bulkAddItem = null;

    let costInput;
    let qtyInput;

    $: (search)(keyword);

    async function search(keyword = "") {
        const res = await fetchServer(`products?keyword=${keyword}&pageSize=5`, {
            headers: {
                "Authorization": `Bearer ${authToken}`
            }
        });
        const result = await res.json();

        const returnData = {
            products: [],
            pagination: {
                totalPages: 1,
                page: 1,
                pageSize: 10
            }
        };

        if (result.payload) {
            returnData.products = result.payload;
            returnData.pagination = result.pagination;
        }

        return returnData;
    }
    function handleNewItemCostKeyup(event) {
        if (event.key == "Enter") {
            save();
        }
    }
    function handleNewItemQtyKeyup(event) {
        if (event.key == "Enter") {
            costInput.focus();
        }
    }

    function isBulkChange() {
        newItem.purchaseOrder = null;
        newItem.cost = null;
    }

    function handleEditItemInputKeyup(event) {
        if (event.key == "Escape") editedItem = null;
    }

    function handleItemClick(index) {
        editedItem = index;
    }
    function handleEditItemCostKeyup(event) {
        handleEditItemInputKeyup(event);
        if (event.key == "Enter") {
            update();
        }
    }
    function handleEditItemQtyKeyup(event) {
        handleEditItemInputKeyup(event);
        if (event.key == "Enter") {
            costInput.focus();
        }
    }
    function handleNewChildQtyKeyup(event) {
        handleEditItemInputKeyup(event);
        if (event.key == "Enter") {
            newItem.landedCostItemId = payload[bulkAddItem].id;
            newItem.cost = 0;
            save();
        }
    }

    function save() {
        if (!newItem.purchaseOrder && !isBulk) { errorMessage = "Purchase Order is required."; return setTimeout(() => errorMessage = "", 5000); }
        if (!newItem.purchaseOrder) newItem.qty = 0;
        dispatch("save", { deliveryOrder: Object.assign({}, newItem) });

        newItem = Object.assign({}, newItemRaw);
        resetForm();
    }

    function update() {
        dispatch("update", { deliveryOrder: Object.assign({}, payload[editedItem]) });

        resetForm();
    }

    function resetForm() {
        keyword = "";
        editedItem = null;
    }
</script>

{#if showSelectPurchaseOrderModal}<SelectPurchaseOrderModal on:handleItemClick={event => newItem.purchaseOrder = event.detail.item} {authToken} on:handleModalClose={() => showSelectPurchaseOrderModal = false} />{/if}

<table class="table table-hover">
    <thead>
        <tr>
            <th>Purchase Order</th>
            <th>Qty</th>
            <th>Cost</th>
            <th>Bulk</th>
        </tr>
    </thead>
    <tbody>
        {#each payload as data, i}
            {#if editedItem == i}
                <tr>
                    {#if data.purchaseOrder}
                        <td><button type="button" class="btn btn-secondary">{data.purchaseOrder.description ?? "No description"}</button></td>
                        <td class="specific-w-150"><input bind:this={qtyInput} on:keyup={handleEditItemQtyKeyup} type="number" id="qty" class="form-control" bind:value={data.qty} placeholder="Qty"></td>
                    {:else}
                        <td>Bulk</td>
                        <td></td>
                    {/if}
                    <td class="specific-w-150"><input bind:this={costInput} on:keyup={handleEditItemCostKeyup} type="number" id="cost" class="form-control" bind:value={data.cost} placeholder="Cost"></td>
                    <td class="specific-w-50"></td>
                </tr>
            {:else}
                <tr on:click={() => {if(data.purchaseOrder) handleItemClick(i)}}>
                    <td>
                        {#if data.purchaseOrder}
                            {data.purchaseOrder.description ?? "No description"}
                        {:else}
                            Bulk
                        {/if}
                    </td>
                    <td>{#if data.purchaseOrder}{toStringDelimit(data.qty)}{/if}</td>
                    <td>{#if data.purchaseOrder}{toStringDelimit(data.cost)}
                        {:else}
                            <strong><a on:click={() => handleItemClick(i)} href="#top" class="link-secondary link-underline-opacity-0">{toStringDelimit(data.cost)}</a></strong>
                        {/if}</td>
                    <td>
                        <div class="btn-group">
                            {#if !data.purchaseOrder}
                                <button on:click={() => bulkAddItem = i} type="button" class="btn btn-primary btn-sm">add</button>
                            {/if}
                            <button type="button" class="btn btn-danger btn-sm" on:click={dispatch("delete", { id: payload[i].id })}>delete</button>
                        </div>
                    </td>
                </tr>
                {#if bulkAddItem == i}
                    <tr>
                        <td>
                            <span class="badge text-bg-primary">child</span>
                            <button on:click={() => showSelectPurchaseOrderModal = true} type="button" class="btn btn-secondary">{newItem.purchaseOrder ? newItem.purchaseOrder.description : "Select Purchase Order"}</button>
                        </td>
                        <td class="specific-w-150"><input bind:this={qtyInput} on:keyup={handleNewChildQtyKeyup} type="number" id="qty" class="form-control" bind:value={newItem.qty} placeholder="Qty"></td>
                        <td class="specific-w-150"></td>
                        <td class="specific-w-50">
                        </td>
                    </tr>
                {/if}
                {#if data.children}
                    {#each data.children as child}
                        {#if editedItem == i}
                            <tr>
                                <td><button type="button" class="btn btn-secondary">{child.purchaseOrder.description ?? "No description"}</button></td>
                                <td class="specific-w-150"><input bind:this={qtyInput} on:keyup={handleEditItemQtyKeyup} type="number" id="qty" class="form-control" bind:value={child.qty} placeholder="Qty"></td>
                                <td class="specific-w-150"></td>
                                <td class="specific-w-50"></td>
                            </tr>
                        {:else}
                            <tr on:click={() => handleItemClick(i)}>
                                <td>
                                    <span class="badge text-bg-primary">child</span> {child.purchaseOrder.description ?? "No description"}
                                </td>
                                <td>{toStringDelimit(child.qty)}</td>
                                <td></td>
                                <td>
                                    <button type="button" class="btn btn-danger btn-sm" on:click={dispatch("delete", { id: payload[i].id })}>delete</button>
                                </td>
                            </tr>
                        {/if}
                    {/each}
                {/if}
            {/if}
        {/each}
        {#if editedItem == null && bulkAddItem == null}
            <tr>
                {#if isBulk}
                    <td><strong>BULK</strong></td>
                    <td></td>
                {:else}
                    <td><button on:click={() => showSelectPurchaseOrderModal = true} type="button" class="btn btn-secondary">{newItem.purchaseOrder ? newItem.purchaseOrder.description : "Select Purchase Order"}</button></td>
                    <td class="specific-w-150"><input bind:this={qtyInput} on:keyup={handleNewItemQtyKeyup} type="number" id="qty" class="form-control" bind:value={newItem.qty} placeholder="Qty"></td>
                {/if}
                <td class="specific-w-150"><input bind:this={costInput} on:keyup={handleNewItemCostKeyup} type="number" id="cost" class="form-control" bind:value={newItem.cost} placeholder="Cost"></td>
                <td class="specific-w-50">
                    <div class="form-switch">
                        <input class="form-check-input" type="checkbox" role="switch" on:change={isBulkChange} bind:checked={isBulk} id="is-bulk">
                    </div>
                </td>
            </tr>
            {#if errorMessage}
                <tr>
                    <td colspan="4">
                        <div class="alert alert-danger">{errorMessage}</div>
                    </td>
                </tr>
            {/if}
        {/if}
    </tbody>
</table>