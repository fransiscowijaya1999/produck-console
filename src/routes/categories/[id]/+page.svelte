<script>
    import SelectCategoryModal from '$lib/modals/SelectCategoryModal.svelte';
    import CategoryForm from '$lib/CategoryForm.svelte';
    import { fetchServer } from '$lib/fetch.js';

    export let data;

    let category = data.payload;

    let showSelectCategoryModal = false;
    let buttonState = "normal";
    let errorMessage = "";
    let successMessage = "";

    /** @param {*} event */
    function handleCategoryClick(event) {
        showSelectCategoryModal = false;
        category.parentCategory = event.detail.category;
    }
    function handleSelectCategoryClick() {
        showSelectCategoryModal = !showSelectCategoryModal;
    }

    async function saveCategory() {
        try {
            buttonState = "saving";

            const parentCategoryId = category.parentCategory ? category.parentCategory.id : null;
            const body = {
                name: category.name,
                minQty: category.minQty,
                productCategoryId: parentCategoryId
            }
            const res = await fetchServer(`categories/${category.id}`, {
                method: "PUT",
                headers: { "Content-Type": "application/json", "Authorization": `Bearer ${data.authToken}` },
                body: JSON.stringify(body)
            });

            if (res.status != 204) {
                const result = await res.json();
                if (result.isError) return errorMessage = result.responseException.exceptionMessage;
            }

            successMessage = "Category saved.";
            setTimeout(() => successMessage = "", 5000);
        } catch (/** @type {*} */ error) {
            errorMessage = error;
        } finally {
            buttonState = "normal";
        }
    }
</script>

{#if showSelectCategoryModal}
    <SelectCategoryModal authToken={data.authToken} excludeId={data.payload.id} on:handleCategoryClick={handleCategoryClick} />
{/if}
<div class="container-fluid">
    <button class="btn btn-secondary mt-3" on:click={() => history.back()}>Back</button>
    <h1 class="mt-3">Edit Category</h1>
    <div class="form-wrapper specific-w-350">
        <CategoryForm
            on:handleSelectCategoryClick={handleSelectCategoryClick}
            bind:name={category.name}
            bind:minQty={category.minQty}
            bind:category={category.parentCategory} />
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