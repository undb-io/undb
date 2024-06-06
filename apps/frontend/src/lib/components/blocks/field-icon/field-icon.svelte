<script lang="ts">
  import type { ComponentType } from "svelte"
  import NumberIcon from "./number-icon.svelte"
  import StringIcon from "./string-icon.svelte"
  import type { FieldType } from "@undb/table"
  import {
    KeyRoundIcon,
    CalendarPlus2Icon,
    ArrowDown01Icon,
    CalendarClockIcon,
    UserRoundPlus,
    UserRoundCheck,
    SquareArrowOutUpRightIcon,
  } from "lucide-svelte"

  export let type: FieldType

  const map: Record<FieldType, ComponentType> = {
    id: KeyRoundIcon,
    string: StringIcon,
    number: NumberIcon,
    autoIncrement: ArrowDown01Icon,
    createdAt: CalendarPlus2Icon,
    createdBy: UserRoundPlus,
    updatedAt: CalendarClockIcon,
    updatedBy: UserRoundCheck,
    reference: SquareArrowOutUpRightIcon,
  }
</script>

<svelte:component this={map[type]} {...$$restProps} />
