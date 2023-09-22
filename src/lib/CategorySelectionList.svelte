<script>
    import { createEventDispatcher } from "svelte";

    export let categories = [];

    const dispatch = createEventDispatcher();

    function selectCategory(category) {
        dispatch("selectCategory", { category });
    }
</script>

{#if categories.length > 0}
    <table class="table table-hover">
        <thead>
            <tr>
                <th>Name</th>
                <th>Products Count</th>
                <th>Categories Count</th>
            </tr>
        </thead>
        <tbody>
            {#each categories as category, i}
                <tr>
                    <th><a href="/products" on:click={() => selectCategory(category)}>{category.name}</a></th>
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