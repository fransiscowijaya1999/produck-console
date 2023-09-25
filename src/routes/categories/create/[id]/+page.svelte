<script>
    import CategoryForm from "$lib/CategoryForm.svelte";
    import { fetchServer } from "$lib/fetch";
    import SelectCategoryModal from "$lib/modals/SelectCategoryModal.svelte";

    export let data;

    let buttonState = "normal";
    let errorMessage = "";
    let successMessage = "";
    let showSelectCategoryModal = false;

    let name = "";
    /** @type {* | null} */
    let parentCategory = data ? data.payload : null;

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
                productCategoryId: parentCategoryId
            }
            const res = await fetchServer("categories", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(category)
            });

            const result = await res.json();

            if (result.isError) return errorMessage = result.responseException.exceptionMessage;

            successMessage = "Category saved.";
            name = "";
            parentCategory = null;
            setTimeout(() => successMessage = "", 5000);
        } catch (/** @type {*} */ error) {
            errorMessage = error;
        } finally {
            buttonState = "normal";
        }
    }
</script>

{#if showSelectCategoryModal}
    <SelectCategoryModal on:handleCategoryClick={handleCategoryClick} />
{/if}
<div class="container-fluid">
    <button class="btn btn-secondary mt-3" on:click={() => history.back()}>Back</button>
    <h1 class="mt-3">New Category</h1>
    <div class="form-wrapper specific-w-350">
        <CategoryForm
            on:handleSelectCategoryClick={handleSelectCategoryClick}
            bind:name={name}
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