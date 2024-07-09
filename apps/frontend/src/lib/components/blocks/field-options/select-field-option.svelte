<script lang="ts">
  import { Label } from "$lib/components/ui/label/index.js"
  import NumberInput from "$lib/components/ui/input/number-input.svelte"
  import { Switch } from "$lib/components/ui/switch/index.js"
  import { COLORS, ColorsVO, Options, type ISelectFieldConstraint, type ISelectFieldOption } from "@undb/table"
  import OptionEditor from "$lib/components/blocks/option/option-editor.svelte"
  import { OptionIdVo } from "@undb/table/src/modules/schema/fields/option/option-id.vo"
  import Button from "$lib/components/ui/button/button.svelte"
  import { isNumber } from "radash"
  import { SortableList } from "@jhubbardsf/svelte-sortablejs"
  import { GripVerticalIcon, XIcon } from "lucide-svelte"
  import * as Select from "$lib/components/ui/select"

  export let constraint: ISelectFieldConstraint | undefined
  const colors = new ColorsVO()
  export let option: ISelectFieldOption = { options: [] }

  $: console.log(option)

  // $: if (!option) {
  //   option = {
  //     options: [
  //       {
  //         color: COLORS[0],
  //         name: "option1",
  //         id: OptionIdVo.create().value,
  //       },
  //     ],
  //   }
  // }

  // const addOption = () => {
  //   option.options = [
  //     ...option.options,
  //     {
  //       color: colors.next(option.options[option.options.length - 1]?.color),
  //       name: `option${option.options.length + 1}`,
  //       id: OptionIdVo.create().value,
  //     },
  //   ]
  // }

  // const swap = (oldIndex: number, newIndex: number) => {
  //   const options = [...option.options]
  //   const [removed] = options.splice(oldIndex, 1)
  //   options.splice(newIndex, 0, removed)
  //   option.options = [...options]
  // }

  // const removeOption = (id: string) => {
  //   option.options = option.options.filter((o) => o.id !== id)
  // }

  let single = "single"
  $: isSingle = "single" === single

  $: if (constraint) {
    if (isSingle) {
      constraint.max = 1
    } else {
      constraint.max = undefined
    }
  }

  $: selected = isSingle
    ? {
        label: "Single",
        value: "single",
      }
    : {
        label: "Multiple",
        value: "multiple",
      }
</script>

{#if constraint}
  <div class="space-y-4">
    <div class="flex items-center gap-2">
      <Select.Root
        {selected}
        onSelectedChange={(selected) => {
          if (selected) {
            single = selected.value
          }
        }}
      >
        <Select.Trigger class="w-[140px]">
          <Select.Value />
        </Select.Trigger>
        <Select.Content>
          <Select.Item value="single">Single</Select.Item>
          <Select.Item value="multiple">Multiple</Select.Item>
        </Select.Content>
      </Select.Root>

      {#if !isSingle}
        <Label class="flex flex-1 items-center gap-2">
          Max
          <NumberInput bind:value={constraint.max} />
        </Label>
      {/if}
    </div>
    <div class="space-y-1">
      <p class="text-sm font-semibold">Options</p>
      <div class="space-y-2">
        <SortableList
          animation={200}
          handle=".handler"
          class="space-y-2"
          onEnd={(event) => {
            if (isNumber(event.oldIndex) && isNumber(event.newIndex)) {
              swap(event.oldIndex, event.newIndex)
            }
          }}
        >
          {#each option.options as o (o.id)}
            <div class="flex gap-1">
              <OptionEditor bind:color={o.color} bind:name={o.name} />

              <div class="inline-flex items-center">
                <button type="button" class="handler">
                  <GripVerticalIcon class="text-muted-foreground h-4 w-4" />
                </button>
                <button disabled={option.options.length === 1} type="button" on:click={() => removeOption(o.id)}>
                  <XIcon class="text-muted-foreground h-4 w-4" />
                </button>
              </div>
            </div>
          {/each}
        </SortableList>

        <Button on:click={() => {}} class="w-full" size="sm" variant="outline">+ Add Option</Button>
      </div>
    </div>
    <div class="mt-4 flex items-center justify-end gap-3">
      <div class="flex items-center space-x-2">
        <Switch id="required" bind:checked={constraint.required} />
        <Label for="required" class="text-xs">Required</Label>
      </div>
    </div>
  </div>
{/if}
