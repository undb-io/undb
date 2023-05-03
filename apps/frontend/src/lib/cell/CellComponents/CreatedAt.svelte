<script lang="ts">
	import type { CreatedAtField, CreatedAtFieldValue } from '@undb/core'
	import DateComponent from './DateComponent.svelte'

	export let value: CreatedAtFieldValue
	export let field: CreatedAtField
</script>

<DateComponent value={value.unpack()} formatString={field.formatString} />
