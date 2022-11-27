import { useCreateTableFormContext } from './create-table-form-context'

export const CreateTableFormSchema: React.FC = () => {
  const form = useCreateTableFormContext()

  return (
    <>
      {form.values.schema.map((column) => {
        return <h1>{column.name + column.type}</h1>
      })}
    </>
  )
}
