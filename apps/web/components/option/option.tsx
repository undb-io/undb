import type { IOptionColorName, IOptionColorShade } from '@egodb/core'
import type { BadgeVariant } from '@egodb/ui'
import { Badge } from '@egodb/ui'

interface IProps {
  id: string
  colorName: IOptionColorName
  shade: IOptionColorShade
  name: string
}

export const Option: React.FC<IProps> = ({ colorName, name, shade, id, ...rest }) => {
  const color = `${colorName}.${shade}`
  const variant: BadgeVariant = shade < 5 ? 'light' : 'filled'
  return (
    <Badge<'span'>
      component="span"
      {...rest}
      radius="xs"
      bg={color}
      variant={variant}
      data-option-id={id}
      styles={{
        root: {
          textTransform: 'unset',
        },
      }}
    >
      {name}
    </Badge>
  )
}
