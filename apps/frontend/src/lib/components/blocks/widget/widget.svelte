<script lang="ts">
  import type { IWidgetDTO } from "@undb/table"
  import Aggregate from "../aggregate/aggregate.svelte"

  export let widget: IWidgetDTO
</script>

<div class="rounded-sm border">
  {#if widget.item.type === "aggregate"}
    <Aggregate aggregate={widget.item.aggregate} />
  {/if}
</div>
