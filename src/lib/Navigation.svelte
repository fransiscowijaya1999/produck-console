<script>
    import { page } from "$app/stores";

    $: path = $page.route.id;
</script>

<nav class="navbar">
    <div class="navbar-brand">ProDuck</div>

    <ul class="navbar-nav d-none d-md-flex">
        <li class="nav-item" class:active={path == "/"}>
          <a href="/" class="nav-link">Dashboard</a>
        </li>
        <li class="nav-item" class:active={path == "/products"}>
          <a href="/products" class="nav-link">Products</a>
        </li>
        <li class="nav-item" class:active={path == "/inventory"}>
          <a href="/inventory" class="nav-link">Inventory</a>
        </li>
        <li class="nav-item" class:active={path == "/purchases"}>
          <a href="/purchases" class="nav-link">Purchases</a>
        </li>
        <li class="nav-item" class:active={path == "/sales"}>
          <a href="/sales" class="nav-link">Sales</a>
        </li>
        <li class="nav-item" class:active={path == "/users"}>
          <a href="/users" class="nav-link">Users</a>
        </li>
      </ul>
</nav>