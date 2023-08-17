<script>
    let products = [
        {
            id: 1,
            name: "NKN 6201",
            price: 10,
            cost: 7,
            stock: 200
        }
    ];
</script>

<div class="container-fluid">
    <div class="content">
        <h1 class="content-title">Products</h1>
        <button class="btn btn-primary">Create</button>
    </div>
    <div class="content">
        <nav aria-label="Breadcrumb navigation example">
            <ul class="breadcrumb">
                <li class="breadcrumb-item"><a href="#">All</a></li>
                <li class="breadcrumb-item"><a href="#">Categories</a></li>
                <li class="breadcrumb-item active" aria-current="page"><a href="#">Bearing</a></li>
            </ul>
        </nav>
    </div>
    {#if products.length > 0}
        <div class="content">
            <table class="table table-hover">
                <thead>
                    <tr>
                        <th><input type="checkbox" name="selectAll" id="selectAll"></th>
                        <th>Name</th>
                        <th>Price</th>
                        <th>Cost</th>
                        <th>Stock</th>
                    </tr>
                </thead>
                <tbody>
                    {#each products as product, i}
                        <tr>
                            <th><input type="checkbox" name="select-{i}" id="select-{i}"></th>
                            <th><a href="/products/{product.id.toString()}">{product.name}</a></th>
                            <th>{product.price}</th>
                            <th>{product.cost}</th>
                            <th>{product.stock}</th>
                        </tr>
                    {/each}
                </tbody>
            </table>
        </div>
    {:else}
        <div class="content">
            <h1 class="content-title font-size-22">No products yet.</h1>
        </div>
    {/if}
</div>