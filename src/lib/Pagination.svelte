<script>
    import { createEventDispatcher } from "svelte";

    export let totalPages = 1;
    export let currentPage = 1;

    const dispatch = createEventDispatcher();

    const prevPage = () => {
        dispatch("prevPage");
    };
    const nextPage = () => {
        dispatch("nextPage");
    };
</script>

<nav class="d-flex justify-content-center">
    <ul class="pagination">
        <li class="page-item" class:disabled={currentPage == 1}><a on:click={prevPage} class="page-link">{"<"}</a></li>
        <li class="page-item" class:disabled={currentPage == totalPages}><a on:click={nextPage} class="page-link">{">"}</a></li>
    </ul>
</nav>