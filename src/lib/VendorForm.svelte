<script>
    export let vendor = {
        name: "",
        description: "",
        contact: ""
    };
</script>

<div class="mb-3">
    <label for="name" class="form-label">Name</label>
    <input bind:value={vendor.name} type="text" id="name" class="form-control" required>
</div>
<div class="mb-3">
    <label for="description" class="form-label">Description</label>
    <textarea bind:value={vendor.description} class="form-control" id="description" rows="3" placeholder="Tyre, bearing, etc..."></textarea>
</div>
<div class="mb-3">
    <label for="contact" class="form-label">Contact</label>
    <textarea bind:value={vendor.contact} class="form-control" id="contact" rows="3" placeholder="Address, details, etc..."></textarea>
</div>