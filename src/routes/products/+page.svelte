<script>
    import { goto } from "$app/navigation";

    import Pagination from "$lib/Pagination.svelte";
    import ProductList from "$lib/ProductList.svelte";
    import CategorySelectionList from "$lib/CategorySelectionList.svelte";
    import { fetchServer } from "$lib/fetch";

    /** @type {import('./$types').PageData} */
	export let data;
    
    let queryType = "products";
    /** @type {any[]} */
    let selectedCategories = [];
    /** @type {number} */
    let searchProductsTimer;
    /** @type {number} */
    let searchCategoriesTimer;

    let searchProductsInput = "";
    let searchCategoriesInput = "";

    let productsCurrentPage = 1;

    let categories = data.categoriesData.payload ?? [];
    let categoriesPagination = data.categoriesData.pagination;

    $: lastSelectedCategoryId = selectedCategories.length > 0 ? selectedCategories[selectedCategories.length - 1].id : null;

    $: searchCategoriesParentId = selectedCategories.length > 0 ? `parentId=${selectedCategories[selectedCategories.length - 1].id}` : undefined;
    $: productsPromise = (searchProducts)(searchProductsInput, lastSelectedCategoryId, productsCurrentPage);

    const searchProductsDebounce = (event) => {
        clearTimeout(searchProductsTimer);
        searchProductsTimer = setTimeout(() => {
            searchProductsInput = event.target.value;
            productsCurrentPage = 1;
        }, 500);
    }
    const searchCategoriesDebounce = () => {
        clearTimeout(searchCategoriesTimer);
        searchCategoriesTimer = setTimeout(async () => await searchCategories(searchCategoriesInput, searchCategoriesParentId), 500);
    }

    async function nextCategoriesPage() {
        await searchCategories(searchCategoriesInput, `${searchCategoriesParentId}&page=${categoriesPagination.page + 1}`);
    }
    async function prevCategoriesPage() {
        await searchCategories(searchCategoriesInput, `${searchCategoriesParentId}&page=${categoriesPagination.page - 1}`);
    }

    async function searchProducts(keyword = "", categoryId = null, currentPage = 1) {
        let searchParams = "";

        if (categoryId) searchParams += `&categoryId=${categoryId}`;

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

        return returnData;
    }
    async function searchCategories(keyword = "", additionalQuery = "") {
        const res = await fetchServer(`categories/?keyword=${keyword}${additionalQuery ? "&" + additionalQuery : ""}`);
        const result = await res.json();

        categories = result.payload ?? [];
        categoriesPagination = result.pagination;
    }

    function selectCategory(e) {
        const { category } = e.detail;
        selectedCategories = [...selectedCategories, category];

        searchCategories("", `parentId=${selectedCategories[selectedCategories.length - 1].id}`);
        searchProducts();
    }

    function resetSelectedCategories() {
        selectedCategories = [];
        searchCategories("");
        searchProducts();
    }

    function handleBreadcrumbClick(index) {
        selectedCategories.splice(index + 1, selectedCategories.length - (index + 1));
        selectedCategories = selectedCategories;
    }

</script>

<div class="container-fluid p-3">
    <h1 class="content-title mb-3">Products</h1>
    <div class="d-flex gap-2">
        <button class="btn btn-primary btn-lg" on:click={() => goto("/products/create")}>Create</button>
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
                    <li class="breadcrumb-item"><a on:click={() => handleBreadcrumbClick(i)} href="/products">{selectedCategory.name}</a></li>
                {/if}
            {/each}
        </ol>
    </nav>
    <div class="input-group mb-2 specific-w-350">
        {#if queryType == "products"}
            <input on:keyup={searchProductsDebounce} type="text" class="form-control mr-10 w-quarter" placeholder="Search {queryType}">
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
        {#await productsPromise}
            <h1>Loading...</h1>
        {:then { products, pagination }} 
            <ProductList products={products} />
            {#if products.length > 0}
                <Pagination on:prevPage={() => productsCurrentPage -= 1} on:nextPage={() => productsCurrentPage += 1} totalPages={pagination.totalPages} currentPage={pagination.page} />
            {/if}
        {/await}
    {:else if queryType == "categories"}
        <CategorySelectionList bind:categories={categories} on:selectCategory={selectCategory} />
        {#if categories.length > 0}
            <Pagination on:prevPage={prevCategoriesPage} on:nextPage={nextCategoriesPage} bind:totalPages={categoriesPagination.totalPages} bind:currentPage={categoriesPagination.page} />
        {/if}
    {/if}
</div>