    
<script>
    import { goto } from "$app/navigation";
    import { fetchServer } from "$lib/fetch";
    
    import PosForm from "$lib/PosForm.svelte";

    let buttonState = "normal";
    let errorMessage = "";
    let successMessage = "";

    let posRaw = {
        name: "",
        description: ""
    };

    let pos = Object.assign({}, posRaw);

    async function savePos() {
        try {
            buttonState = "saving";

            const res = await fetchServer("pos", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(pos)
            });
            
            if (res.status != 204) {
                const result = await res.json();
                if (result.isError) return errorMessage = result.responseException.exceptionMessage;
            }

            pos = Object.assign({}, posRaw);
            successMessage = "POS saved";
        } catch (/** @type {*} */ error) {
            errorMessage = error;
        } finally {
            buttonState = "normal";
            setTimeout(() => successMessage = "", 5000);
            setTimeout(() => errorMessage = "", 5000);
        }
    }
</script>

<div class="container-fluid">
    <button class="btn btn-secondary mt-3" on:click={() => history.back()}>Back</button>
    <h1 class="mt-3">New POS</h1>
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
</div>