<svelte:head>
    <title>ProDuck</title>
</svelte:head>

<script>
    export let data;

    const { replenishmentCount, priceCorrectionCount } = data;
</script>

<div class="container-fluid p-3">
    <h1 class="content-title mb-3">ProDuck</h1>
    <div class="row">
        <div class="col">
            <div class="card">
                <div class="card-body">
                    <h5 class="card-title">Replenishment</h5>
                    <p class="card-text">
                        {#if replenishmentCount}
                            There are <span class="badge text-bg-warning">{replenishmentCount}</span> categories that need replenishment.
                        {:else}
                            No categories to replenish.
                        {/if}
                    </p>
                    <a href="/replenishment" class="btn btn-primary">Check it out</a>
                </div>
            </div>
        </div>
        <div class="col">
            <div class="card">
                <div class="card-body">
                    <h5 class="card-title">Price Correction</h5>
                    <p class="card-text">
                        {#if priceCorrectionCount}
                            There are <span class="badge text-bg-warning">{priceCorrectionCount}</span> products that have negative margin.
                        {:else}
                            All product has good pricing.
                        {/if}
                    </p>
                    <a href="/price-correction" class="btn btn-primary">Check it out</a>
                </div>
            </div>
        </div>
        <div class="col"></div>
    </div>
</div>