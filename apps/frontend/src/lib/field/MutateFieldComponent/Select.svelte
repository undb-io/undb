<script lang="ts">
	import * as Alert from '$lib/components/ui/alert'
	import { fieldProxy, type SuperForm } from 'sveltekit-superforms/client'
	import type { UnwrapEffects } from 'sveltekit-superforms'
	import OptionsInput from '../FieldInputs/OptionsInput.svelte'
	import type { Writable } from 'svelte/store'
	import { t } from '$lib/i18n'
	import type { FieldTypeConvertStrategy } from '@undb/core'
	import { Label } from '$components/ui/label'

	export let form: SuperForm<UnwrapEffects<string>, unknown>
	export let path: any[] = []
	export let isUpdatingType = false
	export let fieldConvertStrategy: FieldTypeConvertStrategy | undefined = undefined

	const options = fieldProxy(form.form, [...path, 'options'] as any) as Writable<any>
</script>

{#if isUpdatingType && fieldConvertStrategy === 'match'}
	<Alert.Root>
		<Alert.Title>
			{$t('updatingType.select')}
		</Alert.Title>
	</Alert.Root>
{:else}
	<div class="space-y-2">
		<Label class="space-y-2">
			<span>{$t('Options')}</span>
		</Label>
		<OptionsInput bind:value={$options} />
	</div>
{/if}
