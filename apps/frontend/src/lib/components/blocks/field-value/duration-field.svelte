<script lang="ts">
  import { millisecondsToDuration } from "@undb/table"

  export let value: number | undefined = undefined
</script>

<span class={$$restProps.class}>{value ? millisecondsToDuration(value) : ""}</span>
