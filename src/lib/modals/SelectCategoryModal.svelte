<script>
    import { fetchServer } from "$lib/fetch";
    import { createEventDispatcher } from "svelte";
    
    /** @type {number | null} */
    export let excludeId = null;

    const dispatch = createEventDispatcher();

    /** @type {Promise<*[]>} */
    let categories = searchCategories();
    /** @type {number} */
    let categorySearchTimer;
    /** @type {string} */
    let categorySearchInputValue = "";

    $: categoriesPromise = (searchCategories)(categorySearchInputValue);

    /** @param {*} category */
    function handleCategoryClick(category) {
        dispatch("handleCategoryClick", { category });
    }

    /** @param {*} event */
    function handleCategorySearchKeyup(event) {
        clearTimeout(categorySearchTimer);
        categorySearchTimer = setTimeout(() => categories = searchCategories(event.target.value), 300);
    }

    async function searchCategories(keyword = "") {
        if (keyword.length < 3) return [];

        let queryString = `keyword=${keyword}`;
        if (excludeId) queryString += `&exclude=${excludeId}`;

        const res = await fetchServer(`categories/?${queryString}`);
        const data = await res.json();

        if (data.payload) return data.payload;
        return [];
    }
</script>

<div class="modal">
    <div class="modal-dialog">
        <div class="modal-content">
            <div class="modal-header">
                <h1 class="modal-title fs-5">Select Category</h1>
                <button on:click={() => handleCategoryClick(null)} type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
            </div>
            <div class="modal-body">
                <input on:keyup={handleCategorySearchKeyup} type="text" id="category-search" class="form-control">
                {#await categories}
                    <p>Loading...</p>
                {:then categoriesData}
                    {#if categoriesData.length > 0}
                        <div class="list-group mt-3">
                            {#each categoriesData as category}
                                <a on:click={() => handleCategoryClick(category)} href="#top" class="list-group-item list-group-item-action">{category.name}</a>
                            {/each}
                        </div>
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