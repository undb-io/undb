<script lang="ts">
	import type { IChartData, SelectField } from '@undb/core'
	import { Bar } from 'svelte-chartjs'
	import { Chart, Title, Tooltip, Legend, BarElement, CategoryScale, LinearScale } from 'chart.js'
	import colors from 'tailwindcss/colors'
	import { t } from '$lib/i18n'

	export let field: SelectField
	export let data: IChartData = []

	$: optionIds = data.map((v) => v.key)
	$: options = optionIds.map((id) => (id ? field.options.getById(id).into(null) : null))
	$: labels = options.map((option) => option?.name.value ?? $t('null', { ns: 'common' }))
	$: values = data.map((v) => v.value)
	$: backgroundColor = options.map((option) => (option ? colors[option.color.name][400] : colors.gray[400]))
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
