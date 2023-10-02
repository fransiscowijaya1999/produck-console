<script>
    import { createEventDispatcher } from "svelte";

    const dispatch = createEventDispatcher();

    export let purchase = {
        vendor: {
            id: null,
            name: ""
        },
        date: "",
        sourceDocument: "",
        memo: ""
    };
</script>

<div class="row">
    <div class="col">
        <div class="mb-3">
            <label for="date" class="form-label">Date</label>
            <input bind:value={purchase.date} type="date" id="date" class="form-control specific-w-150" required>
        </div>
        <div class="mb-3">
            <label for="vendor" class="form-label">Vendor</label><br>
            <button on:click={() => dispatch("showVendorModal")} type="button" class="btn btn-secondary">{purchase.vendor.name ? purchase.vendor.name : "Select Vendor"}</button>
        </div>
    </div>
    <div class="col">
        <div class="mb-3">
            <label for="sourceDocument" class="form-label">Source Document</label>
            <input bind:value={purchase.sourceDocument} class="form-control" id="sourceDocument" placeholder="PO###">
        </div>
        <div class="mb-3">
            <label for="memo" class="form-label">Memo</label>
            <textarea bind:value={purchase.memo} class="form-control" id="memo" rows="3" placeholder="Memory"></textarea>
        </div>
    </div>
</div>