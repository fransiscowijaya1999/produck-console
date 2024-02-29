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
    let searchCategoriesInputElement;

    let productsCurrentPage = 1;
    let categoriesCurrentPage = 1;

    $: lastSelectedCategoryId = selectedCategories.length > 0 ? selectedCategories[selectedCategories.length - 1].id : null;

    $: productsPromise = (searchProducts)(searchProductsInput, lastSelectedCategoryId, productsCurrentPage);
    $: categoriesPromise = (searchCategories)(searchCategoriesInput, lastSelectedCategoryId, categoriesCurrentPage);

    const searchProductsDebounce = (event) => {
        clearTimeout(searchProductsTimer);
        searchProductsTimer = setTimeout(() => {
            searchProductsInput = event.target.value;
            productsCurrentPage = 1;
        }, 500);
    }
    const searchCategoriesDebounce = (event) => {
        clearTimeout(searchCategoriesTimer);
        searchCategoriesTimer = setTimeout(() => {
            searchCategoriesInput = event.target.value;
            categoriesCurrentPage = 1;
        }, 500);
    }

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
    async function searchCategories(keyword = "", parentId = null, currentPage = 1) {
        let searchParams = "";

        if (parentId) searchParams += `&parentId=${parentId}`;
        if (!parentId) searchParams += `&showOnlyRootChilds=true`;

        const res = await fetchServer(`categories/?keyword=${keyword}${searchParams}&page=${currentPage}`, {
            headers: { "Authorization": `Bearer ${data.authToken}` }
        });
        const result = await res.json();

        const returnData = {
            categories: [],
            pagination: {
                totalPages: 1,
                page: 1,
                pageSize: 10
            }
        }

        if (result.payload) {
            returnData.categories = result.payload;
            returnData.pagination = result.pagination;
        }

        return returnData;
    }

    function selectCategory(e) {
        const { category } = e.detail;
        selectedCategories = [...selectedCategories, category];

        searchCategoriesInput = "";
        searchCategoriesInputElement.value = "";
        categoriesCurrentPage = 1;
    }

    function resetSelectedCategories() {
        selectedCategories = [];
    }

    function handleBreadcrumbClick(index) {
        selectedCategories.splice(index + 1, selectedCategories.length - (index + 1));
        selectedCategories = selectedCategories;
    }

    async function exportCSV() {
        let searchParams = "";

        if (lastSelectedCategoryId) searchParams += `&categoryId=${lastSelectedCategoryId}`;

        const res = await fetchServer(`products/csv?keyword=${searchProductsInput}${searchParams}&page=${productsCurrentPage}`, {
            headers: {
                "Authorization": `Bearer ${data.authToken}`
            }
        });
        const { result } = await res.json();

        const blob = new Blob([result], { type: "text/csv;charset=utf-8"});
        const objUrl = URL.createObjectURL(blob);

        window.open(objUrl, "_blank");
    }

</script>

<div class="container-fluid p-3">
    <h1 class="content-title mb-3">Products</h1>
    <div class="row d-flex g-2">
        <div class="col-auto">
            <button class="btn btn-primary btn-lg" on:click={() => goto("/products/create")}>Create</button>
        </div>
        <div class="col-auto">
            <button on:click={() => goto("/barcode")} type="button" class="btn btn-secondary btn-lg">
                Barcode
            </button>
        </div>
        <div class="col-auto">
            <button on:click={exportCSV} type="button" class="btn btn-secondary btn-lg">Download CSV</button>
        </div>
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
            <input bind:this={searchCategoriesInputElement} on:keyup={searchCategoriesDebounce} type="text" class="form-control mr-10 w-quarter" placeholder="Search {queryType}">
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
        {#await categoriesPromise}
            <h1>Loading...</h1>
        {:then { categories, pagination }}
            <CategorySelectionList categories={categories} on:selectCategory={selectCategory} />
            {#if categories.length > 0}
                <Pagination on:prevPage={() => categoriesCurrentPage -= 1} on:nextPage={() => categoriesCurrentPage += 1} totalPages={pagination.totalPages} currentPage={pagination.page} />
            {/if}
        {/await}
    {/if}
</div>