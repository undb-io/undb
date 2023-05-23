<script lang="ts">
	import type { Writable } from 'svelte/store'

	import { Label, Select } from 'flowbite-svelte'
	import { fieldProxy, type SuperForm } from 'sveltekit-superforms/client'
	import type { UnwrapEffects } from 'sveltekit-superforms'
	import { type ICurrencySymbol, currencySymbols } from '@undb/core'
	import { onMount } from 'svelte'
	import { i18n } from '$lib/i18n'

	export let path: any[] = []
	export let form: SuperForm<UnwrapEffects<string>, unknown>

	const symbol = fieldProxy(form.form, [...path, 'symbol'] as any) as Writable<ICurrencySymbol>

	onMount(() => {
		if (!$symbol) {
			const language = $i18n.language
			if (language === 'zh-CN') {
				$symbol = '¥' as never
			} else {
				$symbol = '$'
			}
		}
	})

	const items = currencySymbols.map((symbol) => ({ value: symbol, name: symbol }))
</script>

<div>
	<Label>
		<Select {items} bind:value={$symbol} />
	</Label>
</div>
