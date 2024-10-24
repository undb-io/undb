<script lang="ts">
  import { trpc } from "$lib/trpc/client"
  import { cn } from "$lib/utils"
  import { createMutation } from "@tanstack/svelte-query"
  import type { FormulaField } from "@undb/table"
  import { toast } from "svelte-sonner"
  import { gridViewStore } from "../grid-view.store"

  export let value: string
</script>

<div class={cn("truncate", $$restProps.class)}>
  {#if value}
    {value}
  {/if}
</div>
