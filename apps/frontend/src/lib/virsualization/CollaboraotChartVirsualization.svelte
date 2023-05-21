<script lang="ts">
	import type { CollaboratorField, IChartData, ICollaboratorProfile } from '@undb/core'
	import { Bar } from 'svelte-chartjs'
	import { Chart, Title, Tooltip, Legend, BarElement, CategoryScale, LinearScale } from 'chart.js'
	import { t } from '$lib/i18n'

	export let field: CollaboratorField
	export let data: IChartData<ICollaboratorProfile> = []

	$: labels = data.map(({ meta }) => meta.username ?? $t('null', { ns: 'common' }))
	$: values = data.map((v) => v.value)
	// $: backgroundColor = options.map((option) => (option ? colors[option.color.name][400] : colors.gray[400]))
	$: datasets = [
		{
			label: field.name.value,
			data: values,
			// backgroundColor,
		},
	]

	$: barData = {
		labels,
		datasets,
	}

	Chart.register(Title, Tooltip, Legend, BarElement, CategoryScale, LinearScale)
</script>

<Bar data={barData} options={{ responsive: true, animation: false }} />
