<script>
    import { goto } from "$app/navigation";
    import CategoryList from "$lib/CategoryList.svelte";
    import Pagination from "$lib/Pagination.svelte";
    import { fetchServer } from "$lib/fetch";

    /**
     * @type {any[]}
     */
    let selectedCategories = [];
    let searchCategoriesInput = "";
    /**
     * @type {HTMLInputElement}
     */
    let searchCategoriesInputElement;
    let categoriesCurrentPage = 1;

    /**
     * @type {number}
     */
    let searchCategoriesTimer;

    $: lastSelectedCategory = selectedCategories.length > 0 ? selectedCategories[selectedCategories.length - 1].id : "";
    $: categoriesPromise = (searchCategories)(searchCategoriesInput, lastSelectedCategory, categoriesCurrentPage);

    async function searchCategories(keyword = "", parentId = "", currentPage) {
        const res = await fetchServer(`categories/?keyword=${keyword}&parentId=${parentId}&page=${currentPage}`);
        const result = await res.json();

        const returnData = {
            categories: [],
            pagination: {
                totalPages: 1,
                page: 1,
            }
        }

        if (result.payload) {
            returnData.categories = result.payload;
            returnData.pagination = result.pagination;
        };

        if (!result.payload && categoriesCurrentPage > 1) categoriesCurrentPage -= 1;

        return returnData;
    }

    async function deleteCategory(event) {
        const { categoryId } = event.detail;
        
        await fetchServer(`categories/${categoryId}`, {
            method: "DELETE"
        });

        categoriesPromise = (searchCategories)(searchCategoriesInput, lastSelectedCategory, categoriesCurrentPage);
    }

    /**
     * @param {{ detail: { category: any; }; }} e
     */
    function selectCategory(e) {
        const { category } = e.detail;
        selectedCategories = [...selectedCategories, category];

        searchCategoriesInputElement.value = "";
        searchCategoriesInput = "";
        categoriesCurrentPage = 1;
    }

    /**
     * @param {number} index
     */
    function handleBreadcrumbClick(index) {
        selectedCategories.splice(index + 1, selectedCategories.length - (index + 1));
        selectedCategories = selectedCategories;
    }

    /**
     * @param {KeyboardEvent} event
     */
    function handleSearchInputKeyup(event) {
        clearTimeout(searchCategoriesTimer);
        searchCategoriesTimer = setTimeout(() => searchCategoriesInput = event.target ? event.target.value : "", 500);
    }
</script>

<div class="container-fluid p-3">
    <h1 class="content-title mb-3">Categories</h1>
    <div class="d-flex gap-2">
        <button class="btn btn-primary btn-lg" on:click={() => goto("/categories/create")}>Create</button>
    </div>
    <nav class="mt-3" aria-label="Category Breadcrumb">
        <ol class="breadcrumb">
            <li class="breadcrumb-item" class:active={selectedCategories.length == 0}>
                {#if selectedCategories.length == 0}
                    All
                {:else}
                    <a href="/categories" on:click={() => selectedCategories = []}>All</a>
                {/if}
            </li>
            {#each selectedCategories as selectedCategory, i}
                {#if i == selectedCategories.length - 1}
                    <li class="breadcrumb-item active" aria-current="page">{selectedCategory.name}</li>
                {:else}
                    <li class="breadcrumb-item"><a on:click={() => handleBreadcrumbClick(i)} href="/categories">{selectedCategory.name}</a></li>
                {/if}
            {/each}
        </ol>
    </nav>
    <div class="input-group mb-2 specific-w-350">
        <input bind:this={searchCategoriesInputElement} on:keyup={handleSearchInputKeyup} type="text" class="form-control mr-10 w-quarter" placeholder="Search categories">
    </div>
        {#await categoriesPromise}
            <h1>Loading...</h1>
        {:then { categories, pagination }} 
            <CategoryList categories={categories} on:deleteCategory={deleteCategory} on:selectCategory={selectCategory} />
            {#if categories.length > 0}
                <Pagination
                    on:prevPage={() => categoriesCurrentPage -= 1}
                    on:nextPage={() => categoriesCurrentPage += 1}
                    totalPages={pagination.totalPages}
                    currentPage={pagination.page}
                />
            {/if}
        {/await}
</div>