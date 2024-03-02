<script>
    import { goto } from "$app/navigation";
    import { fetchServer } from "$lib/fetch";
    import SelectVendorModal from "$lib/modals/SelectVendorModal.svelte";
    import { toStringDelimit } from "$lib/numbering.js";
    import Pagination from "$lib/Pagination.svelte";
    
    import PurchaseForm from "$lib/PurchaseForm.svelte";
    import PurchaseOrderList from "$lib/PurchaseOrderList.svelte";

    export let data;

    let buttonState = "normal";
    let errorMessage = "";
    let successMessage = "";
    let showVendorModal = false;
    let listCurrentPage = 1;

    let tax = 0;
    let discount = 0;

    let purchase = data.payload;

    $: searchPromise = (search)(data.payload.id, listCurrentPage);

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

    async function deletePurchase() {
        try {
            buttonState = "saving";

            await fetchServer(`purchases/${purchase.id}`, {
                method: "DELETE",
                headers: { "Authorization": `Bearer ${data.authToken}` }
            });

            goto("/purchases")
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

    async function updatePurchaseOrder(event) {
        const payload = event.detail.purchaseOrder;
        payload.productId = payload.product.id;
        payload.purchaseId = purchase.id;

        try {
            const res = await fetchServer(`purchaseorders/${payload.id}`, {
                method: "PUT",
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

    async function deletePurchaseOrder(event) {
        const { id } = event.detail;

        try {
            const res = await fetchServer(`purchaseorders/${id}`, {
                method: "DELETE",
                headers: { "Authorization": `Bearer ${data.authToken}` }
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
                Loading...
            {/if}
        </button>
        <button on:click={deletePurchase} class="btn btn-danger btn-lg" class:disabled={buttonState == "saving"} type="button">
            {#if buttonState == "normal"}
                Delete
            {:else if buttonState == "saving"}
                Loading...
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
            <div class="row mb-3">
                <div class="col"></div>
                <div class="col-auto">
                    <div class="card">
                        <div class="card-body">
                            <div class="row">
                                <div class="col-auto">
                                    <label for="tax" class="form-label">Tax (%)</label>
                                    <input bind:value={tax} id="tax" type="number" class="form-control">
                                </div>
                                <div class="col-auto">
                                    <label for="discount" class="form-label">Discount (%)</label>
                                    <input bind:value={discount} id="discount" type="number" class="form-control">
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="col"></div>
            </div>
            <PurchaseOrderList
                bind:tax={tax}
                bind:discount={discount}
                on:update={updatePurchaseOrder}
                on:save={addPurchaseOrder}
                on:deletePurchaseOrder={deletePurchaseOrder}
                authToken={data.authToken} {payload} />
            <Pagination
                on:nextPage={() => listCurrentPage += 1}
                on:prevPage={() => listCurrentPage -= 1}
                totalPages={pagination.totalPages}
                currentPage={pagination.page}
            />
            <div class="card m-5">
                <div class="card-body">
                    <div class="row align-items-center">
                        <div class="col"></div>
                        <div class="col-auto">
                            Total: <span class="fw-bold">{toStringDelimit(payload.reduce((acc, cur) => acc + (cur.cost * cur.quantity), 0))}</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    {/await}
</div>