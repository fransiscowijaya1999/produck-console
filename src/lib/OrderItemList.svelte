<script>
    import { toStringDelimit } from "$lib/numbering";

    export let payload = [];
</script>

{#if payload.length > 0}
    <table class="table table-hover">
        <thead>
            <tr>
                <th>Product</th>
                <th>Price</th>
                <th>Cost</th>
                <th>Qty</th>
            </tr>
        </thead>
        <tbody>
            {#each payload as item, i}
                <tr>
                    <th>
                        <a class="link-secondary link-underline-opacity-0" href={`/products/${item.product.id}`}>
                            {#if item.isReturn}
                                <span class="badge text-bg-danger">return</span>
                            {/if}
                            {item.product.name}
                        </a>
                    </th>
                    <td>{toStringDelimit(item.price)}</td>
                    <td>{toStringDelimit(item.cost)}</td>
                    <td>{toStringDelimit(item.qty)}</td>
                </tr>
            {/each}
        </tbody>
    </table>
{/if}