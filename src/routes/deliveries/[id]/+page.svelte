<script>
    import { fetchServer } from "$lib/fetch";

    import DeliveryForm from "$lib/DeliveryForm.svelte";
    import SelectLocationModal from "$lib/modals/SelectLocationModal.svelte";
    import Pagination from "$lib/Pagination.svelte";
    import DeliveryOrderList from "$lib/DeliveryOrderList.svelte";
    
    export let data;

    let buttonState = "normal";
    let errorMessage = "";
    let successMessage = "";

    let delivery = data.payload;

    let showSourceLocationModal = false;
    let showTargetLocationModal = false;

    let keyword = "";
    let listCurrentPage = 1;

    $: searchPromise = (search)(keyword, delivery.id, listCurrentPage);

    async function search(keyword = "", deliveryId, currentPage = 1) {
        const returnData = {
            payload: [],
            pagination: {
                totalPages: 1,
                page: 1
            }
        };

        const res = await fetchServer(`landedcostitems/landedcosts/${deliveryId}?keyword=${keyword}&page=${currentPage}&pageSize=50`, {
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
        const payload = Object.assign({}, delivery);
        payload.sourceLocationId = delivery.sourceLocation ? delivery.sourceLocation.id : null;
        payload.targetLocationId = delivery.targetLocation ? delivery.targetLocation.id : null;

        try {
            buttonState = "saving";

            const res = await fetchServer(`landedcosts/${delivery.id}`, {
                method: "PUT",
                headers: { "Content-Type": "application/json", "Authorization": `Bearer ${data.authToken}` },
                body: JSON.stringify(payload)
            });
            
            if (res.status != 204) {
                const result = await res.json();
                if (result.isError) return errorMessage = result.responseException.exceptionMessage;
            }

            successMessage = "Delivery saved";
        } catch (/** @type {*} */ error) {
            errorMessage = error;
        } finally {
            buttonState = "normal";
            setTimeout(() => successMessage = "", 5000);
            setTimeout(() => errorMessage = "", 5000);
        }
    }

    async function deliver() {
        try {
            buttonState = "saving";

            const res = await fetchServer("landedcosts/deliver", {
                method: "POST",
                headers: { "Content-Type": "application/json", "Authorization": `Bearer ${data.authToken}` },
                body: JSON.stringify(delivery.id)
            });
            
            if (res.status != 204) {
                const result = await res.json();
                if (result.isError) return errorMessage = result.responseException.exceptionMessage;
            }

            successMessage = "Delivered";
        } catch (/** @type {*} */ error) {
            errorMessage = error;
        } finally {
            buttonState = "normal";
            setTimeout(() => successMessage = "", 5000);
            setTimeout(() => errorMessage = "", 5000);
        }
    }

    async function addDeliveryOrder(event) {
        const payload = event.detail.deliveryOrder;
        payload.purchaseOrderId = payload.purchaseOrder ? payload.purchaseOrder.id : null;
        payload.landedCostId = payload.landedCostItemId ? null : delivery.id;

        try {
            const res = await fetchServer("landedcostitems", {
                method: "POST",
                headers: { "Content-Type": "application/json", "Authorization": `Bearer ${data.authToken}` },
                body: JSON.stringify(payload)
            });
            
            if (res.status != 204) {
                const result = await res.json();
                if (result.isError) return errorMessage = result.responseException.exceptionMessage;
            }

            searchPromise = (search)(keyword, delivery.id, listCurrentPage);
        } catch (/** @type {*} */ error) {
            errorMessage = error;
        } finally {
            setTimeout(() => errorMessage = "", 5000);
        }
    }

    async function updateDeliveryOrder(event) {
        const payload = event.detail.deliveryOrder;
        payload.PurchaseOrderId = payload.purchaseOrder ? payload.purchaseOrder.id : null;
        payload.LandedCostId = payload.LandedCostItemId ? null : delivery.id;

        try {
            const res = await fetchServer(`landedcostitems/${payload.id}`, {
                method: "PUT",
                headers: { "Content-Type": "application/json", "Authorization": `Bearer ${data.authToken}` },
                body: JSON.stringify(payload)
            });
            
            if (res.status != 204) {
                const result = await res.json();
                if (result.isError) return errorMessage = result.responseException.exceptionMessage;
            }

            searchPromise = (search)(keyword, delivery.id, listCurrentPage);
        } catch (/** @type {*} */ error) {
            errorMessage = error;
        } finally {
            setTimeout(() => errorMessage = "", 5000);
        }
    }

    async function deleteDeliveryOrder(event) {
        const { id } = event.detail;

        try {
            const res = await fetchServer(`landedcostitems/${id}`, {
                method: "DELETE",
                headers: { "Content-Type": "application/json", "Authorization": `Bearer ${data.authToken}` }
            });
            
            if (res.status != 204) {
                const result = await res.json();
                if (result.isError) return errorMessage = result.responseException.exceptionMessage;
            }

            searchPromise = (search)(keyword, delivery.id, listCurrentPage);
        } catch (/** @type {*} */ error) {
            errorMessage = error;
        } finally {
            setTimeout(() => errorMessage = "", 5000);
        }
    }

    async function selectAllBulk(event) {
        const { purchaseId } = event.detail;

        try {
            const res = await fetchServer(`landedcostitems/bulk?ignoreDelivered=${delivery.isPurchase ? "false" : "true"}`, {
                method: "POST",
                headers: { "Content-Type": "application/json", "Authorization": `Bearer ${data.authToken}` },
                body: JSON.stringify({
                    purchaseId,
                    landedCostId: delivery.id
                })
            });
            
            if (res.status != 204) {
                const result = await res.json();
                if (result.isError) return errorMessage = result.responseException.exceptionMessage;
            }

            searchPromise = (search)(keyword, delivery.id, listCurrentPage);
        } catch (/** @type {*} */ error) {
            errorMessage = error;
        } finally {
            setTimeout(() => errorMessage = "", 5000);
        }
    }

    async function selectAllSeparated(event) {
        const { purchaseId } = event.detail;

        try {
            const res = await fetchServer(`landedcostitems/separated?ignoreDelivered=${delivery.isPurchase ? "false" : "true"}`, {
                method: "POST",
                headers: { "Content-Type": "application/json", "Authorization": `Bearer ${data.authToken}` },
                body: JSON.stringify({
                    purchaseId,
                    landedCostId: delivery.id
                })
            });
            
            if (res.status != 204) {
                const result = await res.json();
                if (result.isError) return errorMessage = result.responseException.exceptionMessage;
            }

            searchPromise = (search)(keyword, delivery.id, listCurrentPage);
        } catch (/** @type {*} */ error) {
            errorMessage = error;
        } finally {
            setTimeout(() => errorMessage = "", 5000);
        }
    }
</script>

{#if showSourceLocationModal}<SelectLocationModal on:handleLocationClick={event => {delivery.sourceLocation = event.detail.location; showSourceLocationModal = false;}} on:handleModalClose={() => showSourceLocationModal = false} authToken={data.authToken} />{/if}
{#if showTargetLocationModal}<SelectLocationModal on:handleLocationClick={event => {delivery.targetLocation = event.detail.location; showTargetLocationModal = false;}} on:handleModalClose={() => showTargetLocationModal = false} authToken={data.authToken} />{/if}

<div class="container-fluid">
    <button class="btn btn-secondary mt-3" on:click={() => history.back()}>Back</button>
    <h1 class="mt-3">Edit Delivery</h1>
    <div class="form-wrapper border-bottom pb-3">
        <DeliveryForm
            bind:delivery={delivery}
            on:rootSourceLocation={() => delivery.sourceLocation = null}
            on:rootTargetLocation={() => delivery.targetLocation = null}
            on:showSourceLocationModal={() => showSourceLocationModal = true}
            on:showTargetLocationModal={() => showTargetLocationModal = true}
        />
        <div class="d-flex justify-content-between">
            <button on:click={save} class="btn btn-primary btn-lg" class:disabled={buttonState == "saving"} type="button">
                {#if buttonState == "normal"}
                    Save
                {:else if buttonState == "saving"}
                    Saving...
                {/if}
            </button>
            <button on:click={deliver} disabled={delivery.isDelivered} class="btn btn-outline-primary btn-lg" class:disabled={buttonState == "saving"} type="button">
                {#if delivery.isDelivered}
                    Delivered
                {:else}
                    {#if buttonState == "normal"}
                        Deliver
                    {:else if buttonState == "saving"}
                        Saving...
                    {/if}
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
    {#await searchPromise}
        <h3 class="mt-3 ms-3">Loading...</h3>
    {:then { payload, pagination }} 
        <div class="mt-3 gap-3">
            <DeliveryOrderList
                on:delete={deleteDeliveryOrder}
                on:update={updateDeliveryOrder}
                on:save={addDeliveryOrder}
                on:selectAllBulk={selectAllBulk}
                on:selectAllSeparated={selectAllSeparated}
                authToken={data.authToken} {payload} />
            <Pagination
                on:nextPage={() => listCurrentPage += 1}
                on:prevPage={() => listCurrentPage -= 1}
                totalPages={pagination.totalPages}
                currentPage={pagination.page}
            />
        </div>
    {/await}
</div>