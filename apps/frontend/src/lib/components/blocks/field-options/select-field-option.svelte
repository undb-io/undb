<script lang="ts">
  import { Label } from "$lib/components/ui/label/index.js"
  import { Switch } from "$lib/components/ui/switch/index.js"
  import { COLORS, type ISelectFieldConstraint, type ISelectFieldOption } from "@undb/table"
  import OptionEditor from "$lib/components/blocks/option/option-editor.svelte"
  import { OptionIdVo } from "@undb/table/src/modules/schema/fields/option/option-id.vo"

  export let constraint: ISelectFieldConstraint | undefined
  export let option: ISelectFieldOption = {
    options: [
      {
        color: COLORS[0],
        name: "option1",
        id: OptionIdVo.create().value,
      },
    ],
  }
</script>

{#if constraint}
  <div class="space-y-4">
    <div>
      {#each option.options as o}
        <OptionEditor bind:color={o.color} bind:name={o.name} />
      {/each}
    </div>
    <div class="mt-4 flex items-center justify-end gap-3">
      <div class="flex items-center space-x-2">
        <Switch id="required" bind:checked={constraint.required} />
        <Label for="required" class="text-xs">Required</Label>
      </div>
    </div>
  </div>
{/if}
