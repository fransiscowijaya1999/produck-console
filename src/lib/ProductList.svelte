<script>
    export let products = [];
</script>

{#if products.length > 0}
    <div class="content">
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
    </div>
{:else if products.length == 0}
    <div class="content">
        <h1 class="content-title font-size-22">No products yet.</h1>
    </div>
{:else}
    <div class="content">
        <h1 class="content-title font-size-22">Loading...</h1>
    </div>
{/if}