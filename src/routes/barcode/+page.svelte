<script>
    import { fetchServer } from "$lib/fetch";

    import Pagination from "$lib/Pagination.svelte";

    
    /** @type {import('./$types').PageData} */
	export let data;

    const authHeader = { "Authorization": `Bearer ${data.authToken}`}

    let buttonState = "normal";

    let errorMessage = "";
    let successMessage = "";

    /** @type {number} */
    let searchProductsTimer;

    let searchKeyword = "";
    let emptyBarcodeOption = false;
    let productsCurrentPage = 1;

    /**
     * @type {{
     *  name: string;
     *  barcode: string;
     * }[] | any[]}
     */
    let products = [];

    $: productsPromise = (searchProducts)(searchKeyword, emptyBarcodeOption, productsCurrentPage);

    const searchProductsDebounce = (/** @type {{ target: { value: string; }; }} */ event) => {
        clearTimeout(searchProductsTimer);
        searchProductsTimer = setTimeout(() => {
            searchKeyword = event.target.value;
            productsCurrentPage = 1;
        }, 500);
    }

    async function searchProducts(keyword = "", emptyBarcode = false, currentPage = 1) {
        let searchParams = "";

        if (emptyBarcode) searchParams += `&emptyBarcode=true`;

        const res = await fetchServer(`products?keyword=${keyword}${searchParams}&page=${currentPage}&pageSize=25`, {
            headers: {
                "Authorization": `Bearer ${data.authToken}`
            }
        });

        const result = await res.json();

        const returnData = {
            pagination: {
                totalPages: 1,
                page: 1,
                pageSize: 10
            }
        };

        if (result.payload) {
            products = result.payload;
            returnData.pagination = result.pagination;
        }

        return returnData;
    }

    async function save() {
        try {
            buttonState = "saving";

            await fetchServer("products?onlyBarcode=true", {
                method: "PUT",
                headers: { "Content-Type": "application/json", ...authHeader },
                body: JSON.stringify(products)
            });

            productsPromise = (searchProducts)(searchKeyword, emptyBarcodeOption, productsCurrentPage);
        } catch (/** @type {*} */ error) {
            if (!error.isError) errorMessage = "SvelteKit Error - " + error;
        } finally {
            buttonState = "normal";
            setTimeout(() => errorMessage = "", 5000);
            setTimeout(() => successMessage = "", 5000);
        }
    }

    /**
     * @param {any} event
     * @param {number} index
     */
    function handleBarcodeKeyup(event, index) {
        if (event.key === "Enter") {
            /** @type {*} */
            const nextBarcode = document.getElementById(`barcode-${index + 1}`);

            if (nextBarcode) {
                nextBarcode.focus();
                nextBarcode.select();
            }
        }
    }
</script>

<div class="container-fluid p-3">
    <h1 class="mb-3">Barcode</h1>
    <div class="mt-3">
        <input bind:value={searchKeyword} type="text" class="form-control specific-w-250">
    </div>
    <div class="mt-3">
        <div class="form-check form-switch">
            <input class="form-check-input" type="checkbox" role="switch" on:change={() => emptyBarcodeOption = !emptyBarcodeOption} bind:checked={emptyBarcodeOption} id="emptyBarcodeSwitch">
            <label class="form-check-label" for="emptyBarcodeSwitch">
                Show Empty Barcode Only
            </label>
        </div>
    </div>
    <div class="mt-3">
        {#await productsPromise}
            <h1>Loading...</h1>
        {:then { pagination }}
            {#if products.length > 0}
                <ul class="list-group list-group-flush">
                    {#each products as product, i}
                        <li class="list-group-item py-3">
                            <div class="fw-bold mb-2">{product.name}</div>
                            <input on:keyup={(e) => handleBarcodeKeyup(e, i)} id={`barcode-${i}`} bind:value={product.barcode} type="text" class="form-control">
                        </li>
                    {/each}
                </ul>
                <div class="row">
                    <div class="col"></div>
                    <div class="col-auto">
                        <button on:click={save} type="button" class="btn btn-primary btn-lg" disabled={buttonState != "normal"}>{
                            buttonState != "normal" ? "Saving..." : "Save"
                        }</button>
                    </div>
                </div>
                {#if errorMessage}
                    <div class="alert alert-danger mt-3">
                        {errorMessage}
                    </div>
                {:else if successMessage}
                    <div class="alert alert-success mt-3">
                        {successMessage}
                    </div>
                {/if}
                <Pagination on:prevPage={() => productsCurrentPage -= 1} on:nextPage={() => productsCurrentPage += 1} totalPages={pagination.totalPages} currentPage={pagination.page} />
            {/if}
        {/await}
    </div>
</div>