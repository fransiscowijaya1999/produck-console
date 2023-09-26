<script>
    export let users = [];
</script>

{#if users.length > 0}
    <table class="table table-hover">
        <thead>
            <tr>
                <th>Username</th>
                <th>Name</th>
                <th>Claims</th>
            </tr>
        </thead>
        <tbody>
            {#each users as user, i}
                <tr>
                    <th><a href="/users/{user.id.toString()}">{user.username}</a></th>
                    <th>{user.name ?? ""}</th>
                    <th>
                        {#if user.claims}
                            {#each user.claims as claim, i}
                                <span class="badge text-bg-secondary">{claim.name}</span>
                            {/each}
                        {/if}
                    </th>
                </tr>
            {/each}
        </tbody>
    </table>
{/if}