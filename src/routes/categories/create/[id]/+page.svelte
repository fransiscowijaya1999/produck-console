<script>
    import CategoryForm from "$lib/CategoryForm.svelte";
    import { fetchServer } from "$lib/fetch";
    import SelectCategoryModal from "$lib/modals/SelectCategoryModal.svelte";

    export let data;

    const authHeader = { "Authorization": `Bearer ${data.authToken}`};

    let buttonState = "normal";
    let errorMessage = "";
    let successMessage = "";
    let showSelectCategoryModal = false;

    let name = "";
    let minQty = 0;
    /** @type {* | null} */
    let parentCategory = data ? data.payload : null;

    $: lastSelectedCategory = parentCategory ? parentCategory.id : null;
    $: categoriesPromise = (searchCategories)(name, lastSelectedCategory);

    /** @param {*} event */
    function handleCategoryClick(event) {
        showSelectCategoryModal = false;
        parentCategory = event.detail.category;
    }
    function handleSelectCategoryClick() {
        showSelectCategoryModal = !showSelectCategoryModal;
    }

    async function saveCategory() {
        try {
            buttonState = "saving";

            const parentCategoryId = parentCategory ? parentCategory.id : null;
            const category = {
                name: name,
                minQty: minQty,
                productCategoryId: parentCategoryId
            }
            const res = await fetchServer("categories", {
                method: "POST",
                headers: { "Content-Type": "application/json", "Authorization": `Bearer ${data.authToken}` },
                body: JSON.stringify(category)
            });

            const result = await res.json();

            if (result.isError) return errorMessage = result.responseException.exceptionMessage;

            successMessage = "Category saved.";
            name = "";
            minQty = 0;
            parentCategory = null;
            setTimeout(() => successMessage = "", 5000);
        } catch (/** @type {*} */ error) {
            errorMessage = error;
        } finally {
            buttonState = "normal";
        }
    }

    async function searchCategories(keyword = "", parentId = "") {
        let searchParams = "";

        if (parentId) searchParams += `&parentId=${parentId}`;
        if (!parentId) searchParams += `&showOnlyRootChilds=true`;

        const res = await fetchServer(`categories/?keyword=${keyword}${searchParams}&page=1`, {
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

        return returnData;
    }
</script>

{#if showSelectCategoryModal}
    <SelectCategoryModal authToken={data.authToken} on:handleCategoryClick={handleCategoryClick} />
{/if}
<div class="container-fluid">
    <div class="row g-3">
        <div class="col-1"></div>
        <div class="col-3">
            <button class="btn btn-secondary mt-3" on:click={() => history.back()}>Back</button>
            <h1 class="mt-3">New Category</h1>
            <div class="form-wrapper specific-w-350">
                <CategoryForm
                    on:handleSelectCategoryClick={handleSelectCategoryClick}
                    bind:name={name}
                    bind:minQty={minQty}
                    bind:category={parentCategory} />
                <button on:click={saveCategory} class="btn btn-primary btn-lg mt-3" class:disabled={buttonState == "saving"} type="button">
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
            {#if name.length < 1}
                <h3 class="text-secondary text-center mt-5">Type category name</h3>
            {:else}
                {#await categoriesPromise}
                    <h3 class="text-secondary text-center mt-5">Searching...</h3>
                {:then {categories}} 
                    {#if categories.length < 1}
                        <h3 class="text-secondary text-center mt-5">No possible duplicate</h3>
                    {:else}
                        <h3 class="text-secondary text-center mt-5">Possible duplicate</h3>
                        <ul class="list-group">
                            {#each categories as category}
                                <li class="list-group-item">{category.name}</li>
                            {/each}
                        </ul>
                    {/if}
                {/await}
            {/if}
        </div>
    </div>
</div>