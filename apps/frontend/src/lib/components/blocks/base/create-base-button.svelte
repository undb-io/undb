<script lang="ts">
  import { Button } from "$lib/components/ui/button"
  import { CREATE_BASE_MODAL, IMPORT_TEMPLATE_MODAL, toggleModal } from "$lib/store/modal.store"
  import { hasPermission } from "$lib/store/space-member.store"
</script>

{#if $hasPermission("base:create")}
  <Button class="w-48" on:click={() => toggleModal(CREATE_BASE_MODAL)} {...$$restProps}>Create New Base</Button>
  <Button class="w-48" on:click={() => toggleModal(IMPORT_TEMPLATE_MODAL)} {...$$restProps}>Import From Template</Button
  >
{/if}
