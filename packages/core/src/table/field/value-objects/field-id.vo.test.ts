import { FieldId } from './field-id.vo.js'

describe('FieldId.createId', () => {
  test('should create field id', () => {
    const id = FieldId.createId()
    expect(id).to.be.string
    expect(id).not.to.be.empty
    expect(id.startsWith('fld')).to.be.true
    expect(id).to.have.length(11)
  })
})
