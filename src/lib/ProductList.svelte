<script>
    export let products = [];
</script>

{#if products.length > 0}
    <table class="table table-hover">
        <thead>
            <tr>
                <th><input type="checkbox" name="selectAll" id="selectAll"></th>
                <th>Name</th>
                <th>Price</th>
                <th>Cost</th>
                <th>Stock</th>
            </tr>
        </thead>
        <tbody>
            {#each products as product, i}
                <tr>
                    <th><input bind:value={product.selected} type="checkbox" name="select-{i}" id="select-{i}"></th>
                    <th><a href="/products/{product.id.toString()}">{product.name}</a></th>
                    <th>{product.price}</th>
                    <th>{product.cost}</th>
                    <th>{product.stock}</th>
                </tr>
            {/each}
        </tbody>
    </table>
{:else if products.length == 0}
    <h1 class="text-center mt-5 mb-5">No products yet.</h1>
{:else}
    <h1 class="text-center mt-5 mb-5">Loading...</h1>
{/if}