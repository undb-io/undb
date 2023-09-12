<script lang="ts">
	import { currentRecordId, currentTable, currentView } from '$lib/store/table'
	import { TableFactory } from '@undb/core'
	import type { LayoutData } from './$types'
	import { page } from '$app/stores'
	import ReadonlyRecord from '$lib/record/ReadonlyRecord.svelte'
	import { browser } from '$app/environment'
	import { goto } from '$app/navigation'

	export let data: LayoutData

	$: if (data.share) {
		currentTable.set(TableFactory.fromQuery(data.share.table))
		currentView.set($currentTable.mustGetView($page.params.viewId))
	}

	$: if (browser && !$page.error) {
		if ($currentRecordId) {
			const search = $page.url.searchParams
			search.set('r', $currentRecordId)
			goto(`?${search.toString()}`, { invalidateAll: false })
		}
		if (!$currentRecordId) {
			goto($page.url.pathname, { invalidateAll: false })
		}
	}
</script>

<svelte:head>
	<title>{$currentTable.name.value} - undb</title>
</svelte:head>

<slot />

<ReadonlyRecord />
