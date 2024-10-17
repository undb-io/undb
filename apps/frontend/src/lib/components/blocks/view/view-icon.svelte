<script lang="ts">
  import type { ComponentType } from "svelte"
  import { LayoutGridIcon, KanbanIcon, GalleryVerticalIcon, ListIcon } from "lucide-svelte"
  import type { ViewType } from "@undb/table"

  export let type: ViewType

  const map: Record<ViewType, ComponentType> = {
    grid: LayoutGridIcon,
    kanban: KanbanIcon,
    gallery: GalleryVerticalIcon,
    list: ListIcon,
  }
</script>

<svelte:component this={map[type]} {...$$restProps} />
