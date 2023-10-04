<script>
    import { toStringDelimit } from "./numbering";

    export let categories = [];
</script>

{#if categories.length > 0}
    <table class="table table-hover">
        <thead>
            <tr>
                <th>Name</th>
                <th>Min Stock</th>
                <th>Total Stock</th>
                <th>Products Count</th>
                <th>Categories Count</th>
            </tr>
        </thead>
        <tbody>
            {#each categories as category, i}
                <tr>
                    <th>
                        <a class="link-secondary link-underline-opacity-0" href={`/categories/${category.id}`}>{category.name}</a>
                    </th>
                    <td>{toStringDelimit(category.minQty)}</td>
                    <td>
                        {toStringDelimit(category.totalStock)} 
                        {#if category.minQty == category.totalStock}
                            <span class="badge text-bg-warning">just in time</span>
                        {:else}
                            <span class="badge text-bg-danger">{toStringDelimit(category.totalStock - category.minQty)}</span>
                        {/if}
                    </td>
                    <td>{toStringDelimit(category.productsCount)}</td>
                    <td>{toStringDelimit(category.childCategoriesCount)}</td>
                </tr>
            {/each}
        </tbody>
    </table>
{:else if categories.length == 0}
    <h1 class="text-center mt-5 mb-5">No Category yet.</h1>
{:else}
    <h1 class="text-center mt-5 mb-5">Loading...</h1>
{/if}