<script>
    import { goto } from '$app/navigation';
    import { fetchServer } from '$lib/fetch.js';

    import Pagination from '$lib/Pagination.svelte';
    import SelectLocationModal from '$lib/modals/SelectLocationModal.svelte';
    import LocationStockList from '$lib/LocationStockList.svelte';

    export let data;

    const authHeader = { "Authorization": `Bearer ${data.authToken}` };

    let successMessage = "";
    let errorMessage = "";

    let product = data.payload;
    let stocksCurrentPage = 1;
    let stocksSearchInputElement;
    let stocksSearchInputText = "";
    let stocksSearchTimer;
    
    let showSelectLocationModal = false;
    let selectedLocation = null;
    let locationStock = 0;
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

        const res = await fetchServer(`stocklocation/product/${product.id}?keyword=${keyword}${isRootLocationQuery}&page=${currentPage}`, {
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

    function handleSelectLocationClick(event) {
        const { location } = event.detail;
        selectedLocation = location;
        showSelectLocationModal = false;
    }

    async function addStock() {
        buttonState = "saving";

        try {
            const res = await fetchServer(`stocklocation`, {
                method: "POST",
                headers: { "Content-Type": "application/json", ...authHeader },
                body: JSON.stringify({
                    locationId: selectedLocation ? selectedLocation.id : null,
                    productId: product.id == 0 ? null : product.id,
                    stock: locationStock
                })
            });

            if (res.status != 204) {
                const result = await res.json();
                if (result.isError) return errorMessage = result.responseException.exceptionMessage;
            }
    
            locationStock = 0;
            selectedLocation = null;
            stocksPromise = (searchStocks)(stocksSearchInputText, stocksCurrentPage);
        } catch (error) {
            if (!error.isError) errorMessage = "SvelteKit Error - " + error;
        } finally {
            buttonState = "";
            setTimeout(() => errorMessage = "", 5000);
            setTimeout(() => successMessage = "", 5000);
        }
    }
</script>

{#if showSelectLocationModal}
    <SelectLocationModal
        authToken={data.authToken}
        on:handleModalClose={() => showSelectLocationModal = false}
        on:handleLocationClick={handleSelectLocationClick}
    />
{/if}

<div class="container-fluid p-3">
    <button class="btn btn-secondary" on:click={() => goto("/products")}>Back</button>
    <h1 class="mt-3">{product.name}</h1>
    <input bind:this={stocksSearchInputElement} on:keyup={stocksSearchDebounce} type="text" class="mt-3 form-control mr-10 specific-w-250" placeholder="Search locations">
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
            <button on:click={() => showSelectLocationModal = true} class="input-group-item btn btn-secondary">{selectedLocation ? selectedLocation.name : "Select Location"}</button>
            <input bind:value={locationStock} type="number" id="stock-create-input" class="form-control input-group-item">
            <button on:click={addStock} class="btn btn-primary input-group-item" disabled={buttonState == "saving"}>{buttonState == "saving" ? "Saving..." : "Add"}</button>
        </div>
    </div>
    {#await stocksPromise}
        <h1>Loading...</h1>
    {:then { stocks, pagination }}
        <LocationStockList on:deleteStock={deleteStock} on:updateStock={updateStock} {stocks} />
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