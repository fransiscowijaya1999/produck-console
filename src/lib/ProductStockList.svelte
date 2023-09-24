<script>
    import { createEventDispatcher } from "svelte";

    const dispatch = createEventDispatcher();

    export let stocks = [];

    let currentEditStock = null;
    let stockInputElement;

    function deleteStock(stockId) {
        dispatch("deleteStock", { stockId });
    }

    function handleStockInputKeyup(event, stockId) {
        if (event.key == "Escape") currentEditStock = null;
        if (event.key == "Enter") {
            const stock = parseInt(event.target.value);
            const dispatchData = {
                id: stockId,
                stock
            };

            dispatch("updateStock", { stock: dispatchData });
            currentEditStock = null;
        }
    }
</script>

{#if stocks.length > 0}
    <table class="table table-hover">
        <thead>
            <tr>
                <th>Name</th>
                <th>Stock</th>
                <th>Actions</th>
            </tr>
        </thead>
        <tbody>
            {#each stocks as stock, i}
                <tr>
                    <th>
                        <span>{stock.product.name}</span>
                    </th>
                    <td>
                        {#if currentEditStock == i}
                            <input bind:this={stockInputElement} on:keyup={(event) => handleStockInputKeyup(event, stock.id)} class="form-control specific-w-150" type="number" id={`stock-input-${i}`} placeholder={stock.stock}>
                        {:else}
                            {stock.stock}
                            <button on:click={() => currentEditStock = i} class="btn btn-secondary btn-sm ms-2">edit</button>
                        {/if}
                    </td>
                    <td>
                        <button on:click={() => deleteStock(stock.id)} class="btn btn-sm btn-outline-danger">x</button>
                    </td>
                </tr>
            {/each}
        </tbody>
    </table>
{:else if stocks.length == 0}
    <h1 class="text-center mt-5 mb-5">No Stock yet.</h1>
{:else}
    <h1 class="text-center mt-5 mb-5">Loading...</h1>
{/if}