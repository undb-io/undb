<script lang="ts">
  import { getTable } from "$lib/store/table.store"
  import { trpc } from "$lib/trpc/client"
  import { cn } from "$lib/utils"
  import { createMutation } from "@tanstack/svelte-query"
  import type { FormVO } from "@undb/table"
  import { COLORS, FormOptionVO } from "@undb/table"
  import { tick } from "svelte"
  import { getFormBgColor, getFormBorderColor, getFormSelectedColor } from "./form-bg-color"

  const table = getTable()
  export let form: FormVO

  $: formOption = form.option ?? FormOptionVO.default()

  const onChangeBackgroundColor = async () => {
    form.option = formOption
    await setForm()
  }

  const setFormMutation = createMutation({
    mutationKey: ["table", $table.id.value, "setForm"],
    mutationFn: trpc.table.form.set.mutate,
  })

  const setForm = async () => {
    await tick()
    $setFormMutation.mutate({
      tableId: $table.id.value,
      form: form.toJSON(),
    })
  }
</script>

<div class="space-y-2 p-4">
  <h3 class="font-semibold">Form Setting</h3>

  <p class="text-muted-foreground">Background color</p>
  <div class="flex flex-wrap gap-2">
    {#each COLORS as color}
      {@const isSelected = color === formOption.backgroundColor}
      <label class="cursor-pointer">
        <input
          hidden
          type="radio"
          bind:group={formOption.backgroundColor}
          on:change={onChangeBackgroundColor}
          value={color}
        />
        <div
          class={cn(
            "h-8 w-8 rounded-sm border transition-colors",
            getFormBgColor(color),
            getFormBorderColor(color),
            isSelected && getFormSelectedColor(color),
            isSelected && "shadow-primary shadow-sm",
          )}
        ></div>
      </label>
    {/each}
  </div>
</div>
