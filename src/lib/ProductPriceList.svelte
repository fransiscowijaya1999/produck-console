<script>
    import { createEventDispatcher } from "svelte";
    import { displayMargin } from "./marginCalculator";

    const dispatch = createEventDispatcher();

    export let product = null;
    export let payload = [];
    let currentPriceEdit = null;
    let currentQtyEdit = null;

    function handleEditQtyKeyup(event, price) {
        if (event.key == "Escape") return currentQtyEdit = null;
        if (event.key == "Enter") {
            const newQty = parseInt(event.target.value);
            const dispatchData = {
                id: price.id,
                minQty: newQty,
                customerId: price.customer.id,
                price: price.price
            };

            dispatch("updateQty", { price: dispatchData });
        }
    }

    function handleEditPriceKeyup(event, price) {
        if (event.key == "Escape") return currentPriceEdit = null;
        if (event.key == "Enter") {
            const newPrice = parseInt(event.target.value);
            const dispatchData = {
                id: price.id,
                minQty: price.minQty,
                customerId: price.customer.id,
                price: newPrice
            };

            dispatch("updatePrice", { price: dispatchData });
        }
    }

    function deletePrice(id) {
        dispatch("deleteOne", { id });
    }
</script>

{#if payload.length > 0}
    <table class="table table-hover">
        <thead>
            <tr>
                <th>Customer</th>
                <th>Min Qty</th>
                <th>Product Price</th>
                <th>Actions</th>
            </tr>
        </thead>
        <tbody>
            {#each payload as data, i}
                <tr>
                    <th>
                        <a class="link-secondary link-underline-opacity-0" href={`/customers/${data.customer.id}`}>{data.customer.name}</a>
                    </th>
                    <td>
                        {#if currentQtyEdit == i}
                            <input on:keyup={event => handleEditQtyKeyup(event, data)} type="number" class="form-control specific-w-100" placeholder={data.minQty}>
                        {:else}
                            <button on:click={() => { currentPriceEdit = null; currentQtyEdit = i; }} type="button" class="btn btn-sm btn-secondary me-2">edit</button>
                            {data.minQty}
                        {/if}
                    </td>
                    <td>
                        {#if currentPriceEdit == i}
                            <input on:keyup={event => handleEditPriceKeyup(event, data)} type="number" class="form-control specific-w-100" placeholder={data.price}>
                        {:else}
                            <button on:click={() => { currentPriceEdit = i; currentQtyEdit = null; }} type="button" class="btn btn-sm btn-secondary me-2">edit</button>
                            {data.price} {@html displayMargin(data.price, product.cost)}
                        {/if}
                    </td>
                    <td>
                        <button on:click={() => deletePrice(data.id)} type="button" class="btn btn-sm btn-danger">x</button>
                    </td>
                </tr>
            {/each}
        </tbody>
    </table>
{/if}