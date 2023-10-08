import type { ITemplateSchema } from '../template.schema'
import { TemplateFactory } from '../template.factory'

export const createTestTemplate = () => {
  return TemplateFactory.fromJSON(templateInput)
}

export const templateInput: ITemplateSchema = {
  id: 'tplt1wjru6o',
  name: 'testTable',
  export: {
    tables: [
      {
        id: 'tblsj55f6su',
        name: 'testTable',
        schema: [
          {
            id: 'fldn2672c7n',
            name: 'id',
            display: false,
            required: false,
            type: 'id',
          },
          {
            id: 'fld6elro1gn',
            name: 'name',
            display: true,
            required: false,
            type: 'string',
          },
          {
            id: 'fldkek4etmf',
            name: 'createdAt',
            display: false,
            required: false,
            type: 'created-at',
            format: 'yyyy-MM-dd',
            timeFormat: null,
          },
          {
            id: 'fldx2ekp10u',
            name: 'createdBy',
            display: false,
            required: false,
            type: 'created-by',
          },
          {
            id: 'fldmvgkyxkj',
            name: 'updatedAt',
            display: false,
            required: false,
            type: 'updated-at',
            format: 'yyyy-MM-dd',
            timeFormat: null,
          },
          {
            id: 'fld9v4iiuys',
            name: 'updatedBy',
            display: false,
            required: false,
            type: 'updated-by',
          },
        ],
        views: [
          {
            id: 'viwryu43tdx',
            name: 'testTable',
            showSystemFields: false,
            dashboard: {
              widgets: [],
            },
            displayType: 'grid',
            fieldOptions: {},
            rowHeight: 'short',
          },
        ],
        viewsOrder: ['viwryu43tdx'],
        records: [
          {
            id: 'recidpnmpp6',
            values: {
              fld6elro1gn: 'test data',
            },
          },
        ],
      },
    ],
  },
}
