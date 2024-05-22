<script lang="ts">
  import { isDate } from "radash"

  export let value: string | Date | undefined = undefined

  $: internalValue = isDate(value) ? value.toISOString() : value
</script>

<span>{internalValue || ""}</span>
