import type { IOptionColorName, IOptionColorShade } from '@undb/core'
import type { BadgeProps } from '@undb/ui'
import { Badge } from '@undb/ui'

interface IProps {
  colorName: IOptionColorName
  shade: IOptionColorShade
  name: string
}

export const Option: React.FC<IProps> = ({ colorName, name, shade, ...rest }) => {
  const color = `${colorName}.${shade}`
  const variant: BadgeProps['variant'] = shade < 5 ? 'light' : 'filled'
  return (
    <Badge<'span'>
      component="span"
      {...rest}
      radius="xs"
      bg={color}
      variant={variant}
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
