<script>
    import { fetchServer } from "$lib/fetch";
    import SelectVendorModal from "$lib/modals/SelectVendorModal.svelte";
    import Pagination from "$lib/Pagination.svelte";
    
    import PurchaseForm from "$lib/PurchaseForm.svelte";
    import PurchaseOrderList from "$lib/PurchaseOrderList.svelte";

    export let data;

    let buttonState = "normal";
    let errorMessage = "";
    let successMessage = "";
    let showVendorModal = false;
    let listCurrentPage = 1;

    let purchase = data.payload;

    $: searchPromise = (search)(purchase.id, listCurrentPage);

    async function search(purchaseId = purchase.id, currentPage = 1) {
        const returnData = {
            payload: [],
            pagination: {
                totalPages: 1,
                page: 1
            }
        };

        const res = await fetchServer(`purchaseorders/purchases/${purchaseId}?page=${currentPage}&pageSize=50`, {
            headers: { "Authorization": `Bearer ${data.authToken}`}
        });
        const result = await res.json();

        if (result.payload) {
            returnData.payload = result.payload;
            returnData.pagination = result.pagination;
        }

        if (!result.payload && listCurrentPage > 1) listCurrentPage -= 1;

        return returnData;
    }

    async function save() {
        const payload = Object.assign({}, purchase);
        payload.vendorId = payload.vendor.id;

        try {
            buttonState = "saving";

            const res = await fetchServer(`purchases/${purchase.id}`, {
                method: "PUT",
                headers: { "Content-Type": "application/json", "Authorization": `Bearer ${data.authToken}` },
                body: JSON.stringify(payload)
            });
            
            if (res.status != 204) {
                const result = await res.json();
                if (result.isError) return errorMessage = result.responseException.exceptionMessage;
            }

            successMessage = "Purchase saved";
        } catch (/** @type {*} */ error) {
            errorMessage = error;
        } finally {
            buttonState = "normal";
            setTimeout(() => successMessage = "", 5000);
            setTimeout(() => errorMessage = "", 5000);
        }
    }

    async function addPurchaseOrder(event) {
        const payload = event.detail.purchaseOrder;
        payload.productId = payload.product.id;
        payload.purchaseId = purchase.id;
        payload.quantity = payload.qty;

        try {
            const res = await fetchServer("purchaseorders", {
                method: "POST",
                headers: { "Content-Type": "application/json", "Authorization": `Bearer ${data.authToken}` },
                body: JSON.stringify(payload)
            });
            
            if (res.status != 204) {
                const result = await res.json();
                if (result.isError) return errorMessage = result.responseException.exceptionMessage;
            }

            searchPromise = (search)(purchase.id, listCurrentPage);
        } catch (/** @type {*} */ error) {
            errorMessage = error;
        } finally {
            setTimeout(() => errorMessage = "", 5000);
        }
    }
</script>

{#if showVendorModal}
    <SelectVendorModal on:handleItemClick={(event) => purchase.vendor = event.detail.item} on:handleModalClose={() => showVendorModal = false} authToken={data.authToken} />
{/if}

<div class="container-fluid">
    <button class="btn btn-secondary mt-3" on:click={() => history.back()}>Back</button>
    <h1 class="mt-3">Edit Purchase</h1>
    <div class="form-wrapper border-bottom pb-3">
        <PurchaseForm on:showVendorModal={() => showVendorModal = true} bind:purchase={purchase} />
        <button on:click={save} class="btn btn-primary btn-lg" class:disabled={buttonState == "saving"} type="button">
            {#if buttonState == "normal"}
                Save
            {:else if buttonState == "saving"}
                Saving...
            {/if}
        </button>
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
    {#await searchPromise}
        <h3 class="mt-3 ms-3">Loading...</h3>
    {:then { payload, pagination }}
        <div class="mt-3 gap-3">
            <PurchaseOrderList on:save={addPurchaseOrder} authToken={data.authToken} {payload} />
            <Pagination
                on:nextPage={() => listCurrentPage += 1}
                on:prevPage={() => listCurrentPage -= 1}
                totalPages={pagination.totalPages}
                currentPage={pagination.page}
            />
        </div>
    {/await}
</div>