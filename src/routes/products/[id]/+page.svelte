<script>
    import ProductForm from "$lib/ProductForm.svelte";

    /** @type {import('./$types').PageData} */
	export let data;

    let buttonState = "normal";
    let { name, price, cost, barcode } = data.payload;

    function saveProduct() {
        
    }
</script>

<div class="container-fluid">
    <button class="btn btn-secondary mt-3" on:click={() => history.back()}>Back</button>
    <h1>Product</h1>
    <div class="specific-w-350">
        <ProductForm {name} {price} {cost} {barcode} />
    </div>
    <button on:click={saveProduct} class="btn btn-primary btn-lg mt-3" type="button">
        {#if buttonState == "normal"}
            Save
        {:else if buttonState == "saving"}
            Saving...
        {/if}
    </button>
</div>