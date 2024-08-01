<script lang="ts">
  import type { IMultipleUserFieldValue, IUserFieldDisplayValue, UserField } from "@undb/table"
  import UserFieldComponent from "$lib/components/blocks/field-value/user-field.svelte"
  import { GetUserFilterValueStore } from "$houdini"

  export let field: UserField
  export let value: IMultipleUserFieldValue
  export let users: (IUserFieldDisplayValue & { id: string })[] = []

  $: store = new GetUserFilterValueStore()
  $: value && !users.length && store.fetch({ variables: { ids: value } })
  $: members = $store.data?.membersByIds ?? []
</script>

<div class="flex flex-1 items-center gap-2">
  {#each value ?? [] as user, i}
    {@const value = users?.find((u) => u?.id === user) ?? members.find((u) => u?.user.id === user)?.user}
    <UserFieldComponent disableHoverCard value={user} displayValue={value} />
  {/each}
</div>
