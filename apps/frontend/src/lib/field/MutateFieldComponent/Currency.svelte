<script lang="ts">
	import type { Writable } from 'svelte/store'

	import { fieldProxy, type SuperForm } from 'sveltekit-superforms/client'
	import type { UnwrapEffects } from 'sveltekit-superforms'
	import { type ICurrencySymbol, currencySymbols } from '@undb/core'
	import { onMount } from 'svelte'
	import { i18n, t } from '$lib/i18n'
	import * as DropdownMenu from '$lib/components/ui/dropdown-menu'
	import { Button } from '$lib/components/ui/button'
	import { Label } from '$components/ui/label'

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

<DropdownMenu.Root positioning={{ placement: 'bottom-start' }}>
	<DropdownMenu.Trigger asChild let:builder>
		<Label class="flex flex-col gap-2">
			{$t('symbol')}
			<Button type="button" variant="outline" builders={[builder]} {...$$restProps}>
				{$symbol}
			</Button>
		</Label>
	</DropdownMenu.Trigger>
	<DropdownMenu.Content class="w-56">
		<DropdownMenu.RadioGroup bind:value={$symbol}>
			{#each items as item}
				<DropdownMenu.RadioItem value={item.value}>{item.name}</DropdownMenu.RadioItem>
			{/each}
		</DropdownMenu.RadioGroup>
	</DropdownMenu.Content>
</DropdownMenu.Root>
