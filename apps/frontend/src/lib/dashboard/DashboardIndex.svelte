<script lang="ts">
	import { dashboardWidgets, getView, readonly } from '$lib/store/table'
	import { widgetItems } from '$lib/store/widget'
	import ReadonlyDashboard from './ReadonlyDashboard.svelte'
	import DashboardView from './DashboardView.svelte'

	const view = getView()

	$: $view, widgetItems.init($dashboardWidgets)
</script>

<svelte:component this={$readonly ? ReadonlyDashboard : DashboardView} />
