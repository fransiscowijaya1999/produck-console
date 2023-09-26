<script>
    import { formatDistance } from "date-fns";
    export let posList = [];
</script>

{#if posList.length > 0}
    <table class="table table-hover">
        <thead>
            <tr>
                <th>Name</th>
                <th>Last Session</th>
            </tr>
        </thead>
        <tbody>
            {#each posList as pos, i}
                <tr>
                    <th>
                        <a class="link-secondary" href={`/pos/${pos.id}`}>{pos.name}</a>
                    </th>
                    <td>{pos.lastSession ? formatDistance(new Date(pos.lastSession.openedAt), new Date(), { addSuffix: true }) : "Never opened"}</td>
                </tr>
            {/each}
        </tbody>
    </table>
{/if}