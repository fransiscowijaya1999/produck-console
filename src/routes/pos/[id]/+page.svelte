<script>
    import { goto } from "$app/navigation";
    import { fetchServer } from "$lib/fetch";

    import PosForm from "$lib/PosForm.svelte";
    import UserList from "$lib/UserList.svelte";
    import Pagination from "$lib/Pagination.svelte";
    import SelectUserModal from "$lib/modals/SelectUserModal.svelte";

    export let data;

    let buttonState = "normal";
    let errorMessage = "";
    let successMessage = "";

    let pos = data.payload;

    let showSelectUserModal = false;
    let usersKeyword = "";
    let paginationCurrentPage = 1;

    $: usersPromise = (searchUsers)(usersKeyword, pos.id, paginationCurrentPage)

    async function searchUsers(keyword = "", posId = data.payload.id, currentPage = 1) {
        const returnData = {
            payload: [],
            pagination: {
                page: 1,
                totalPages: 1
            }
        };

        const res = await fetchServer(`users?keyword=${keyword}&posId=${posId}&page=${currentPage}`);
        const result = await res.json();

        if (result.payload) returnData.payload = result.payload;
        returnData.pagination = result.pagination;

        return returnData;
    }

    async function savePos() {
        try {
            buttonState = "saving";

            const res = await fetchServer(`pos/${pos.id}`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(pos)
            });
            
            if (res.status != 204) {
                const result = await res.json();
                if (result.isError) return errorMessage = result.responseException.exceptionMessage;
            }

            successMessage = "POS saved";
        } catch (/** @type {*} */ error) {
            errorMessage = error;
        } finally {
            buttonState = "normal";
            setTimeout(() => successMessage = "", 5000);
            setTimeout(() => errorMessage = "", 5000);
        }
    }

    async function deletePos() {
        try {
            const res = await fetchServer(`pos/${pos.id}`, {
                method: "DELETE"
            });
    
            if (res.status != 204) {
                const result = await res.json();
                if (result.isError) return errorMessage = result.responseException.exceptionMessage;
            }

            goto("/pos");
        } catch (/** @type {*} */ error) {
            errorMessage = error;
        } finally {
            buttonState = "normal";
            setTimeout(() => successMessage = "", 5000);
            setTimeout(() => errorMessage = "", 5000);
        }
    }

    async function assignUser(event) {
        try {
            const assignment = {
                posId: pos.id,
                userId: event.detail.user.id
            };

            const res = await fetchServer("users/assign/pos", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(assignment)
            });

            if (res.status != 204) {
                const result = await res.json();
                if (result.isError) return errorMessage = result.responseException.exceptionMessage;
            }

            usersPromise = (searchUsers)(usersKeyword, pos.id, paginationCurrentPage);
        } catch (/** @type {*} */ error) {
            errorMessage = error;
        } finally {
            buttonState = "normal";
            setTimeout(() => successMessage = "", 5000);
            setTimeout(() => errorMessage = "", 5000);
        }
    }
</script>

{#if showSelectUserModal}
    <SelectUserModal on:handleModalClose={() => showSelectUserModal = false} on:handleUserClick={assignUser} />
{/if}

<div class="container-fluid">
    <button class="btn btn-secondary mt-3" on:click={() => history.back()}>Back</button>
    <h1 class="mt-3">Edit POS</h1>
    <div class="form-wrapper specific-w-350">
        <PosForm bind:pos={pos} />
        <div class="d-flex mt-3 gap-2">
            <button on:click={savePos} class="btn btn-primary btn-lg d-block w-100" class:disabled={buttonState == "saving"} type="button">
                {#if buttonState == "normal"}
                    Save
                {:else if buttonState == "saving"}
                    Saving...
                {/if}
            </button>
            <button on:click={deletePos} type="button" class="btn btn-danger btn-lg">Delete</button>
        </div>
        {#if errorMessage}
            <div class="alert alert-danger mt-3">
                {errorMessage}
            </div>
        {:else if successMessage}
            <div class="alert alert-success mt-3">
                {successMessage}
            </div>
        {/if}
    </div>
    <h2 class="mt-5 mb-3">Assigned Users</h2>
    <button on:click={() => showSelectUserModal = true} type="button" class="btn btn-outline-primary btn-lg">Assign User</button>
    {#await usersPromise}
        <h1>Loading...</h1>
    {:then { payload, pagination }}
        {#if payload.length > 0}
            <UserList users={payload} />
            <Pagination
                on:nextPage={() => paginationCurrentPage += 1}
                on:prevPage={() => paginationCurrentPage -= 1}
                totalPages={pagination.totalPages}
                currentPage={pagination.page}
            />
        {:else}
            <h3 class="text-center mt-5 mb-5">No user found.</h3>
        {/if}
    {/await}
    <UserList  />
</div>