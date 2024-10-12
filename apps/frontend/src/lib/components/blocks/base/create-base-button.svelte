<script lang="ts">
  import { Button } from "$lib/components/ui/button"
  import { CREATE_BASE_MODAL, IMPORT_TEMPLATE_MODAL, toggleModal } from "$lib/store/modal.store"
  import { hasPermission } from "$lib/store/space-member.store"
  import { CirclePlusIcon, PackageIcon } from "lucide-svelte"
</script>

{#if $hasPermission("base:create")}
  <Button class="w-48" on:click={() => toggleModal(CREATE_BASE_MODAL)} {...$$restProps}>
    <CirclePlusIcon class="mr-2 size-4" />
    Create New Base</Button
  >
  <Button on:click={() => toggleModal(IMPORT_TEMPLATE_MODAL)} {...$$restProps}>
    <PackageIcon class="mr-2 size-4" />
    Import From Template</Button
  >
{/if}
