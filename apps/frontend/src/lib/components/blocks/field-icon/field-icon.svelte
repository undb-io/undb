<script lang="ts">
  import type { ComponentType } from "svelte"
  import NumberIcon from "./number-icon.svelte"
  import StringIcon from "./string-icon.svelte"
  import type { Field, FieldType } from "@undb/table"
  import {
    KeyRoundIcon,
    CalendarPlus2Icon,
    ArrowDown01Icon,
    CalendarClockIcon,
    UserRoundPlus,
    UserRoundCheck,
    SquareArrowOutUpRightIcon,
    CalculatorIcon,
    StarIcon,
    MailIcon,
    FileTextIcon,
    CalendarIcon,
    FileJsonIcon,
    SquareCheckIcon,
    UserIcon,
    UsersIcon,
    ListChecksIcon,
    ListTodoIcon,
    LinkIcon,
    FolderIcon,
    DollarSignIcon,
    MousePointerClickIcon,
    TimerIcon,
    PercentIcon,
    SquareFunctionIcon,
    CalendarRangeIcon,
  } from "lucide-svelte"

  export let type: FieldType
  export let field: Field | undefined = undefined

  const map: Record<FieldType, ComponentType> = {
    id: KeyRoundIcon,
    longText: FileTextIcon,
    string: StringIcon,
    number: NumberIcon,
    currency: DollarSignIcon,
    autoIncrement: ArrowDown01Icon,
    createdAt: CalendarPlus2Icon,
    createdBy: UserRoundPlus,
    updatedAt: CalendarClockIcon,
    updatedBy: UserRoundCheck,
    reference: SquareArrowOutUpRightIcon,
    rollup: CalculatorIcon,
    select: field?.type === "select" && field.isMultiple ? ListChecksIcon : ListTodoIcon,
    rating: StarIcon,
    email: MailIcon,
    url: LinkIcon,
    attachment: FolderIcon,
    date: CalendarIcon,
    json: FileJsonIcon,
    checkbox: SquareCheckIcon,
    user: field?.type === "user" && field.isMultiple ? UsersIcon : UserIcon,
    button: MousePointerClickIcon,
    duration: TimerIcon,
    percentage: PercentIcon,
    formula: SquareFunctionIcon,
    dateRange: CalendarRangeIcon,
  }

  $: component = map[type]
</script>

<svelte:component this={component} {...$$restProps} />
