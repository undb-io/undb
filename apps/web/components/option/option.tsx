import type { IOptionColorName, IOptionColorShade } from '@egodb/core'
import type { PolymorphicComponentProps, BadgeProps } from '@egodb/ui'
import { Badge } from '@egodb/ui'

interface IProps extends PolymorphicComponentProps<'span', BadgeProps> {
  id: string
  colorName: IOptionColorName
  shade: IOptionColorShade
  name: string
}

export const Option: React.FC<IProps> = ({ colorName, name, shade, id, ...rest }) => {
  return (
    <Badge<'span'> {...rest} radius="xs" color={`${colorName}.${shade}`} data-option-id={id}>
      {name}
    </Badge>
  )
}
