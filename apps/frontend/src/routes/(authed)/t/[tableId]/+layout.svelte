<script lang="ts">
	import { page } from '$app/stores'
	import { TableFactory } from '@undb/core'
	import type { LayoutData } from './$types'
	import { goto } from '$app/navigation'
	import { currentTable, currentView } from '$lib/store/table'

	export let data: LayoutData

	$: if (!data.table && !$page.error) {
		goto('/', { replaceState: true })
	}

	$: if (data.table) {
		currentTable.set(TableFactory.fromQuery(data.table))
		currentView.set($currentTable.mustGetView($page.params.viewId))
	}
</script>

<slot />
