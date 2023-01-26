import { ParentField } from './parent-field'
import { TreeField } from './tree-field'

describe('TreeField', () => {
  test('createParentField', () => {
    const treeFeild = TreeField.create({
      type: 'tree',
      id: 'tree',
      name: 'tree',
    })

    const parentField = treeFeild.createParentField()

    expect(parentField).to.be.instanceOf(ParentField)
    expect(parentField.treeFieldId.value).to.be.eq(treeFeild.id.value)
    expect(treeFeild.parentFieldId?.value).to.be.eq(parentField.id.value)
  })
})
