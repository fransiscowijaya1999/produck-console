<script>
    import { fetchServer } from "$lib/fetch";
    import { createEventDispatcher } from "svelte";

    import SelectCategoryModal from "./SelectCategoryModal.svelte";
    import Pagination from "$lib/Pagination.svelte";

    const dispatch = createEventDispatcher();

    let searchProductsTimer = 0;
    let productsCurrentPage = 1;
    let searchProductsInput = "";
    export let excludedLocationId = null;
    
    let selectedCategory = null;
    let showSelectCategoryModal = false;

    $: selectedCategoryId = selectedCategory ? selectedCategory.id : null;
    $: productsPromise = (searchProducts)(searchProductsInput, selectedCategoryId, productsCurrentPage, excludedLocationId);

    const searchProductsDebounce = (event = { target: { value: "" } }) => {
        clearTimeout(searchProductsTimer);
        searchProductsTimer = setTimeout(() => {
            searchProductsInput = event.target.value;
            productsCurrentPage = 1;
        }, 500);
    }

    async function searchProducts(keyword = "", categoryId = null, currentPage = 1, excludedLocationId = null) {
        let searchParams = "";

        if (categoryId) searchParams += `&categoryId=${categoryId}`;
        if (excludedLocationId) searchParams += `&excludeFromLocationId=${excludedLocationId}`;

        const res = await fetchServer(`products/?keyword=${keyword}${searchParams}&page=${currentPage}`);
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

        if (!result.payload && productsCurrentPage > 1) productsCurrentPage -= 1;

        return returnData;
    }

    function handleProductClick(product = null) {
        dispatch("handleProductClick", { product });
    }

    function handleCategoryClick(event) {
        const { category } = event.detail;

        selectedCategory = category;
        showSelectCategoryModal = false;
    }
</script>

{#if showSelectCategoryModal}
    <SelectCategoryModal
        on:handleCategoryClick={handleCategoryClick}
    />
{/if}

<div class="modal">
    <div class="modal-dialog">
        <div class="modal-content">
            <div class="modal-header">
                <h1 class="modal-title fs-5">Select Product</h1>
                <button on:click={() => dispatch("handleCloseModalClick")} type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
            </div>
            <div class="modal-body">
                <div class="btn-group mb-2">
                    <button on:click={() => showSelectCategoryModal = true} class="btn btn-outline-primary">{ selectedCategory ? selectedCategory.name : "Select Category" }</button>
                    <button on:click={() => selectedCategory = null} class="btn btn-danger">x</button>
                </div>
                <input on:keyup={searchProductsDebounce} type="text" id="products-search" class="form-control">
                {#await productsPromise}
                    <p>Loading...</p>
                {:then { products, pagination }}
                    {#if products.length > 0}
                        <div class="list-group mt-3 mb-2">
                            {#each products as product}
                                <a on:click={() => handleProductClick(product)} href="#top" class="list-group-item list-group-item-action">{product.name}</a>
                            {/each}
                        </div>
                        <Pagination
                            on:prevPage={() => productsCurrentPage -= 1}
                            on:nextPage={() => productsCurrentPage += 1}
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