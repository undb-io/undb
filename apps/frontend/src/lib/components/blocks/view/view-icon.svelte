<script lang="ts">
  import type { ComponentType } from "svelte"
  import { LayoutGridIcon, KanbanIcon } from "lucide-svelte"
  import type { ViewType } from "@undb/table"

  export let type: ViewType

  const map: Record<ViewType, ComponentType> = {
    grid: LayoutGridIcon,
    kanban: KanbanIcon,
  }
</script>

<svelte:component this={map[type]} {...$$restProps} />
