<script lang="ts">
	import { Separator } from '$lib/components/ui/separator'
	import CreateRecordButton from './CreateRecordButton.svelte'
	import FilterMenu from './FilterMenu.svelte'
	import InsertFieldButton from './InsertFieldButton.svelte'
	import ManageFieldsMenu from './ManageFieldsMenu.svelte'
	import SortMenu from './SortMenu.svelte'
	import SetRowHeight from './SetRowHeight.svelte'
	import ShareViewButton from '$lib/share/ShareViewButton.svelte'
	import CurrentViewButton from '$lib/view/CurrentViewButton.svelte'
</script>

<CreateRecordButton />
<CurrentViewButton />

<Separator orientation="vertical" class="mx-1 h-6" />

<FilterMenu />
<SortMenu />
<ManageFieldsMenu />
<SetRowHeight />
<InsertFieldButton />
<ShareViewButton />
