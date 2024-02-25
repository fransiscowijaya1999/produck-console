<script>
    import { createEventDispatcher } from "svelte";

    export let name = "";
    export let minQty = 0;
    /** @type {* | null}*/
    export let category = null;

    const dispatch = createEventDispatcher();

    function handleResetCategoryClick() {
        category = null;
    }

    function handleSelectCategoryClick() {
        dispatch("handleSelectCategoryClick");
    }
</script>

<div class="mb-3">
    <label for="category-name" class="form-label">Name</label>
    <input bind:value={name} type="text" id="category-name" class="form-control" autocomplete="off" required>
</div>
<div class="mb-3">
    <label for="category-minqty" class="form-label">Minimum Stock</label>
    <input bind:value={minQty} type="number" id="category-minqty" class="form-control" required>
</div>
<div class="mb-3">
    <label for="parent-category" class="form-label">Parent Category</label>
    <div class="input-group">
        <button on:click={handleSelectCategoryClick} class="btn btn-secondary">Select Category</button>
        <input value={category ? category.name : ""} type="text" id="parent-category" readonly class="form-control">
        <button on:click={handleResetCategoryClick} class="btn btn-danger">Reset</button>
    </div>
</div>