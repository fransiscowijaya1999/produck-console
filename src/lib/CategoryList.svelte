<script>
    export let categories = [];
</script>

{#if categories.length > 0}
    <table class="table table-hover">
        <thead>
            <tr>
                <th><input type="checkbox" name="selectAll" id="selectAll"></th>
                <th>Name</th>
                <th>Products Count</th>
                <th>Categories Count</th>
            </tr>
        </thead>
        <tbody>
            {#each categories as category, i}
                <tr>
                    <th><input bind:value={category.selected} type="checkbox" name="select-{i}" id="select-{i}"></th>
                    <th><a href="/categories/{category.id.toString()}">{category.name}</a></th>
                    <th>{category.productsCount}</th>
                    <th>{category.childCategoriesCount}</th>
                </tr>
            {/each}
        </tbody>
    </table>
{:else if categories.length == 0}
    <h1 class="text-center mt-5 mb-5">No Category yet.</h1>
{:else}
    <h1 class="text-center mt-5 mb-5">Loading...</h1>
{/if}