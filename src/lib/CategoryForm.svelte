<script>
    import { createEventDispatcher } from "svelte";

    export let name = "";
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
    <label for="product-name" class="form-label">Name</label>
    <input bind:value={name} type="text" id="product-name" class="form-control" required>
</div>
<div class="mb-3">
    <label for="product-category" class="form-label">Category</label>
    <div class="input-group">
        <button on:click={handleSelectCategoryClick} class="btn btn-secondary">Select Category</button>
        <input value={category ? category.name : ""} type="text" id="product-category" readonly class="form-control">
        <button on:click={handleResetCategoryClick} class="btn btn-danger">Reset</button>
    </div>
</div>