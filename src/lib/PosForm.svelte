<script>
    export let pos = {
        name: "",
        description: ""
    };
</script>

<div class="mb-3">
    <label for="pos-name" class="form-label">Name</label>
    <input bind:value={pos.name} type="text" id="pos-name" class="form-control" required>
</div>
<div class="mb-3">
    <label for="pos-description" class="form-label">Description</label>
    <textarea bind:value={pos.description} class="form-control" id="pos-description" rows="3" placeholder="Address, details, etc..."></textarea>
</div>