<script lang="ts">
	import type { SuperForm } from 'sveltekit-superforms/client'
	import type { UnwrapEffects } from 'sveltekit-superforms/index'
	import DateFormat from './DateFormat.svelte'
	import TimeFormatPicker from './TimeFormatPicker.svelte'

	export let form: SuperForm<UnwrapEffects<string>, unknown>
</script>

<div class="space-y-4">
	<DateFormat {form} {...$$restProps} />
	<TimeFormatPicker {form} {...$$restProps} />
</div>
