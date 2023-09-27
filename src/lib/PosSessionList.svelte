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
                <th>Opened At</th>
                <th>Opening Balance</th>
                <th>Closed At</th>
                <th>Closing Balance</th>
            </tr>
        </thead>
        <tbody>
            {#each payload as item, i}
                <tr>
                    <th>
                        <a class="link-secondary link-underline-opacity-0" href={`/orders/possessions/${item.id}`}>{simpleDateTime(item.openedAt)}</a>
                    </th>
                    <td>{toStringDelimit(item.openingBalance)}</td>
                    <td>{item.closedAt ? simpleDateTime(item.closedAt) : "Not closed yet"}</td>
                    <td>{toStringDelimit(item.closingBalance)}</td>
                </tr>
            {/each}
        </tbody>
    </table>
{/if}