<script lang="ts">
	import ShareViewButton from '$lib/share/ShareViewButton.svelte'
	import KanbanConfigMenu from '$lib/view/KanbanConfigMenu.svelte'
	import CreateRecordButton from './CreateRecordButton.svelte'
	import FilterMenu from './FilterMenu.svelte'
	import InsertFieldButton from './InsertFieldButton.svelte'
	import ManageFieldsMenu from './ManageFieldsMenu.svelte'
	import SortMenu from './SortMenu.svelte'
</script>

<CreateRecordButton />
<KanbanConfigMenu />
<FilterMenu />
<SortMenu />
<ManageFieldsMenu />
<InsertFieldButton />
<ShareViewButton />
