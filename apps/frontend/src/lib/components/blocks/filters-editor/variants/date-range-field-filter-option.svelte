<script lang="ts">
  import { DateRangeField, type IDateRangeFieldConditionItem } from "@undb/table"
  import DateRangeScopePicker from "./date-range-scope-picker.svelte"

  export let field: DateRangeField
  export let option: IDateRangeFieldConditionItem
</script>

<DateRangeScopePicker bind:value={option.scope} class={$$restProps.class} />
