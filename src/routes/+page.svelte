<svelte:head>
    <title>ProDuck</title>
</svelte:head>

<script>
    export let data;

    const { replenishmentCount, productPriceCount, customerPriceCount } = data;
</script>

<div class="container-fluid p-3">
    <h1 class="content-title mb-3">ProDuck</h1>
    <div class="row">
        <div class="col">
            <div class="card">
                <div class="card-body">
                    <h5 class="card-title">Replenishment</h5>
                    {#if replenishmentCount}
                        <p class="card-text">
                            There are <span class="badge text-bg-warning">{replenishmentCount}</span> categories that need replenishment.
                        </p>
                        <a href="/replenishment" class="btn btn-primary">Check it out</a>
                    {:else}
                        <p class="card-text">
                            👍 No category to replenish.
                        </p>
                    {/if}
                </div>
            </div>
        </div>
        <div class="col">
            <div class="card">
                <div class="card-body">
                    <h5 class="card-title">Price Correction</h5>
                    {#if productPriceCount}
                        <p class="card-text">
                            There are <span class="badge text-bg-warning">{productPriceCount}</span> products that have negative margin.
                        </p>
                        <a href="/price-correction" class="btn btn-primary">Check it out</a>
                    {:else}
                        <p class="card-text">
                            👍 All product price is good.
                        </p>
                    {/if}
                </div>
            </div>
        </div>
        <div class="col">
            <div class="card">
                <div class="card-body">
                    <h5 class="card-title">Customer Price Correction</h5>
                    {#if customerPriceCount}
                        <p class="card-text">
                                There are <span class="badge text-bg-warning">{customerPriceCount}</span> customer price that have negative margin.
                            </p>
                            <a href="/customer-price-correction" class="btn btn-primary">Check it out</a>
                    {:else}
                        <p class="card-text">
                            👍 All customer price is good.
                        </p>
                    {/if}
                </div>
            </div>
        </div>
    </div>
</div>