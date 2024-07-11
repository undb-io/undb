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
  import { GripVerticalIcon, PlusSquareIcon, XIcon } from "lucide-svelte"
  import { Separator } from "$lib/components/ui/separator"
  import { Checkbox } from "$lib/components/ui/checkbox"
  import autoAnimate from "@formkit/auto-animate"

  export let constraint: ISelectFieldConstraint | undefined
  const colors = new ColorsVO()
  export let option: ISelectFieldOption = { options: [] }

  $: if (!option.options.length) {
    option = {
      options: [
        {
          color: COLORS[0],
          name: "option1",
          id: OptionIdVo.create().value,
        },
      ],
    }
  }

  const addOption = () => {
    option.options = [
      ...option.options,
      {
        color: colors.next(option.options[option.options.length - 1]?.color),
        name: `option${option.options.length + 1}`,
        id: OptionIdVo.create().value,
      },
    ]
  }

  const swap = (oldIndex: number, newIndex: number) => {
    const options = [...option.options]
    const [removed] = options.splice(oldIndex, 1)
    options.splice(newIndex, 0, removed)
    option.options = [...options]
  }

  const removeOption = (id: string) => {
    option.options = option.options.filter((o) => o.id !== id)
  }

  let multiple = false
</script>

{#if constraint}
  <div class="space-y-2 pt-2">
    <div class="flex items-center gap-2">
      <Switch
        id="single"
        bind:checked={multiple}
        onCheckedChange={(multiple) => {
          if (!multiple) {
            constraint.max = 1
          } else {
            constraint.max = undefined
          }
        }}
      />
      <Label for="single" class="text-xs font-normal">Allow adding multiple options</Label>
    </div>

    <div class="grid grid-cols-2 gap-2" use:autoAnimate>
      {#if multiple}
        <div class="space-y-1">
          <Label for="min" class="text-xs font-normal">Min items</Label>
          <NumberInput
            id="min"
            min={0}
            max={constraint.max}
            step={1}
            bind:value={constraint.min}
            placeholder="Min items..."
            class="bg-background text-xs"
          />
        </div>
        <div class="space-y-1">
          <Label for="max" class="text-xs font-normal">Max items</Label>
          <NumberInput
            id="max"
            min={constraint.min || 0}
            step={1}
            bind:value={constraint.max}
            placeholder="Max items..."
            class="bg-background text-xs"
          />
        </div>
      {/if}
    </div>

    <div class="space-y-1">
      <p class="text-xs font-normal">Options</p>
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

        <Button on:click={addOption} class="w-full text-xs" size="sm" variant="outline">
          <PlusSquareIcon class="mr-2 h-3 w-3" />
          Add Option
        </Button>
      </div>
    </div>

    <div class="pb-2">
      <Separator />
    </div>
    <div class="flex items-center space-x-2">
      <Checkbox id="required" bind:checked={constraint.required} />
      <Label for="required" class="text-xs font-normal">Mark as required field.</Label>
    </div>
  </div>
{/if}
