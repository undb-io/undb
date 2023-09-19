<script lang="ts">
	import { Separator } from '$components/ui/separator'
	import ShareViewButton from '$lib/share/ShareViewButton.svelte'
	import TreeConfigMenu from '$lib/tree/TreeConfigMenu.svelte'
	import CreateRecordButton from './CreateRecordButton.svelte'
</script>

<CreateRecordButton />

<Separator orientation="vertical" class="mx-1 h-6" />

<TreeConfigMenu />
<ShareViewButton />
