<script lang="ts">
	import { page } from '$app/stores'
	import { TableFactory } from '@undb/core'
	import type { LayoutData } from './$types'
	import { goto } from '$app/navigation'
	import { currentFLSS, currentRLSS, currentTable, currentView } from '$lib/store/table'
	import { FLSFactory, RLSFactory } from '@undb/authz'

	export let data: LayoutData

	$: if (!data.table?.table && !$page.error) {
		goto('/', { replaceState: true })
	}

	$: if (data.table?.table) {
		currentTable.set(TableFactory.fromQuery(data.table?.table))
		currentView.set($currentTable.mustGetView($page.params.viewId))
	}

	$: if (Array.isArray(data.table?.rlss)) {
		currentRLSS.set(data.table?.rlss.map((rls) => RLSFactory.fromQuery(rls)))
	}

	$: if (Array.isArray(data.table?.flss)) {
		currentFLSS.set(data.table?.flss.map((fls) => FLSFactory.fromQuery(fls)))
	}
</script>

<slot />
