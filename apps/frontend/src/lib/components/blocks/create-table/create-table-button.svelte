<script lang="ts">
  import { PlusCircleIcon } from "lucide-svelte"
  import Button from "$lib/components/ui/button/button.svelte"
  import { CREATE_TABLE_MODAL, toggleModal } from "$lib/store/modal.store"
  import { hasPermission } from "$lib/store/workspace-member.store"
</script>

{#if $hasPermission("table:create")}
  <Button size="sm" class="w-full" on:click={() => toggleModal(CREATE_TABLE_MODAL)} {...$$restProps}>
    <PlusCircleIcon class="mr-2 h-4 w-4" />
    Create table
  </Button>
{/if}
