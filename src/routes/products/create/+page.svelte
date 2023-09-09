<script>
    import { goto } from "$app/navigation";
    import ProductForm from "$lib/ProductForm.svelte";

    let buttonState = "normal";
    let product = {
        name: "",
        price: 0,
        cost: 0,
        barcode: ""
    };

    async function saveProduct() {
        try {
            buttonState = "saving"

            // Save the product
            console.log(product);
            await new Promise(resolve => setTimeout(resolve, 1000));

            // Go to products/{id}
            goto("/products");
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
    <button on:click={saveProduct} class="btn btn-primary btn-lg mt-3" type="button">
        {#if buttonState == "normal"}
            Save
        {:else if buttonState == "saving"}
            Saving...
        {/if}
    </button>
</div>