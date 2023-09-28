<script>
    import { fetchServer } from "$lib/fetch";
    import { createEventDispatcher } from "svelte";

    import Pagination from "$lib/Pagination.svelte";

    export let authToken = "";

    const dispatch = createEventDispatcher();

    /** @type {number} */
    let keywordTimer;
    /** @type {string} */
    let keyword = "";
    let listCurrentPage = 1;

    $: usersPromise = (searchUsers)(keyword, listCurrentPage);

    /** @param {*} event */
    const keywordDebounce = (event = { target: { value: "" } }) => {
        clearTimeout(keywordTimer);
        keywordTimer = setTimeout(() => {
            keyword = event.target.value;
            listCurrentPage = 1;
        }, 500);
    }

    /** @param {*} user */
    function handleUserClick(user) {
        dispatch("handleUserClick", { user });
    }

    async function searchUsers(keyword = "", currentPage = 1) {
        const returnData = {
            payload: [],
            pagination: {
                totalPages: 1,
                page: 1
            }
        };

        const res = await fetchServer(`users/?keyword=${keyword}&page=${currentPage}`, {
            headers: { "Authorization": `Bearer ${authToken}` }
        });
        const result = await res.json();

        if (result.payload) {
            returnData.payload = result.payload;
            returnData.pagination = result.pagination;
        }

        if (!result.payload && listCurrentPage > 1) listCurrentPage -= 1;

        return returnData;
    }
</script>

<div class="modal" style="z-index: 9999;">
    <div class="modal-dialog">
        <div class="modal-content">
            <div class="modal-header">
                <h1 class="modal-title fs-5">Select User</h1>
                <button on:click={() => dispatch("handleModalClose")} type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
            </div>
            <div class="modal-body">
                <input on:keyup={keywordDebounce} type="text" id="keyword" class="form-control">
                {#await usersPromise}
                    <h3>Loading...</h3>
                {:then { payload, pagination }}
                    {#if payload.length > 0}
                        <div class="list-group mt-3 mb-2">
                            {#each payload as user}
                                <a on:click={() => handleUserClick(user)} href="#top" class="list-group-item list-group-item-action">{user.username}{user.name ? ` - ${user.name}` : ""}</a>
                            {/each}
                        </div>
                        <Pagination
                            on:prevPage={() => listCurrentPage -= 1}
                            on:nextPage={() => listCurrentPage += 1}
                            totalPages={pagination.totalPages}
                            currentPage={pagination.page}
                        />
                    {/if}
                {:catch error}
                    <p>{error}</p>
                {/await}
            </div>
        </div>
    </div>
</div>

<style>
    @import "./style.css";
</style>