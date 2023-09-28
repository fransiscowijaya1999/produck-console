<script>
    import { fetchServer } from "$lib/fetch";
    import { createEventDispatcher } from "svelte";

    import Pagination from "$lib/Pagination.svelte";
    
    /** @type {number | null} */
    export let excludeId = null;
    export let authToken = "";

    const dispatch = createEventDispatcher();

    let selectedCategories = [];
    /** @type {number} */
    let categorySearchTimer;
    /** @type {string} */
    let categorySearchInputValue = "";
    let categoriesCurrentPage = 1;

    $: lastSelectedCategoriesId = selectedCategories.length > 0 ? selectedCategories[selectedCategories.length - 1].id : null;
    $: categoriesPromise = (searchCategories)(categorySearchInputValue, lastSelectedCategoriesId, categoriesCurrentPage, excludeId);

    function handleBreadcrumbClick(index) {
        selectedCategories.splice(index + 1, selectedCategories.length - (index + 1));
        selectedCategories = selectedCategories;
    }

    /** @param {*} event */
    const searchCategoriesDebounce = (event = { target: { value: "" } }) => {
        clearTimeout(categorySearchTimer);
        categorySearchTimer = setTimeout(() => {
            categorySearchInputValue = event.target.value;
            categoriesCurrentPage = 1;
        }, 500);
    }

    /** @param {*} category */
    function handleCategoryClick(category) {
        dispatch("handleCategoryClick", { category });
    }

    async function searchCategories(keyword = "", parentId = null, currentPage = 1, excludeId = null) {
        const returnData = {
            categories: [],
            pagination: {
                totalPages: 1,
                page: 1,
                pageSize: 10
            }
        };

        let searchParams = "";

        if (parentId) searchParams += `&parentId=${parentId}`;
        if (!parentId) searchParams += `&showOnlyRootChilds=true`;
        if (excludeId) searchParams += `&exclude=${excludeId}`;

        const res = await fetchServer(`categories/?keyword=${keyword}${searchParams}&page=${currentPage}`, {
            headers: { "Authorization": `Bearer ${authToken}` }
        });
        const result = await res.json();

        if (result.payload) {
            returnData.categories = result.payload;
            returnData.pagination = result.pagination;
        }

        if (!result.payload && categoriesCurrentPage > 1) categoriesCurrentPage -= 1;

        return returnData;
    }
</script>

<div class="modal" style="z-index: 9999;">
    <div class="modal-dialog">
        <div class="modal-content">
            <div class="modal-header">
                <h1 class="modal-title fs-5">Select Category</h1>
                <button on:click={() => handleCategoryClick(null)} type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
            </div>
            <div class="modal-body">
                <nav class="mt-3" aria-label="Category Breadcrumb">
                    <ol class="breadcrumb">
                        <li class="breadcrumb-item" class:active={selectedCategories.length == 0}>
                            {#if selectedCategories.length == 0}
                                root
                            {:else}
                                <a href="#top" on:click={() => selectedCategories = []}>root</a>
                            {/if}
                        </li>
                        {#each selectedCategories as selectedCategory, i}
                            {#if i == selectedCategories.length - 1}
                                <li class="breadcrumb-item active" aria-current="page">{selectedCategory.name}</li>
                            {:else}
                                <li class="breadcrumb-item"><a on:click={() => handleBreadcrumbClick(i)} href="#top">{selectedCategory.name}</a></li>
                            {/if}
                        {/each}
                    </ol>
                </nav>
                <input on:keyup={searchCategoriesDebounce} type="text" id="category-search" class="form-control">
                {#await categoriesPromise}
                    <p>Loading...</p>
                {:then { categories, pagination }}
                    {#if categories.length > 0}
                        <div class="list-group mt-3 mb-2">
                            {#each categories as category}
                                <a href="#top" class="list-group-item list-group-item-action">
                                    <button on:click={() => selectedCategories = [...selectedCategories, category]} class="btn btn-sm btn-secondary">Step In</button>
                                    <button on:click={() => handleCategoryClick(category)} class="btn btn-sm btn-outline-primary">Select</button>
                                    <span class="ms-2">{category.name}</span>
                                </a>
                            {/each}
                        </div>
                        <Pagination
                            on:prevPage={() => categoriesCurrentPage -= 1}
                            on:nextPage={() => categoriesCurrentPage += 1}
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