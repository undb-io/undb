<script lang="ts">
	import { currentRecordId, currentTable, currentView } from '$lib/store/table'
	import { TableFactory } from '@undb/core'
	import type { LayoutData } from './$types'
	import { page } from '$app/stores'
	import ReadonlyRecord from '$lib/record/ReadonlyRecord.svelte'

	export let data: LayoutData

	$: if (data.share) {
		currentTable.set(TableFactory.fromQuery(data.share.table))
		currentView.set($currentTable.mustGetView($page.params.viewId))
	}
</script>

<svelte:head>
	<title>{$currentTable.name.value} - undb</title>
</svelte:head>

<slot />

{#if $currentRecordId}
	<ReadonlyRecord />
{/if}
