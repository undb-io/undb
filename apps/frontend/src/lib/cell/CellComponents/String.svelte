<script lang="ts">
	import type { StringFieldValue } from '@undb/core'

	export let value: StringFieldValue
</script>

<span>{value.unpack() ?? ''} </span>
