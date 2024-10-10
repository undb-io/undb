<script lang="ts">
  import type { IWidgetDTO } from "@undb/table"
  import Chart from "../chart/chart.svelte"

  export let widget: IWidgetDTO
</script>

<div class="rounded-sm border">
  {#if widget.item.type === "chart"}
    <Chart chart={widget.item.chart} />
  {/if}
</div>
