<style>
  .c-navbar {
    display: flex;
    width: 100%;
    height: 3.5rem;
    position: sticky;
    padding-left: 1.75rem;
  }
  
  .c-navbar > ul {
    display: flex;
    list-style: none;
    margin: 0;
    padding: 0;
    gap: 2rem;
    place-items: center;
  }

  .c-navbar a {
    color: grey;
    text-decoration: none;
  }
  .c-navbar a:hover {
    color: black;
  }
  .c-navbar li.active a {
    color: black;
  }
</style>

<script>
    import { page } from "$app/stores";

    $: path = $page.route.id;
</script>

<nav class="c-navbar border-bottom">
  <ul>
    <li class:active={path == "/"}>
      <a href="/">Dashboard</a>
    </li>
    <li class:active={path == "/products"}>
      <a href="/products">Products</a>
    </li>
    <li class:active={path == "/categories"}>
      <a href="/categories">Categories</a>
    </li>
    <li class:active={path == "/inventory"}>
      <a href="/inventory">Inventory</a>
    </li>
    <li class:active={path == "/purchases"}>
      <a href="/purchases">Purchases</a>
    </li>
    <li class:active={path == "/sales"}>
      <a href="/sales">Sales</a>
    </li>
    <li class:active={path == "/pos"}>
      <a href="/pos">PoS</a>
    </li>
    <li class:active={path == "/users"}>
      <a href="/users">Users</a>
    </li>
  </ul>
</nav>