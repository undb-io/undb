<script lang="ts">
  import { isUserFieldMacro, type IUserFieldDisplayValue, type IUserFieldValue, type UserField } from "@undb/table"
  import UserPicker from "../user/user-picker.svelte"
  import UsersPicker from "../user/users-picker.svelte"
  import { Button } from "$lib/components/ui/button"
  import { ChevronsUpDownIcon } from "lucide-svelte"
  import UserFieldComponent from "$lib/components/blocks/field-value/user-field.svelte"
  import { cn } from "$lib/utils"
  import UserMacro from "../user/user-macro.svelte"

  export let field: UserField
  export let value: IUserFieldValue
  export let displayValue: IUserFieldDisplayValue[] | IUserFieldDisplayValue | null
  export let onValueChange: (value: IUserFieldValue) => void
</script>

{#if field.isSingle}
  {#if !Array.isArray(value) && !Array.isArray(displayValue)}
    <UserPicker sameWidth bind:value {onValueChange}>
      <Button
        slot="trigger"
        let:builder
        let:selected
        variant="outline"
        builders={[builder]}
        class={cn("flex w-full items-center justify-between", $$restProps.class)}
      >
        {#if value && isUserFieldMacro(value)}
          <UserMacro {value} />
        {/if}
        <UserFieldComponent disableHoverCard {value} displayValue={selected?.user ?? displayValue} />
        <ChevronsUpDownIcon class="text-muted-foreground h-3 w-3" />
      </Button>
    </UserPicker>
  {/if}
{:else if (Array.isArray(value) || value === undefined || value === null) && (Array.isArray(displayValue) || !displayValue)}
  <UsersPicker sameWidth bind:value {onValueChange}>
    <Button
      slot="trigger"
      let:builder
      let:selected
      variant="outline"
      builders={[builder]}
      class={cn("flex w-full items-center justify-between", $$restProps.class)}
    >
      <div class="flex flex-1 items-center gap-2">
        {#each value ?? [] as user, i}
          {#if isUserFieldMacro(user)}
            <UserMacro value={user} />
          {:else}
            {@const value = selected.find((u) => u.user.id === user)?.user ?? displayValue?.[i]}
            <UserFieldComponent disableHoverCard value={user} displayValue={value} />
          {/if}
        {/each}
      </div>
      <ChevronsUpDownIcon class="text-muted-foreground h-3 w-3" />
    </Button>
  </UsersPicker>
{/if}
