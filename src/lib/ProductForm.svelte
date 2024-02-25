<script>
    import { displayMargin } from "./marginCalculator";
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

    function handleNameKeyup() {
        dispatch("handleNameKeyup");
    }

    /** @param {InputEvent} e*/
    function priceBlurHandler(e) {
        if (!e.currentTarget) return;
        const tempValue = parseInt(e.currentTarget.value.replace(/\D/g,''));

        if (isNaN(tempValue)) {
            price = 0;
            return;
        }

        price = tempValue;
    }

    /** @param {InputEvent} e*/
    function costBlurHandler(e) {
        if (!e.currentTarget) return;
        const tempValue = parseInt((e.currentTarget).value.replace(/\D/g,''));

        if (isNaN(tempValue)) {
            cost = 0;
            return;
        }

        cost = tempValue;
    }
</script>

<div>
    <div class="mb-3">
        <label for="product-name" class="form-label">Name</label>
        <input autocomplete="off" bind:value={name} type="text" id="product-name" class="form-control" required>
    </div>
    <div class="mb-3">
        <label for="product-price" class="form-label">Price {@html displayMargin(price, cost)}</label>
        <input autocomplete="off" on:blur={priceBlurHandler} value={priceFormatted} type="text" id="product-price" class="form-control">
    </div>
    <div class="mb-3">
        <label for="product-cost" class="form-label">Cost</label>
        <input autocomplete="off" on:blur={costBlurHandler} value={costFormatted} type="text" id="product-cost" class="form-control">
    </div>
    <div class="mb-3">
        <label for="product-barcode" class="form-label">Barcode</label>
        <input autocomplete="off" bind:value={barcode} type="text" id="product-barcode" class="form-control">
    </div>
    <div class="mb-3">
        <label for="product-category" class="form-label">Category</label>
        <div class="input-group">
            <button on:click={handleSelectCategoryClick} class="btn btn-secondary">Select Category</button>
            <input value={category ? category.name : ""} type="text" id="product-category" readonly class="form-control">
            <button on:click={handleResetCategoryClick} class="btn btn-danger">Reset</button>
        </div>
    </div>
</div>