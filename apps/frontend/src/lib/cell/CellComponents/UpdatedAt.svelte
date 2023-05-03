<script lang="ts">
	import type { UpdatedAtField, UpdatedAtFieldValue } from '@undb/core'
	import DateComponent from './DateComponent.svelte'

	export let value: UpdatedAtFieldValue
	export let field: UpdatedAtField
</script>

<DateComponent value={value.unpack()} formatString={field.formatString} />
