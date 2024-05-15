<script lang="ts">
  import { Checkbox } from "$lib/components/ui/checkbox"
  import { cn } from "$lib/utils"
  import type { Writable } from "svelte/store"

  export let checked: Writable<boolean>
</script>

<Checkbox bind:checked={$checked} {...$$restProps} />
