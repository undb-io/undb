<script lang="ts">
  import { PlusIcon } from "lucide-svelte"
  import CreateFieldButton from "../create-field/create-field-button.svelte"
  import { hasPermission } from "$lib/store/space-member.store"
  export let readonly: boolean = false
</script>

{#if !readonly && $hasPermission("field:create")}
  <CreateFieldButton variant="ghost" size="xs">
    <PlusIcon class="h-3 w-3" />
  </CreateFieldButton>
{/if}
