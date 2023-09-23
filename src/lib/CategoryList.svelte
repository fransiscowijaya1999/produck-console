<script>
    import { goto } from "$app/navigation";
    import { createEventDispatcher } from "svelte";

    export let categories = [];

    const dispatch = createEventDispatcher();

    function selectCategory(category) {
        dispatch("selectCategory", { category });
    }

    function deleteCategory(categoryId) {
        dispatch("deleteCategory", { categoryId });
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
                    <th>
                        <button on:click={() => deleteCategory(category.id)} class="btn btn-sm btn-outline-danger me-1">x</button>
                        <button on:click={() => goto(`/categories/${category.id}`)} class="btn btn-sm btn-secondary me-1">edit</button>
                        <a href="/categories" on:click={() => selectCategory(category)}>{category.name}</a>
                    </th>
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