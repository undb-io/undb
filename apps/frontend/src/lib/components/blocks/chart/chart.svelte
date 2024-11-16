<script lang="ts">
  import type { ComponentType } from "svelte"
  import type { IChart } from "@undb/table/src/modules/chart/chart.vo"

  export let chart: IChart

  const map: Record<string, ComponentType> = {
  }

  $: component = map[chart.type]
</script>

<svelte:component this={component} />
