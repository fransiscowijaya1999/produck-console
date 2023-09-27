<script>
    import { toStringDelimit } from "$lib/numbering";
    import { format } from "date-fns";

    export let payload = [];

    function simpleDateTime(datetime) {
        return format(new Date(datetime), "dd MMM yyyy '-' hh:mm a");
    }
</script>

{#if payload.length > 0}
    <table class="table table-hover">
        <thead>
            <tr>
                <th>Created at</th>
                <th>Total Price</th>
                <th>Total Cost</th>
                <th>Served by</th>
            </tr>
        </thead>
        <tbody>
            {#each payload as item, i}
                <tr>
                    <th>
                        <a class="link-secondary link-underline-opacity-0" href={`/orderitems/orders/${item.id}`}>
                            {#if item.hasReturn}
                                <span class="badge text-bg-danger">has return</span>
                            {/if}
                            {simpleDateTime(item.createdAt)}
                        </a>
                    </th>
                    <td>{toStringDelimit(item.totalPrice)}</td>
                    <td>{toStringDelimit(item.totalCost)}</td>
                    <td>{item.servedBy.username}</td>
                </tr>
            {/each}
        </tbody>
    </table>
{/if}