<script>
    import { goto } from "$app/navigation";
    import ProductList from "$lib/ProductList.svelte";

    let queryType = "products";
    // Used to search products within this category
    let selectedCategories = [
        {
            id: 1,
            name: "Bearing"
        },
        {
            id: 2,
            name: "NKN"
        }
    ];
    let products = [
        {
            id: 1,
            name: "NKN 6201",
            price: 10,
            cost: 7,
            stock: 200,
            selected: false
        }
    ];

    $: selectedProducts = products.filter(p => p.selected);
</script>

<div class="container-fluid p-3">
    <h1 class="content-title mb-3">Products</h1>
    <div class="d-flex gap-2">
        <button class="btn btn-primary btn-lg" on:click={() => goto("/products/create")}>Create</button>
        {#if selectedProducts.length > 0}<button type="button" class="btn btn-secondary">Selected {selectedProducts.length}</button>{/if}
    </div>
    <nav class="mt-3" aria-label="Product Category Breadcrumb">
        <ol class="breadcrumb">
            <li class="breadcrumb-item" class:active={selectedCategories.length == 0}>
                {#if selectedCategories.length == 0}
                    All
                {:else}
                    <a href="/products" on:click={() => selectedCategories = []}>All</a>
                {/if}
            </li>
            {#each selectedCategories as selectedCategory, i}
                {#if i == selectedCategories.length - 1}
                    <li class="breadcrumb-item active" aria-current="page">{selectedCategory.name}</li>
                {:else}
                    <li class="breadcrumb-item"><a href="/products">{selectedCategory.name}</a></li>
                {/if}
            {/each}
        </ol>
    </nav>
    <div class="input-group mb-2 specific-w-350">
        <input type="text" class="form-control mr-10 w-quarter" placeholder="Search {queryType}">
        <button on:click={() => queryType == "products" ? queryType = "categories" : queryType = "products" } type="button" class="btn btn-secondary">
            {#if queryType == "products"}
                Products
            {:else if queryType == "categories"}
                Categories
            {/if}
        </button>
    </div>
    {#if queryType == "products"}
        <ProductList bind:products={products} />
    {:else if queryType == "categories"}
        <h2>Categories</h2>
    {/if}
</div>