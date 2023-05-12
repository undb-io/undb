<script lang="ts">
	import type { Option, SelectField } from '@undb/core'
	import { Bar } from 'svelte-chartjs'
	import { Chart, Title, Tooltip, Legend, BarElement, CategoryScale, LinearScale } from 'chart.js'
	import colors from 'tailwindcss/colors'
	import { t } from '$lib/i18n'

	export let field: SelectField
	export let data: { key: string | null; value: number }[] = []

	$: optionIds = data.map((v) => v.key)
	$: options = optionIds.map((id) => (id ? field.options.getById(id).into(null) : null))
	$: labels = options.map((option) => option?.name.value ?? $t('null', { ns: 'common' }))
	$: values = data.map((v) => v.value)
	$: backgroundColor = options.map((option) => (option ? colors[option.color.name][400] : colors.gray[400]))
	$: borderColor = options.map((option) => (option ? colors[option.color.name][700] : colors.gray[600]))
	$: datasets = [
		{
			label: field.name.value,
			data: values,
			backgroundColor,
			borderColor,
			borderWidth: 2,
		},
	]

	$: barData = {
		labels,
		datasets,
	}

	$: console.log(barData)

	Chart.register(Title, Tooltip, Legend, BarElement, CategoryScale, LinearScale)
</script>

<Bar data={barData} options={{ responsive: true }} />
