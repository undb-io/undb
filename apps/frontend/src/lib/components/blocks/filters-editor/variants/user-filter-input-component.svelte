<script lang="ts">
  import type {
    CreatedByField,
    ISingleUserFieldValue,
    IUserFieldDisplayValue,
    UpdatedByField,
    UserField,
  } from "@undb/table"
  import UserFieldComponent from "$lib/components/blocks/field-value/user-field.svelte"
  import { GetUserFilterValueStore } from "$houdini"

  export let field: UserField | CreatedByField | UpdatedByField
  export let value: ISingleUserFieldValue
  export let user: IUserFieldDisplayValue | undefined

  $: store = new GetUserFilterValueStore()
  $: value && !user && store.fetch({ variables: { ids: [value] } })
  $: users = $store.data?.membersByIds ?? []
</script>

<UserFieldComponent disableHoverCard {value} displayValue={user ?? users.find((u) => u.user.id === value)?.user} />
