<script>
    import ReplenishmentList from "$lib/ReplenishmentList.svelte";
    import Pagination from "$lib/Pagination.svelte";
    import { fetchServer } from "$lib/fetch";

    export let data;

    const authHeader = { "Authorization": `Bearer ${data.authToken}`};

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

    $: categoriesPromise = (searchCategories)(searchCategoriesInput, categoriesCurrentPage);

    async function searchCategories(keyword = "", currentPage) {
        const res = await fetchServer(`categories/replenishment/?keyword=${keyword}&page=${currentPage}`, {
            headers: authHeader
        });
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

    /**
     * @param {KeyboardEvent} event
     */
    function handleSearchInputKeyup(event) {
        clearTimeout(searchCategoriesTimer);
        searchCategoriesTimer = setTimeout(() => searchCategoriesInput = event.target ? event.target.value : "", 500);
    }
</script>

<div class="container-fluid p-3">
    <h1 class="content-title mb-3">Replenishment</h1>
    <div class="input-group mb-2 specific-w-350">
        <input bind:this={searchCategoriesInputElement} on:keyup={handleSearchInputKeyup} type="text" class="form-control mr-10 w-quarter" placeholder="Search categories">
    </div>
        {#await categoriesPromise}
            <h1>Loading...</h1>
        {:then { categories, pagination }} 
            <ReplenishmentList categories={categories} />
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