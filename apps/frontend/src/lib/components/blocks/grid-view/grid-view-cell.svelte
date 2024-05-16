<script lang="ts">
  import { cn } from "$lib/utils"

  export let value: any
  export let index: number
</script>

<div class={cn("p-2", index === 0 ? "border-l-0 border-red-500" : "")}>
  {value}
</div>
