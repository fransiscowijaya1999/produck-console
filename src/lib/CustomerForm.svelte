<script>
    export let customer = {
        name: "",
        address: "",
        phone: ""
    };
</script>

<div class="mb-3">
    <label for="name" class="form-label">Name</label>
    <input bind:value={customer.name} type="text" id="name" class="form-control" required>
</div>
<div class="mb-3">
    <label for="address" class="form-label">Address</label>
    <textarea bind:value={customer.address} class="form-control" id="address" rows="3" placeholder="Surabaya..."></textarea>
</div>
<div class="mb-3">
    <label for="phone" class="form-label">Phone</label>
    <input type="text" bind:value={customer.phone} class="form-control" id="phone">
</div>