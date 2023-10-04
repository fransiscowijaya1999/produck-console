<script>
    import { createEventDispatcher } from "svelte";

    const dispatch = createEventDispatcher();

    export let delivery;
</script>

<div class="row">
    <div class="col">
        <div class="form-switch mb-3">
            <input class="form-check-input" type="checkbox" role="switch" on:click={() => delivery.isPurchase = !delivery.isPurchase} bind:checked={delivery.isPurchase} id="is-purchase">
            <label class="form-check-label" for="show-not-delivered">
                Is Purchase
            </label>
        </div>
        <div class="mb-3">
            <label for="date" class="form-label">Date</label>
            <input bind:value={delivery.date} type="date" id="date" class="form-control specific-w-150" required>
        </div>
        <div class="mb-3">
            <label for="biller" class="form-label">Shipper</label><br>
            <input bind:value={delivery.biller} type="text" id="biller" class="form-control specific-w-300">
        </div>
    </div>
    <div class="col">
        <div class="mb-3">
            <label for="source-location" class="form-label">Source Location</label><br>
            <div class="btn-group">
                <button on:click={() => dispatch("rootSourceLocation")} type="button" class="btn btn-danger">root</button>
                <button on:click={() => dispatch("showSourceLocationModal")} type="button" class="btn btn-secondary">{delivery.sourceLocation ? delivery.sourceLocation.name : "Select Source Location"}</button>
            </div>
        </div>
        <div class="mb-3">
            <label for="target-location" class="form-label">Target Location</label><br>
            <div class="btn-group">
                <button on:click={() => dispatch("rootTargetLocation")} type="button" class="btn btn-danger">root</button>
                <button on:click={() => dispatch("showTargetLocationModal")} type="button" class="btn btn-secondary">{delivery.targetLocation ? delivery.targetLocation.name : "Select Target Location"}</button>
            </div>
        </div>
    </div>
</div>