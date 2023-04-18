<script lang="ts">
	import type { NumberFieldValue } from '@undb/core'

	export let value: NumberFieldValue
</script>

<span>{value.unpack()}</span>
