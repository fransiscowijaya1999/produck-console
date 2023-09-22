<script>
    import { createEventDispatcher } from "svelte";

    export let name = "";
    export let price = 0;
    export let cost = 0;
    export let barcode = "";
    /** @type {* | null} */
    export let category = null;

    const dispatch = createEventDispatcher();
    const currencyFormatter = new Intl.NumberFormat('en-US');

    $: priceFormatted = currencyFormatter.format(price);
    $: costFormatted = currencyFormatter.format(cost);

    function handleResetCategoryClick() {
        category = null;
    }

    function handleSelectCategoryClick() {
        dispatch("handleSelectCategoryClick");
    }

    function priceBlurHandler(e) {
        const tempValue = parseInt(e.currentTarget.value.replace(/\D/g,''));

        if (isNaN(tempValue)) {
            price = 0;
            return;
        }

        price = tempValue;
    }

    function costBlurHandler(e) {
        const tempValue = parseInt(e.currentTarget.value.replace(/\D/g,''));

        if (isNaN(tempValue)) {
            cost = 0;
            return;
        }

        cost = tempValue;
    }
</script>

<div class="mb-3">
    <label for="product-name" class="form-label">Name</label>
    <input bind:value={name} type="text" id="product-name" class="form-control" required>
</div>
<div class="mb-3">
    <label for="product-price" class="form-label">Price</label>
    <input on:blur={priceBlurHandler} value={priceFormatted} type="text" id="product-price" class="form-control">
</div>
<div class="mb-3">
    <label for="product-cost" class="form-label">Cost</label>
    <input on:blur={costBlurHandler} value={costFormatted} type="text" id="product-cost" class="form-control">
</div>
<div class="mb-3">
    <label for="product-barcode" class="form-label">Barcode</label>
    <input bind:value={barcode} type="text" id="product-barcode" class="form-control">
</div>
<div class="mb-3">
    <label for="product-category" class="form-label">Category</label>
    <div class="input-group">
        <button on:click={handleSelectCategoryClick} class="btn btn-secondary">Select Category</button>
        <input value={category ? category.name : ""} type="text" id="product-category" readonly class="form-control">
        <button on:click={handleResetCategoryClick} class="btn btn-danger">Reset</button>
    </div>
</div>