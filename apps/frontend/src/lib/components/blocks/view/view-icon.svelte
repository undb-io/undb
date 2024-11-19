<script lang="ts">
  import type { ComponentType } from "svelte"
  import {
    LayoutGridIcon,
    KanbanIcon,
    GalleryVerticalIcon,
    ListIcon,
    CalendarIcon,
    PanelsTopLeftIcon,
  } from "lucide-svelte"
  import type { ViewType } from "@undb/table"

  export let type: ViewType

  const map: Record<ViewType, ComponentType> = {
    grid: LayoutGridIcon,
    kanban: KanbanIcon,
    gallery: GalleryVerticalIcon,
    list: ListIcon,
    calendar: CalendarIcon,
    pivot: PanelsTopLeftIcon,
  }

  $: component = map[type]
</script>

<svelte:component this={component} {...$$restProps} />
