import styled from '@emotion/styled'
import { css } from '@emotion/react'

interface PinnedTDProps {
  pinned?: boolean
  left?: number
  isLast?: boolean
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

      box-shadow: ${props.isLast ? 'rgb(7 0 20 / 10%) 1px 0px 3px 0px, rgb(7 0 20 / 6%) 1px 0px 2px 0px' : 'unset'};
    `}
`

export const PinnedSelection = styled(Td)`
  width: 40px;
  border-right: red;
`
