<script>
    import axios from "axios";

    import ProductForm from "$lib/ProductForm.svelte";
    import SelectCategoryModal from "$lib/modals/SelectCategoryModal.svelte";

    const productRaw = {
        name: "",
        price: 0,
        cost: 0,
        barcode: "",
        categoryId: null,
        category: null
    };

    let showSelectCategoryModal = false;
    let errorMessage = "";
    let successMessage = "";

    let buttonState = "normal";
    let product = Object.assign({}, productRaw);

    function handleSelectCategoryClick() {
        showSelectCategoryModal = !showSelectCategoryModal;
    }

    function handleCategoryClick(event) {
        showSelectCategoryModal = false;
        product.category = event.detail.category;
    }

    async function saveProduct() {
        try {
            buttonState = "saving"

            product.categoryId = product.category ? product.category.id : null;
            await axios.post("/products", product);

            successMessage = "Product saved.";
            product = Object.assign({}, productRaw);
            buttonState = "normal";

            setTimeout(() => successMessage = "", 5000);
        } catch (error) {
            const res = error.response.data;
            if (res.isError) errorMessage = res.responseException.exceptionMessage;

            buttonState = "normal";
        }
    }
</script>

{#if showSelectCategoryModal}
    <SelectCategoryModal on:handleCategoryClick={handleCategoryClick} />
{/if}
<div class="container-fluid">
    <button class="btn btn-secondary mt-3" on:click={() => history.back()}>Back</button>
    <h1>New Product</h1>
    <div class="form-wrapper specific-w-350">
        <ProductForm on:handleSelectCategoryClick={handleSelectCategoryClick} bind:category={product.category} bind:name={product.name} bind:price={product.price} bind:cost={product.cost} bind:barcode={product.barcode} />
        <button on:click={saveProduct} class="btn btn-primary btn-lg mt-3" class:disabled={buttonState == "saving"} type="button">
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