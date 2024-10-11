<script lang="ts">
  import type { ComponentType } from "svelte"
  import type { IAggregate } from "@undb/table/src/modules/aggregate/aggregate.vo"
  import CountAggregateConfig from "./count-aggregate-config.svelte"

  export let aggregate: IAggregate

  const map: Record<string, ComponentType> = {
    count: CountAggregateConfig,
  }
</script>

<svelte:component this={map[aggregate.type]} />
