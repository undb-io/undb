<script lang="ts">
  import { DashboardFactory } from "@undb/dashboard"
  import type { LayoutData } from "./$types"
  import { setDashboard } from "$lib/store/dashboard.store"
  import { writable } from "svelte/store"

  export let data: LayoutData

  $: dashboardStore = data.dashboardStore
  $: dashboard = $dashboardStore.data?.dashboard

  $: if (dashboard) {
    const dashboardDo = DashboardFactory.fromJSON(dashboard)
    setDashboard(writable(dashboardDo))
  }
</script>

<svelte:head>
  <title>{dashboard?.name || "undb"} - undb</title>
</svelte:head>

<main>
  {#if dashboard}
    <slot />
  {/if}
</main>
