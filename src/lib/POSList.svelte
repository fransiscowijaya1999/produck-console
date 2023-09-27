<script>
    import { goto } from "$app/navigation";
    import { formatDistance } from "date-fns";
    export let posList = [];
</script>

{#if posList.length > 0}
    <table class="table table-hover">
        <thead>
            <tr>
                <th>Name</th>
                <th>Last Session</th>
                <th>Actions</th>
            </tr>
        </thead>
        <tbody>
            {#each posList as pos, i}
                <tr>
                    <th>
                        <a class="link-secondary" href={`/pos/${pos.id}`}>{pos.name}</a>
                    </th>
                    <td>{pos.lastSession ? formatDistance(new Date(pos.lastSession.openedAt), new Date(), { addSuffix: true }) : "Never opened"}</td>
                    <td><button on:click={() => goto(`/possessions/pos/${pos.id}`)} type="button" class="btn btn-sm btn-secondary">sessions</button></td>
                </tr>
            {/each}
        </tbody>
    </table>
{/if}