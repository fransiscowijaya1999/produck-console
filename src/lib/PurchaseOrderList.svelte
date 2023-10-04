<script>
    import { createEventDispatcher } from "svelte";
    import { toStringDelimit } from "./numbering";
    import { fetchServer } from "./fetch";

    const dispatch = createEventDispatcher();

    export let payload = [];
    export let authToken = "";

    let errorMessage = "";
    let newItemRaw = {
        product: null,
        description: "",
        cost: null,
        qty: null
    };
    let newItem = Object.assign({}, newItemRaw);

    let editedItem = null;
    let showProductSelection = false;
    let productSelectionList = [];
    let productSelectionSelected = 0;
    let searchKeyword = "";

    let productInput;
    let costInput;
    let qtyInput;

    $: (search)(searchKeyword).then(result => productSelectionList = result.products);

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

    function handleNewItemProductKeyup(event) {
        if (event.key == "Enter" && !newItem.product) return selectProduct(productSelectionList[productSelectionSelected]);
        if (event.key == "Enter") return save();
        if (event.key == "ArrowUp" && productSelectionSelected > 0) return productSelectionSelected--;
        if (event.key == "ArrowDown" && productSelectionSelected < productSelectionList.length) return productSelectionSelected++;

        if (event.key != "ArrowUp" && event.key != "ArrowDown" && event.key != "Enter") productSelectionSelected = 0;
        searchKeyword = event.target.value;
    }
    function handleNewItemProductBlur(event) {
        // selectProduct(productSelectionList[productSelectionSelected])
        event.target.value = newItem.product ? newItem.product.name : "";
        searchKeyword = "";
        showProductSelection = false;
    }
    function handleNewItemProductFocus() {
        newItem.product = null;
        showProductSelection = true;
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

    function handleEditItemProductKeyup(event, index) {
        if (event.key == "Enter") return editSelectProduct(productSelectionList[productSelectionSelected], index);
        if (event.key == "ArrowUp" && productSelectionSelected > 0) return productSelectionSelected--;
        if (event.key == "ArrowDown" && productSelectionSelected < productSelectionList.length) return productSelectionSelected++;

        if (event.key != "ArrowUp" && event.key != "ArrowDown" && event.key != "Enter") productSelectionSelected = 0;
        searchKeyword = event.target.value;
    }
    function handleItemClick(index) {
        editedItem = index;
    }
    function handleEditItemProductBlur(event, data) {
        // selectProduct(productSelectionList[productSelectionSelected])
        event.target.value = data.product.name;
        showProductSelection = false;
    }
    function handleEditItemProductFocus(event) {
        searchKeyword = event.target.value;
        showProductSelection = true;
    }
    function handleEditItemCostKeyup(event) {
        if (event.key == "Enter") {
            update();
        }
    }
    function handleEditItemQtyKeyup(event) {
        if (event.key == "Enter") {
            costInput.focus();
        }
    }

    function selectProduct(product) {
        if (product) {
            newItem.product = product
            newItem.description = product.name
        };
        qtyInput.focus();
    }
    function editSelectProduct(product, index) {
        if (product) {
            payload[index].product = product;
            payload[index].description = product.name;
        };
        qtyInput.focus();
    }

    function save() {
        if (!newItem.product) { errorMessage = "Product is required."; return setTimeout(() => errorMessage = "", 5000); }
        dispatch("save", { purchaseOrder: Object.assign({}, newItem) });

        newItem = Object.assign({}, newItemRaw);
        productInput.value = "";
        productInput.focus();
        resetForm();
    }

    function update() {
        dispatch("update", { purchaseOrder: Object.assign({}, payload[editedItem]) });

        resetForm();
    }

    function resetForm() {
        searchKeyword = "";
        editedItem = null;
    }
</script>

<table class="table table-hover">
    <thead>
        <tr>
            <th>Product</th>
            <th>Description</th>
            <th>Qty / Delivered</th>
            <th>Cost</th>
        </tr>
    </thead>
    <tbody>
        {#each payload as data, i}
            {#if editedItem == i}
                {#if showProductSelection == true}
                    <div class="position-relative w-0 h-0">
                        <div class="card position-absolute" style="bottom: 0.5rem; background-color: white;">
                            <div class="list-group">
                                {#each productSelectionList as item, i}
                                    <div class="list-group-item" class:active={i == productSelectionSelected}>{item.name}</div>
                                {/each}
                                <div class="list-group-item" class:active={productSelectionSelected == productSelectionList.length}>Search more</div>
                            </div>
                        </div>
                    </div>
                {/if}
                <tr>
                    <td><input
                        on:focus={handleEditItemProductFocus}
                        on:blur={event => handleEditItemProductBlur(event, data)}
                        on:keydown={e => {if (e.key == "ArrowUp" || e.key == "ArrowDown") e.preventDefault();}}
                        on:keyup={event => handleEditItemProductKeyup(event, i)}
                        bind:this={productInput}
                        value={data.product.name}
                        type="text" id="product" class="form-control" placeholder="Product"></td>
                    <td><input type="text" id="description" class="form-control" bind:value={data.description} placeholder="Description"></td>
                    <td class="specific-w-150"><input bind:this={qtyInput} on:keyup={handleEditItemQtyKeyup} type="number" id="qty" class="form-control" bind:value={data.quantity} placeholder="Qty"></td>
                    <td class="specific-w-150"><input bind:this={costInput} on:keyup={handleEditItemCostKeyup} type="number" id="cost" class="form-control" bind:value={data.cost} placeholder="Cost"></td>
                </tr>
            {:else}
                <tr on:click={() => handleItemClick(i)}>
                    <td>{data.product.name}</td>
                    <td>{data.description ?? ""}</td>
                    <td>
                        <strong>{toStringDelimit(data.quantity)}</strong>
                        /
                        {#if data.delivered >= data.quantity}
                            <span class="badge text-bg-success">{toStringDelimit(data.delivered)}</span>
                        {:else}
                            <span class="badge text-bg-warning">{toStringDelimit(data.delivered)}</span>
                        {/if}
                    </td>
                    <td>{toStringDelimit(data.cost)}</td>
                </tr>
            {/if}
        {/each}
        {#if editedItem == null}
            {#if showProductSelection == true}
                <div class="position-relative w-0 h-0">
                    <div class="card position-absolute" style="bottom: 0.5rem; background-color: white;">
                        <div class="list-group">
                            {#each productSelectionList as item, i}
                                <div class="list-group-item" class:active={i == productSelectionSelected}>{item.name}</div>
                            {/each}
                            <div class="list-group-item" class:active={productSelectionSelected == productSelectionList.length}>Search more</div>
                        </div>
                    </div>
                </div>
            {/if}
            <tr>
                <td><input
                    on:focus={handleNewItemProductFocus}
                    on:blur={handleNewItemProductBlur}
                    on:keydown={e => {if (e.key == "ArrowUp" || e.key == "ArrowDown") e.preventDefault();}}
                    on:keyup={handleNewItemProductKeyup}
                    bind:this={productInput}
                    type="text" id="product" class="form-control" placeholder="Product"></td>
                <td><input type="text" id="description" class="form-control" bind:value={newItem.description} placeholder="Description"></td>
                <td class="specific-w-150"><input bind:this={qtyInput} on:keyup={handleNewItemQtyKeyup} type="number" id="qty" class="form-control" bind:value={newItem.qty} placeholder="Qty"></td>
                <td class="specific-w-150"><input bind:this={costInput} on:keyup={handleNewItemCostKeyup} type="number" id="cost" class="form-control" bind:value={newItem.cost} placeholder="Cost"></td>
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