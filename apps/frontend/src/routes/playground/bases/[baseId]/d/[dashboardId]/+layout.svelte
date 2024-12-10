<script lang="ts">
  import type { LayoutData } from "./$types"
  import { DashboardFactory } from "@undb/dashboard"
  import { setDashboard } from "$lib/store/dashboard.store"
  import { writable } from "svelte/store"

  export let data: LayoutData

  $: dashboard = data.dashboard

  $: if (dashboard) {
    const dashboardDo = DashboardFactory.fromJSON(dashboard)
    setDashboard(writable(dashboardDo))
  }
</script>

{#key dashboard.id}
  <slot></slot>
{/key}
