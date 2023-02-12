import { ParentField } from './parent-field.js'
import { TreeField } from './tree-field.js'

describe('TreeField', () => {
  test('createParentField', () => {
    const treeFeild = TreeField.create({
      id: 'tree',
      name: 'tree',
    })

    const parentField = treeFeild.createParentField()

    expect(parentField).to.be.instanceOf(ParentField)
    expect(parentField.treeFieldId.value).to.be.eq(treeFeild.id.value)
    expect(treeFeild.parentFieldId?.value).to.be.eq(parentField.id.value)
  })
})
