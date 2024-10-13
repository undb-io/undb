<script lang="ts">
  import type { LayoutData } from "./$types"

  export let data: LayoutData

  $: dashboardStore = data.dashboardStore
  $: dashboard = $dashboardStore.data?.dashboard
</script>

<svelte:head>
  <title>{dashboard?.name || "undb"} - undb</title>
</svelte:head>

<main>
  <slot />
</main>
