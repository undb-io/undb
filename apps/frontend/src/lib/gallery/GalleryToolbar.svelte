<script lang="ts">
	import { Separator } from '$components/ui/separator'
	import ShareViewButton from '$lib/share/ShareViewButton.svelte'
	import CreateRecordButton from '$lib/table/CreateRecordButton.svelte'
	import FilterMenu from '$lib/table/FilterMenu.svelte'
	import InsertFieldButton from '$lib/table/InsertFieldButton.svelte'
	import ManageFieldsMenu from '$lib/table/ManageFieldsMenu.svelte'
	import SortMenu from '$lib/table/SortMenu.svelte'
	import CurrentViewButton from '$lib/view/CurrentViewButton.svelte'
	import GalleryConfigMenu from './GalleryConfigMenu.svelte'
</script>

<CreateRecordButton />
<CurrentViewButton />

<Separator orientation="vertical" class="mx-1 h-6" />

<GalleryConfigMenu />
<FilterMenu />
<SortMenu />
<ManageFieldsMenu />
<InsertFieldButton />
<ShareViewButton />
