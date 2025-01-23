<script lang="ts">
  import { DashboardFactory } from "@undb/dashboard"
  import type { LayoutData } from "./$types"
  import { setDashboard } from "$lib/store/dashboard.store"
  import { writable } from "svelte/store"
  import { shareStore } from "$lib/store/share.store.svelte"

  export let data: LayoutData

  $: dashboardStore = data.dashboardStore
  $: dashboard = $dashboardStore.data?.dashboardByShare
  $: share = dashboard?.share

  $: if (dashboard) {
    const dashboardDo = DashboardFactory.fromJSON(dashboard)
    setDashboard(writable(dashboardDo))
  }
  $: if (share && dashboard) {
    shareStore.set(dashboard.id, {
      enabled: share.enabled,
      id: share.id,
      target: { type: "dashboard", id: dashboard.id },
    })
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
