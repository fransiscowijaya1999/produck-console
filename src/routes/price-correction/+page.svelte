<script>
    import { displayMargin } from "$lib/marginCalculator";
    import { toStringDelimit } from "$lib/numbering";

    export let data;

    let products = data.payload ? data.payload : [];
</script>

<div class="container-fluid p-3">
    <h1 class="content-title mb-3">Price Correction</h1>
    {#if products.length > 0}
        <table class="table table-hover">
            <thead>
                <tr>
                    <th>Name</th>
                    <th>Price</th>
                    <th>Cost</th>
                    <th>Margin</th>
                </tr>
            </thead>
            <tbody>
                {#each products as product, i}
                    <tr>
                        <th><a href="/products/{product.id.toString()}">{product.name}</a></th>
                        <th>{toStringDelimit(product.price)}</th>
                        <th>{toStringDelimit(product.cost)}</th>
                        <th>{@html displayMargin(product.price, product.cost)}</th>
                    </tr>
                {/each}
            </tbody>
        </table>
    {:else if products.length == 0}
        <h1 class="text-center mt-5 mb-5">No products yet.</h1>
    {:else}
        <h1 class="text-center mt-5 mb-5">Loading...</h1>
    {/if}
</div>