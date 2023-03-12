import styled from '@emotion/styled'
import { css } from '@emotion/react'

interface PinnedTDProps {
  pinned?: boolean
  left?: number
}

export const Td = styled.td<PinnedTDProps>`
  background-color: white;
  ${(props) =>
    props.pinned &&
    css`
      position: sticky;
      left: ${props.left ? props.left + 'px' : 0};
      top: 0;
      z-index: 1;
    `}
`

export const PinnedSelection = styled(Td)`
  width: 40px;
  border-right: red;
`
