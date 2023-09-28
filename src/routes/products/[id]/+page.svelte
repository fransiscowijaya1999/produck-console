<script>
    import { goto } from "$app/navigation";
    import ProductForm from "$lib/ProductForm.svelte";
    import { fetchServer } from "$lib/fetch";
    import SelectCategoryModal from "$lib/modals/SelectCategoryModal.svelte";

    /** @type {import('./$types').PageData} */
	export let data;

    const authHeader = { "Authorization": `Bearer ${data.authToken}`}

    let errorMessage = "";
    let successMessage = "";

    let showSelectCategoryModal = false;

    let buttonState = "normal";
    let { name, price, cost, barcode, category } = data.payload;

    async function handleDeleteProductClick() {
        try {
            const res = await fetchServer(`products/${data.payload.id}`, {
                method: "DELETE",
                headers: authHeader
            });

            if (res.status != 204) {
                const result = await res.json();
                if (result.isError) return errorMessage = result.responseException.exceptionMessage;
            }

            goto("/products");
        } catch (error) {
            errorMessage = error;
            setTimeout(() => errorMessage = "", 10000);
        }
    }

    /** @param {*} event*/
    function handleCategoryClick(event) {
        showSelectCategoryModal = false;
        category = event.detail.category;
    }

    function handleSelectCategoryClick() {
        showSelectCategoryModal = !showSelectCategoryModal;
    }

    async function saveProduct() {
        try {
            buttonState = "saving";

            const product = {
                name,
                price,
                cost,
                barcode: barcode.length > 0 ? barcode : null,
                categoryId: category ? category.id : null
            };

            const res = await fetchServer(`products/${data.payload.id}`, {
                method: "PUT",
                headers: { "Content-Type": "application/json", ...authHeader },
                body: JSON.stringify(product)
            });

            if (res.status != 204) {
                const result = await res.json();
                if (result.isError) return errorMessage = result.responseException.exceptionMessage;
            }
            
            successMessage = "Product Saved.";
        } catch (/** @type {*} */ error) {
            if (!error.isError) errorMessage = "SvelteKit Error - " + error;
        } finally {
            buttonState = "normal";
            setTimeout(() => errorMessage = "", 5000);
            setTimeout(() => successMessage = "", 5000);
        }
    }
</script>

{#if showSelectCategoryModal}
    <SelectCategoryModal authToken={data.authToken} on:handleCategoryClick={handleCategoryClick} />
{/if}
<div class="container-fluid">
    <button class="btn btn-secondary mt-3" on:click={() => history.back()}>Back</button>
    <h1 class="mt-3">Edit Product</h1>
    <div class="specific-w-350">
        <ProductForm on:handleSelectCategoryClick={handleSelectCategoryClick}
            bind:name={name}
            bind:price={price}
            bind:cost={cost}
            bind:barcode={barcode}
            bind:category={category} />
        <div class="d-flex mt-3 gap-2">
            <button on:click={saveProduct} class="d-block w-100 btn btn-primary btn-lg" type="button">
                {#if buttonState == "normal"}
                    Save
                {:else if buttonState == "saving"}
                    Saving...
                {/if}
            </button>
            <button on:click={handleDeleteProductClick} class="d-block w-25 btn btn-danger btn-lg">Delete</button>
        </div>
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