<script>
    import Navigation from "$lib/Navigation.svelte";
</script>

<div class="page-wrapper with-navbar">
    <Navigation />

    <div class="content-wrapper">
        <slot></slot>
    </div>

    <nav class="navbar navbar-fixed-bottom">
        Please Work
    </nav>
</div>