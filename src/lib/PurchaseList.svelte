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
                <th>Vendor</th>
                <th>Source Document</th>
                <th>Total Cost</th>
                <th>Memo</th>
                <th>Delivery</th>
            </tr>
        </thead>
        <tbody>
            {#each payload as data, i}
                <tr>
                    <th>
                        <a class="link-secondary link-underline-opacity-0" href={`/purchases/${data.id}`}>{simpleDateTime(data.date)}</a>
                    </th>
                    <td>{data.vendor.name}</td>
                    <td>{data.sourceDocument ?? ""}</td>
                    <td>{data.totalCost ? toStringDelimit(data.totalCost) : ""}</td>
                    <td class="specific-w-350">
                        {#if data.memo.length > 0}
                            <div class="card text-bg-light">
                                <div class="card-body p-2">
                                    <div class="card-text">
                                        {data.memo}
                                    </div>
                                </div>
                            </div>
                        {/if}
                    </td>
                    <td>
                        {#if data.allDelivered}
                            <span class="badge text-bg-success">All delivered</span>
                        {:else}
                            <span class="badge text-bg-warning">Not yet delivered</span>
                        {/if}
                    </td>
                </tr>
            {/each}
        </tbody>
    </table>
{/if}