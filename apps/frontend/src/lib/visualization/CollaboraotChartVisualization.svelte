<script lang="ts">
	import type { CollaboratorField, IChartData, ICollaboratorProfile, IColor } from '@undb/core'
	import { Bar } from 'svelte-chartjs'
	import { Chart, Title, Tooltip, Legend, BarElement, CategoryScale, LinearScale } from 'chart.js'
	import { t } from '$lib/i18n'
	import colors from 'tailwindcss/colors'

	export let field: CollaboratorField
	export let data: IChartData<ICollaboratorProfile> = []

	$: labels = data.map(({ meta }) => meta.username ?? $t('null', { ns: 'common' }))
	$: values = data.map((v) => v.value)
	$: backgroundColor = data.map(({ meta }) => colors[meta.color as IColor][500])
	$: datasets = [
		{
			label: field.name.value,
			data: values,
			backgroundColor,
		},
	]

	$: barData = {
		labels,
		datasets,
	}

	Chart.register(Title, Tooltip, Legend, BarElement, CategoryScale, LinearScale)
</script>

<Bar data={barData} options={{ responsive: true, animation: false }} />
