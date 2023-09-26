<script>
    import { goto } from "$app/navigation";

    export let payload = [];
</script>

{#if payload.length > 0}
    <table class="table table-hover">
        <thead>
            <tr>
                <th>Name</th>
                <th>Address</th>
                <th>Phone</th>
                <th>Actions</th>
            </tr>
        </thead>
        <tbody>
            {#each payload as data, i}
                <tr>
                    <th>
                        <a class="link-secondary link-underline-opacity-0" href={`/customers/${data.id}`}>{data.name}</a>
                    </th>
                    <td>{data.address ?? ""}</td>
                    <td>{data.phone ?? ""}</td>
                    <td><button on:click={() => goto(`/prices/customers/${data.id}`)} type="button" class="btn btn-sm btn-secondary">prices</button></td>
                </tr>
            {/each}
        </tbody>
    </table>
{/if}