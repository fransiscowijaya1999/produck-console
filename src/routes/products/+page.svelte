<script>
    import axios from "axios";
    import { goto } from "$app/navigation";

    import Pagination from "$lib/Pagination.svelte";
    import ProductList from "$lib/ProductList.svelte";
    import CategorySelectionList from "$lib/CategorySelectionList.svelte";

    /** @type {import('./$types').PageData} */
	export let data;

    /** @type {number} */
    let searchProductsTimer;
    /** @type {number} */
    let searchCategoriesTimer;
    let searchProductsInput = "";
    let searchCategoriesInput = "";
    let queryType = "products";
    /** @type {any[]} */
    let selectedCategories = [];
    let products = data.productsRes.payload ?? [];
    let productsPagination = data.productsRes.pagination;

    let categories = data.categoriesRes.payload ?? [];
    let categoriesPagination = data.categoriesRes.pagination;

    $: selectedProducts = products.filter(p => p.selected);

    const searchProductsDebounce = () => {
        clearTimeout(searchProductsTimer);
        searchProductsTimer = setTimeout(async () => await searchProducts(searchProductsInput), 500);
    }
    const searchCategoriesDebounce = () => {
        clearTimeout(searchCategoriesTimer);
        searchCategoriesTimer = setTimeout(async () => await searchCategories(searchCategoriesInput), 500);
    }

    async function nextProductsPage() {
        await searchProducts(searchProductsInput, `page=${productsPagination.page + 1}`);
    }
    async function prevProductsPage() {
        await searchProducts(searchProductsInput, `page=${productsPagination.page - 1}`);
    }

    async function nextCategoriesPage() {
        await searchCategories(searchCategoriesInput, `page=${categoriesPagination.page + 1}`);
    }
    async function prevCategoriesPage() {
        await searchCategories(searchCategoriesInput, `page=${categoriesPagination.page - 1}`);
    }

    async function searchProducts(keyword = "", additionalQuery = "") {
        const res = await axios(`/products/?keyword=${keyword}${additionalQuery ? "&" + additionalQuery : ""}`);

        products = res.data.payload;
        productsPagination = res.data.pagination;
    }
    async function searchCategories(keyword = "", additionalQuery = "") {
        const res = await axios(`/categories/?keyword=${keyword}${additionalQuery ? "&" + additionalQuery : ""}`);

        categories = res.data.payload;
        categoriesPagination = res.data.pagination;
    }

    function selectCategory(e) {
        const { category } = e.detail;
        selectedCategories = [...selectedCategories, category];

        categories = searchCategories("", `parentId=${selectedCategories[selectedCategories.length - 1].id}`);
    }

    function resetSelectedCategories() {
        categories = searchCategories("");
    }

</script>
<div class="container-fluid p-3">
    <h1 class="content-title mb-3">Products</h1>
    <div class="d-flex gap-2">
        <button class="btn btn-primary btn-lg" on:click={() => goto("/products/create")}>Create</button>
        {#if selectedProducts.length > 0}<button type="button" class="btn btn-secondary">Selected {selectedProducts.length}</button>{/if}
    </div>
    <nav class="mt-3" aria-label="Product Category Breadcrumb">
        <ol class="breadcrumb">
            <li class="breadcrumb-item" class:active={selectedCategories.length == 0}>
                {#if selectedCategories.length == 0}
                    All
                {:else}
                    <a href="/products" on:click={resetSelectedCategories}>All</a>
                {/if}
            </li>
            {#each selectedCategories as selectedCategory, i}
                {#if i == selectedCategories.length - 1}
                    <li class="breadcrumb-item active" aria-current="page">{selectedCategory.name}</li>
                {:else}
                    <li class="breadcrumb-item"><a href="/products">{selectedCategory.name}</a></li>
                {/if}
            {/each}
        </ol>
    </nav>
    <div class="input-group mb-2 specific-w-350">
        {#if queryType == "products"}
            <input bind:value={searchProductsInput} on:keyup={searchProductsDebounce} type="text" class="form-control mr-10 w-quarter" placeholder="Search {queryType}">
        {:else if queryType == "categories"}
            <input bind:value={searchCategoriesInput} on:keyup={searchCategoriesDebounce} type="text" class="form-control mr-10 w-quarter" placeholder="Search {queryType}">
        {/if}
        <button on:click={() => queryType == "products" ? queryType = "categories" : queryType = "products" } type="button" class="btn btn-secondary">
            {#if queryType == "products"}
                Products
            {:else if queryType == "categories"}
                Categories
            {/if}
        </button>
    </div>
    {#if queryType == "products"}
        <ProductList bind:products={products} />
        {#if products.length > 0}
            <Pagination on:prevPage={prevProductsPage} on:nextPage={nextProductsPage} bind:totalPages={productsPagination.totalPages} bind:currentPage={productsPagination.page} />
        {/if}
    {:else if queryType == "categories"}
        <CategorySelectionList bind:categories={categories} on:selectCategory={selectCategory} />
        {#if categories.length > 0}
            <Pagination on:prevPage={prevCategoriesPage} on:nextPage={nextCategoriesPage} bind:totalPages={categoriesPagination.totalPages} bind:currentPage={categoriesPagination.page} />
        {/if}
    {/if}
</div>