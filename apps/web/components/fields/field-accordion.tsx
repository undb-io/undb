import { Accordion } from '@egodb/ui'

interface IProps {
  index: number
  isNew?: boolean
}
export const FieldAccordion: React.FC<IProps> = ({ index }) => {
  return (
    <Accordion.Item value={String(index)}>
      <Accordion.Control>Field {index}</Accordion.Control>
      <Accordion.Panel>
        Colors, fonts, shadows and many other parts are customizable to fit your design needs
      </Accordion.Panel>
    </Accordion.Item>
  )
}
