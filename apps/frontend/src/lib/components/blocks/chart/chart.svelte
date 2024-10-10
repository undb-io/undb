<script lang="ts">
  import type { ComponentType } from "svelte"
  import CountChart from "./count-chart.svelte"
  import type { IChart } from "@undb/table/src/modules/chart/chart.vo"

  export let chart: IChart

  const map: Record<string, ComponentType> = {
    count: CountChart,
  }
</script>

<svelte:component this={map[chart.type]} />
