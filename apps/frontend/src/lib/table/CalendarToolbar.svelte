<script lang="ts">
	import { Separator } from '$components/ui/separator'
	import CalendarConfigMenu from '$lib/calendar/CalendarConfigMenu.svelte'
	import ShareViewButton from '$lib/share/ShareViewButton.svelte'
	import CurrentViewButton from '$lib/view/CurrentViewButton.svelte'
	import CreateRecordButton from './CreateRecordButton.svelte'
	import FilterMenu from './FilterMenu.svelte'
	import InsertFieldButton from './InsertFieldButton.svelte'
	import ManageFieldsMenu from './ManageFieldsMenu.svelte'
	import SortMenu from './SortMenu.svelte'
</script>

<CreateRecordButton />
<CurrentViewButton />

<Separator orientation="vertical" class="mx-1 h-6" />

<CalendarConfigMenu />
<FilterMenu />
<SortMenu />
<ManageFieldsMenu />
<InsertFieldButton />
<ShareViewButton />
