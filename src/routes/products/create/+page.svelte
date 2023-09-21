<script>
    import axios from "axios";

    import ProductForm from "$lib/ProductForm.svelte";

    const productRaw = {
        name: "",
        price: 0,
        cost: 0,
        barcode: ""
    };

    let buttonState = "normal";
    let product = Object.assign({}, productRaw);

    async function saveProduct() {
        try {
            buttonState = "saving"

            await axios.post("/products", product);

            product = Object.assign({}, productRaw);
            // Show saved alert
            buttonState = "normal";
        } catch (error) {
            
        }
    }
</script>

<div class="container-fluid">
    <button class="btn btn-secondary mt-3" on:click={() => history.back()}>Back</button>
    <h1>New Product</h1>
    <div class="form-wrapper specific-w-350">
        <ProductForm bind:name={product.name} bind:price={product.price} bind:cost={product.cost} bind:barcode={product.barcode} />
    </div>
    <button on:click={saveProduct} class="btn btn-primary btn-lg mt-3" class:disabled={buttonState == "saving"} type="button">
        {#if buttonState == "normal"}
            Save
        {:else if buttonState == "saving"}
            Saving...
        {/if}
    </button>
</div>