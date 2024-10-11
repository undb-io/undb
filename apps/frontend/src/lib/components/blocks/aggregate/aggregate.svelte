<script lang="ts">
  import type { ComponentType } from "svelte"
  import type { IAggregate } from "@undb/table/src/modules/aggregate/aggregate.vo"
  import CountAggregate from "./count-aggregate.svelte"

  export let aggregate: IAggregate

  const map: Record<string, ComponentType> = {
    count: CountAggregate,
  }
</script>

<svelte:component this={map[aggregate.type]} {aggregate} {...$$restProps} />
