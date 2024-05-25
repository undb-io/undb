<script lang="ts">
  import CreateRecordButton from "../create-record/create-record-button.svelte"
  import ViewFilterEditor from "../view-filter-editor/view-filter-editor.svelte"
  import ViewColorEditor from "../view-color-editor/view-color-editor.svelte"
  import ViewSort from "../view-sort/view-sort.svelte"
  import RecordsSearch from "../search/records-search.svelte"
  import Button from "$lib/components/ui/button/button.svelte"
  import { CREATE_FIELD_MODAL, modal, toggleModal } from "$lib/store/modal.store"
</script>

<div class="flex items-center justify-between gap-2 px-4 py-2">
  <div class="flex items-center gap-2">
    <CreateRecordButton />
    <ViewFilterEditor />
    <ViewColorEditor />
    <ViewSort />

    <Button on:click={() => toggleModal(CREATE_FIELD_MODAL)}>wtf</Button>
  </div>

  <div>
    <RecordsSearch />
  </div>
</div>
