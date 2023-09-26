<script>
    export let payload = [];
</script>

{#if payload.length > 0}
    <table class="table table-hover">
        <thead>
            <tr>
                <th>Name</th>
                <th>Description</th>
                <th>Contact</th>
            </tr>
        </thead>
        <tbody>
            {#each payload as data, i}
                <tr>
                    <th>
                        <a class="link-secondary link-underline-opacity-0" href={`/vendors/${data.id}`}>{data.name}</a>
                    </th>
                    <td>{data.description ?? ""}</td>
                    <td>{data.contact ?? ""}</td>
                </tr>
            {/each}
        </tbody>
    </table>
{/if}