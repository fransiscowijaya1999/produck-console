<script>
    import { fetchServer } from '$lib/fetch.js';

    import Pagination from '$lib/Pagination.svelte';
    import CustomerPriceList from '$lib/CustomerPriceList.svelte';
    import SelectProductModal from '$lib/modals/SelectProductModal.svelte';

    export let data;

    let customer = data.payload;

    let keyword = "";
    let keywordTimer;
    let listCurrentPage = 1;

    let priceRaw = {
        minQty: 1,
        price: 0,
        product: null
    };
    let priceToAdd = Object.assign({}, priceRaw);
    let showSelectProductModal = false;
    let buttonState = "";
    let errorMessage = "";
    let successMessage = "";

    $: pricesPromise = (searchPrices)(keyword, listCurrentPage);

    function keywordDebounce(event) {
        clearTimeout(keywordTimer);
        keywordTimer = setTimeout(() => keyword = event.target.value, 500);
    }

    async function searchPrices(keyword = "", listCurrentPage = 1) {
        const returnData = {
            payload: [],
            pagination: {
                page: 1,
                totalPages: 1
            }
        };

        const res = await fetchServer(`customerprices/customers/${customer.id}?keyword=${keyword}&page=${listCurrentPage}`);
        const result = await res.json();

        if (result.payload) {
            returnData.payload = result.payload;
            returnData.pagination = result.pagination;
        }

        return returnData;
    }

    async function updatePrice(event) {
        const { price } = event.detail;
        price.customerId = customer.id;

        const res = await fetchServer(`customerprices/${price.id}`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(price)
        });

        if (res.status != 204) {
            const result = await res.json();
            console.log(result);
        }

        pricesPromise = (searchPrices)(keyword, listCurrentPage);
    }

    async function deleteOne(event) {
        const priceId = event.detail.id;

        await fetchServer(`customerprices/${priceId}`, {
            method: "DELETE"
        });

        pricesPromise = (searchPrices)(keyword, listCurrentPage);
    }

    async function save() {
        const bodyData = {
            minQty: priceToAdd.minQty,
            price: priceToAdd.price,
            productId: priceToAdd.product ? priceToAdd.product.id : null,
            customerId: customer.id
        }

        try {
            buttonState = "saving";

            const res = await fetchServer("customerprices", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(bodyData)
            });
            
            if (res.status != 204) {
                const result = await res.json();
                if (result.isError) return errorMessage = result.responseException.exceptionMessage;
            }

            priceToAdd = Object.assign({}, priceRaw);
            successMessage = "Price added.";
            pricesPromise = (searchPrices)(keyword, listCurrentPage);
        } catch (/** @type {*} */ error) {
            errorMessage = error;
        } finally {
            buttonState = "";
            setTimeout(() => successMessage = "", 5000);
            setTimeout(() => errorMessage = "", 5000);
        }
    }
</script>

{#if showSelectProductModal}
    <SelectProductModal
        on:handleCloseModalClick={() => showSelectProductModal = false}
        on:handleProductClick={event => {priceToAdd.product = event.detail.product; showSelectProductModal = false;}}
    />
{/if}

<div class="container-fluid p-3">
    <h1 class="mb-3">Customer Prices: <span class="text-secondary">{customer.name}</span></h1>
    <div class="mt-5">
        <div class="card mb-3">
            <div class="card-body">
                {#if errorMessage}
                    <div class="alert alert-danger mt-3">
                        {errorMessage}
                    </div>
                {:else if successMessage}
                    <div class="alert alert-success mt-3">
                        {successMessage}
                    </div>
                {/if}
                <div class="row g-2">
                    <div class="col-auto">
                        <button on:click={() => showSelectProductModal = true} type="button" class="btn btn-secondary">{ priceToAdd.product ? priceToAdd.product.name : "Select Product"}</button>
                    </div>
                    <div class="col-auto">
                        <input bind:value={priceToAdd.minQty} type="number" id="minQty" class="form-control specific-w-100" placeholder="Min Qty">
                    </div>
                    <div class="col-auto">
                        <input bind:value={priceToAdd.price} type="number" id="price" class="form-control specific-w-100" placeholder="Price">
                    </div>
                    <div class="col-auto">
                        <button on:click={save} type="button" class="btn btn-primary" disabled={!priceToAdd.product}>Add</button>
                    </div>
                </div>
            </div>
        </div>
        <input on:keyup={keywordDebounce} type="text" id="keyword" class="form-control specific-w-250 mb-3" placeholder="Search products">
        {#await pricesPromise}
            <h1>Loading...</h1>
        {:then { payload, pagination }}
            {#if payload.length > 0}
                <CustomerPriceList on:deleteOne={deleteOne} on:updateQty={updatePrice} on:updatePrice={updatePrice} {payload} />
            {:else}
                <h3 class="text-center mt-5 mb-5">No price found.</h3>
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