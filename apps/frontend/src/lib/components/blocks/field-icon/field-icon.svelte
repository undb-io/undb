<script lang="ts">
  import type { ComponentType } from "svelte"
  import NumberIcon from "./number-icon.svelte"
  import StringIcon from "./string-icon.svelte"
  import type { FieldType } from "@undb/table"
  import { KeyRoundIcon, CalendarPlus2Icon } from "lucide-svelte"

  export let type: FieldType

  const map: Record<FieldType, ComponentType> = {
    id: KeyRoundIcon,
    createdAt: CalendarPlus2Icon,
    string: StringIcon,
    number: NumberIcon,
  }
</script>

<svelte:component this={map[type]} {...$$restProps} />
