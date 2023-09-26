<script>
    import { goto } from "$app/navigation";
    import Pagination from "$lib/Pagination.svelte";
    import UserList from "$lib/UserList.svelte";
    import { fetchServer } from "$lib/fetch";

    let keyword = "";
    let paginationCurrentPage = 1;

    let selectedClaim = {};

    $: usersPromise = (searchUsers)(keyword, null, paginationCurrentPage);

    async function searchUsers(keyword = "", claimId = null, currentPage = 1) {
        const returnData = {
            users: [],
            pagination: {
                page: 1,
                totalPages: 1
            }
        };

        let searchParams = "";
        if (claimId) searchParams += `claimId=${claimId}`;

        const res = await fetchServer(`users?keyword=${keyword}${searchParams}&page=${currentPage}`);
        const result = await res.json();
        
        
        if (result.payload) returnData.users = result.payload;
        returnData.pagination = result.pagination;
        
        return returnData;
    }
</script>

<div class="container-fluid p-3">
    <h1 class="mb-3">Users</h1>
    <button on:click={() => goto("/users/create")} class="btn-lg btn btn-primary">Create</button>
    <div class="mt-3">
        {#await usersPromise}
            <h1>Loading...</h1>
        {:then { users, pagination }}
            {#if users.length > 0}
                <UserList {users} />
            {:else}
                <h3 class="text-center mt-5 mb-5">No user found.</h3>
            {/if}
            <Pagination
                on:nextPage={() => paginationCurrentPage += 1}
                on:prevPage={() => paginationCurrentPage -= 1}
                totalPages={pagination.totalPages}
                currentPage={pagination.page}
            />
        {/await}
    </div>
</div>