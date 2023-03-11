import styled from '@emotion/styled'
import type { StyledComponent } from '@emotion/styled/types'

export const PinnedTD: StyledComponent<object> = styled.td`
  position: sticky;
  left: 0;
  top: 0;
  z-index: 1;
  background-color: white;
`

export const PinnedSelection: StyledComponent<object> = styled(PinnedTD)`
  width: 40px;
  border-right: red;
`
