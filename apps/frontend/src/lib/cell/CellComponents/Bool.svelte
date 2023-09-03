<script lang="ts">
	import { Checkbox } from '$components/ui/checkbox'
	import type { BoolFieldValue } from '@undb/core'

	export let value: BoolFieldValue | undefined
</script>

<Checkbox disabled checked={value?.unpack() ?? false} />
