<script>
    import { goto } from '$app/navigation';
    import ProductStockList from '$lib/ProductStockList.svelte';
    import Pagination from '$lib/Pagination.svelte';
    import { fetchServer } from '$lib/fetch.js';
    import SelectProductModal from '$lib/modals/SelectProductModal.svelte';

    export let data;

    const authHeader = { "Authorization": `Bearer ${data.authToken}` };

    let successMessage = "";
    let errorMessage = "";

    let location = data.payload;
    let stocksCurrentPage = 1;
    let stocksSearchInputElement;
    let stocksSearchInputText = "";
    let stocksSearchTimer;
    
    let showSelectProductModal = false;
    let selectedProduct = null;
    let productStock = 0;
    let buttonState = "";

    $: stocksPromise = (searchStocks)(stocksSearchInputText, stocksCurrentPage);

    function stocksSearchDebounce(event) {
        clearTimeout(stocksSearchTimer);
        stocksSearchTimer = setTimeout(() => stocksSearchInputText = event.target.value, 500);
    }

    async function searchStocks(keyword = "", currentPage) {
        const returnData = {
            stocks: [],
            pagination: {
                totalPages: 1,
                page: 1
            }
        };

        const isRootLocationQuery = data.payload.isRootLocation ? `&isRootLocation=true` : "";

        const res = await fetchServer(`stocklocation/location/${location.id}?keyword=${keyword}${isRootLocationQuery}&page=${currentPage}`,
        {
            headers: authHeader
        });
        const result = await res.json();

        if (result.payload) {
            returnData.stocks = result.payload;
            returnData.pagination = result.pagination;
        }

        return returnData;
    }

    async function deleteStock(event) {
        const { stockId } = event.detail;

        await fetchServer(`stocklocation/${stockId}`, {
            method: "DELETE",
            headers: authHeader
        });

        stocksPromise = (searchStocks)(stocksSearchInputText, stocksCurrentPage);
    }

    async function updateStock(event) {
        const { stock } = event.detail;

        const res = await fetchServer(`stocklocation/${stock.id}`, {
            method: "PUT",
            headers: { "Content-Type": "application/json", ...authHeader },
            body: JSON.stringify(stock)
        });
        
        if (res.status != 204) {
            const result = await res.json();
            if (result.isError) return errorMessage = result.responseException.exceptionMessage;
        }

        stocksPromise = (searchStocks)(stocksSearchInputText, stocksCurrentPage);
        successMessage = "Stock saved.";
        setTimeout(() => successMessage = "", 5000);
    }

    function handleSelectProductClick(event) {
        const { product } = event.detail;
        selectedProduct = product;
        showSelectProductModal = false;
    }

    async function addStock() {
        buttonState = "saving";

        try {
            const res = await fetchServer(`stocklocation`, {
                method: "POST",
                headers: { "Content-Type": "application/json", ...authHeader },
                body: JSON.stringify({
                    locationId: location.id == 0 ? null : location.id,
                    productId: selectedProduct.id,
                    stock: productStock
                })
            });

            if (res.status != 204) {
                const result = await res.json();
                if (result.isError) return errorMessage = result.responseException.exceptionMessage;
            }
    
            productStock = 0;
            selectedProduct = null;
            stocksPromise = (searchStocks)(stocksSearchInputText, stocksCurrentPage);
        } catch (error) {
            if (!error.isError) errorMessage = "SvelteKit Error - " + error;
        } finally {
            buttonState = "normal";
            setTimeout(() => errorMessage = "", 5000);
            setTimeout(() => successMessage = "", 5000);
        }
    }
</script>

{#if showSelectProductModal}
    <SelectProductModal
        authToken={data.authToken}
        excludedLocationId={location.id}
        on:handleCloseModalClick={() => showSelectProductModal = false}
        on:handleProductClick={handleSelectProductClick}
    />
{/if}

<div class="container-fluid p-3">
    <button class="btn btn-secondary" on:click={() => goto("/inventory")}>Back</button>
    <h1 class="mt-3">{location.name}</h1>
    <input bind:this={stocksSearchInputElement} on:keyup={stocksSearchDebounce} type="text" class="mt-3 form-control mr-10 specific-w-250" placeholder="Search products">
    {#if errorMessage}
        <div class="alert alert-danger mt-3">
            {errorMessage}
        </div>
    {:else if successMessage}
        <div class="alert alert-success mt-3">
            {successMessage}
        </div>
    {/if}
    <div class="create-stock-wrapper" style="max-width: 350px">
        <div class="input-group mt-2">
            <button on:click={() => showSelectProductModal = true} class="input-group-item btn btn-secondary">{selectedProduct ? selectedProduct.name : "Select Product"}</button>
            <input bind:value={productStock} type="number" id="stock-create-input" class="form-control input-group-item">
            <button on:click={addStock} class="btn btn-primary input-group-item" disabled={buttonState == "saving"}>{buttonState == "saving" ? "Saving..." : "Add"}</button>
        </div>
    </div>
    {#await stocksPromise}
        <h1>Loading...</h1>
    {:then { stocks, pagination }}
        <ProductStockList on:deleteStock={deleteStock} on:updateStock={updateStock} {stocks} />
        {#if stocks.length > 0}
            <Pagination
                on:prevPage={() => stocksCurrentPage -= 1}
                on:nextPage={() => stocksCurrentPage += 1}
                totalPages={pagination.totalPages}
                currentPage={pagination.page}
            />
        {/if}
    {/await}
</div>