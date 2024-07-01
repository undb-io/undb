<script lang="ts">
  import { CREATE_FIELD_MODAL, toggleModal } from "$lib/store/modal.store"
  import { PlusIcon } from "lucide-svelte"
</script>

<button
  on:click={() => {
    toggleModal(CREATE_FIELD_MODAL)
  }}
>
  <PlusIcon class="h-3 w-3" />
</button>
