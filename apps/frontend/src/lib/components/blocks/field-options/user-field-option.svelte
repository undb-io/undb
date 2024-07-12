<script lang="ts">
  import { Label } from "$lib/components/ui/label/index.js"
  import NumberInput from "$lib/components/ui/input/number-input.svelte"
  import { Switch } from "$lib/components/ui/switch/index.js"
  import { type IUserFieldConstraint, type IUserFieldValue } from "@undb/table"
  import autoAnimate from "@formkit/auto-animate"
  import { Separator } from "$lib/components/ui/separator"
  import { Checkbox } from "$lib/components/ui/checkbox"
  import UsersPicker from "../user/users-picker.svelte"
  import UserPicker from "../user/user-picker.svelte"
  import UserFieldComponent from "$lib/components/blocks/field-value/user-field.svelte"
  import { ChevronDownIcon, ChevronsUpDownIcon } from "lucide-svelte"
  import { builderActions, getAttrs } from "bits-ui"
  import { Button } from "$lib/components/ui/button"

  export let constraint: IUserFieldConstraint | undefined = { required: false, max: 1 }
  export let defaultValue: IUserFieldValue | undefined

  let multiple = false
</script>

{#if constraint}
  <div class="space-y-2">
    <div class="my-2 flex items-center gap-2">
      <Switch
        size="sm"
        id="single"
        bind:checked={multiple}
        onCheckedChange={(multiple) => {
          if (!multiple) {
            constraint.max = 1
            if (defaultValue && Array.isArray(defaultValue)) {
              defaultValue = defaultValue[0]
            }
          } else {
            constraint.max = undefined
            if (defaultValue && !Array.isArray(defaultValue)) {
              defaultValue = [defaultValue]
            }
          }
        }}
      />
      <Label for="single" class="text-xs font-normal">Allow adding multiple users</Label>
    </div>

    <div class="w-full space-y-1">
      {#if multiple}
        {#if Array.isArray(defaultValue) || defaultValue === undefined || defaultValue === null}
          <Label for="defaultValue" class="block text-xs font-normal">Default value</Label>
          <UsersPicker
            id="defaultValue"
            class="bg-background w-full flex-1 text-xs"
            placeholder="Default value..."
            bind:value={defaultValue}
          >
            <Button
              slot="trigger"
              variant="outline"
              size="sm"
              let:builder
              let:selected
              builders={[builder]}
              class="flex w-full flex-nowrap items-center justify-between overflow-hidden"
            >
              <div class="flex flex-1 items-center gap-1 overflow-hidden">
                {#each defaultValue ?? [] as user, i}
                  {@const value = selected.find((u) => u.user.id === user)?.user}
                  <UserFieldComponent disableHoverCard value={user} displayValue={value} />
                {/each}
              </div>
              <ChevronDownIcon class="text-muted-foreground h-3 w-3" />
            </Button>
            <ChevronsUpDownIcon class="text-muted-foreground h-3 w-3" />
          </UsersPicker>
        {/if}
      {:else if !Array.isArray(defaultValue)}
        <Label for="defaultValue" class="block text-xs font-normal">Default value</Label>
        <UserPicker
          id="defaultValue"
          class="bg-background w-full flex-1 text-xs"
          placeholder="Default value..."
          bind:value={defaultValue}
        >
          <Button
            slot="trigger"
            variant="outline"
            size="sm"
            let:builder
            let:selected
            builders={[builder]}
            class="flex w-full flex-nowrap items-center justify-between overflow-hidden"
          >
            <UserFieldComponent disableHoverCard value={defaultValue} displayValue={selected?.user} />
            <ChevronDownIcon class="text-muted-foreground h-3 w-3" />
          </Button>
        </UserPicker>
      {/if}
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

    <div class="pb-2">
      <Separator />
    </div>
    <div class="flex items-center space-x-2">
      <Checkbox id="required" bind:checked={constraint.required} />
      <Label for="required" class="text-xs font-normal">Mark as required field.</Label>
    </div>
  </div>
{/if}
