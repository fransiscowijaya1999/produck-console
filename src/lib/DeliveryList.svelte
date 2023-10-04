<script>
    import { format } from "date-fns";
    import { toStringDelimit } from "./numbering";

    export let payload = [];

    function simpleDateTime(date) {
        return format(new Date(date), "dd MMM yyyy");
    }
</script>

{#if payload.length > 0}
    <table class="table table-hover">
        <thead>
            <tr>
                <th>Date</th>
                <th>Shipper</th>
                <th>Total Cost</th>
                <!-- <th>Source Location</th>
                <th>Target Location</th> -->
                <th>Purchase / Transfer</th>
                <th>Delivery</th>
            </tr>
        </thead>
        <tbody>
            {#each payload as data, i}
                <tr>
                    <th>
                        <a class="link-secondary link-underline-opacity-0" href={`/deliveries/${data.id}`}>{simpleDateTime(data.date)}</a>
                    </th>
                    <td>{data.biller}</td>
                    <td>{data.totalCost ? toStringDelimit(data.totalCost) : 0}</td>
                    <td>
                        {#if data.isPurchase}
                            <span class="badge text-bg-success">purchase</span>
                        {:else}
                            <span class="badge text-bg-secondary">transfer</span>
                        {/if}
                    </td>
                    <td>
                        {#if data.isDelivered}
                            <span class="badge text-bg-success">Delivered</span>
                        {:else}
                            <span class="badge text-bg-warning">Not yet delivered</span>
                        {/if}
                    </td>
                </tr>
            {/each}
        </tbody>
    </table>
{/if}