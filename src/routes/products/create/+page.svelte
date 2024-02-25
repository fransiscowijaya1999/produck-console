<script>
    import { fetchServer } from "$lib/fetch";
    import ProductForm from "$lib/ProductForm.svelte";
    import SelectCategoryModal from "$lib/modals/SelectCategoryModal.svelte";

    export let data;

    const productRaw = {
        name: "",
        price: 0,
        cost: 0,
        barcode: "",
        categoryId: null,
        category: null
    };

    let showSelectCategoryModal = false;
    let errorMessage = "";
    let successMessage = "";

    let buttonState = "normal";
    let product = Object.assign({}, productRaw);

    $: productsPromise = (searchProducts)(product.name);

    async function searchProducts(keyword = "", categoryId = null, currentPage = 1) {
        let searchParams = "";

        if (categoryId) searchParams += `&categoryId=${categoryId}`;

        const res = await fetchServer(`products/?keyword=${keyword}${searchParams}&page=${currentPage}`, {
            headers: {
                "Authorization": `Bearer ${data.authToken}`
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

    function handleSelectCategoryClick() {
        showSelectCategoryModal = !showSelectCategoryModal;
    }

    /** @param {*} event */
    function handleCategoryClick(event) {
        showSelectCategoryModal = false;
        product.category = event.detail.category;
    }

    async function saveProduct() {
        try {
            buttonState = "saving";

            product.barcode = product.barcode.length > 0 ? product.barcode : null;
            product.categoryId = product.category ? product.category.id : null;
            const res = await fetchServer("products", {
                method: "POST",
                headers: { "Content-Type": "application/json", "Authorization": `Bearer ${data.authToken}` },
                body: JSON.stringify(product)
            });

            const result = await res.json();

            if (result.isError) return errorMessage = result.responseException.exceptionMessage;

            successMessage = "Product saved.";
            product = Object.assign({}, productRaw);
            buttonState = "normal";

            setTimeout(() => successMessage = "", 5000);
        } catch (/** @type {*} */ error) {
            errorMessage = error;

            buttonState = "normal";
        }
    }
</script>

{#if showSelectCategoryModal}
    <SelectCategoryModal authToken={data.authToken} on:handleCategoryClick={handleCategoryClick} />
{/if}
<div class="container-fluid">
    <div class="row g-3">
        <div class="col-1"></div>
        <div class="col-4">
            <button class="btn btn-secondary mt-3" on:click={() => history.back()}>Back</button>
            <h1>New Product</h1>
            <div class="form-wrapper specific-w-350">
                <ProductForm
                    on:handleSelectCategoryClick={handleSelectCategoryClick}
                    bind:category={product.category}
                    bind:name={product.name}
                    bind:price={product.price}
                    bind:cost={product.cost}
                    bind:barcode={product.barcode}
                />
                <button on:click={saveProduct} class="btn btn-primary btn-lg mt-3" class:disabled={buttonState == "saving"} type="button">
                    {#if buttonState == "normal"}
                        Save
                    {:else if buttonState == "saving"}
                        Saving...
                    {/if}
                </button>
                {#if errorMessage}
                    <div class="alert alert-danger mt-3">
                        {errorMessage}
                    </div>
                {:else if successMessage}
                    <div class="alert alert-success mt-3">
                        {successMessage}
                    </div>
                {/if}
            </div>
        </div>
        <div class="col">
            {#if product.name.length < 1}
                <h3 class="text-secondary text-center mt-5">Type product name</h3>
            {:else}
                {#await productsPromise}
                    <h3 class="text-secondary text-center mt-5">Searching...</h3>
                {:then {products}} 
                    {#if products.length < 1}
                        <h3 class="text-secondary text-center mt-5">No possible duplicate</h3>
                    {:else}
                        <h3 class="text-secondary text-center mt-5">Possible duplicate</h3>
                        <ul class="list-group">
                            {#each products as product}
                                <li class="list-group-item">{product.name}</li>
                            {/each}
                        </ul>
                    {/if}
                {/await}
            {/if}
        </div>
    </div>
</div>