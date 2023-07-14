import { ParentField } from '../parent/parent-field.js'
import { TreeField } from './tree-field.js'

describe('TreeField', () => {
  test('createParentField', () => {
    const treeField = TreeField.create({
      id: 'tree',
      name: 'tree',
    })

    const parentField = treeField.createParentField()

    expect(parentField).to.be.instanceOf(ParentField)
    expect(parentField.treeFieldId.value).to.be.eq(treeField.id.value)
    expect(treeField.parentFieldId?.value).to.be.eq(parentField.id.value)
  })
})
