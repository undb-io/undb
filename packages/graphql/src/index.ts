import { yoga } from "@elysiajs/graphql-yoga"
import { QueryBus } from "@undb/cqrs"
import { container, inject, singleton } from "@undb/di"
import { GetAggregatesQuery, GetRecordAuditsQuery, GetTableQuery, GetTablesQuery } from "@undb/queries"
import { TableIdVo, injectRecordQueryRepository, type IRecordQueryRepository } from "@undb/table"

@singleton()
export class Graphql {
  constructor(
    @inject(QueryBus)
    public readonly queryBus: QueryBus,
    @injectRecordQueryRepository()
    public readonly repo: IRecordQueryRepository,
  ) {}

  public route() {
    return yoga({
      typeDefs: `
      scalar JSON

      enum FieldType {
        string
        number
        id
        createdAt
        updatedAt
        autoIncrement
      }

      type Field {
        id: ID!
        name: String!
        type: FieldType!
        defaultValue: JSON
        display: Boolean
        constraint: JSON
      }

      enum ViewType {
        grid
      }

      type View {
        id: ID!
        name: String!
        type: ViewType!
        filter: JSON
        color: JSON
        sort: JSON
        aggregate: JSON
      }

      type ViewData {
        aggregate: JSON
      }

      type Form {
        id: ID!
        name: String!
        description: String
        fields: JSON
      }

      enum RLSAction {
        read
        create
        update
        delete
      }

      type RLS {
        action: RLSAction!
        condition: JSON
        updateCondition: JSON
      }

      type Table {
        id: ID!
        name: String!
        schema: [Field!]!
        views: [View!]!
        forms: [Form]
        rls: [RLS]

        viewData(viewId: ID): ViewData

        recordsCount: Int!
      }

      type Audit {
        id: ID!
        timestamp: String!
        operatorId: ID!
        tableId: ID!
        recordId: ID!
        op: String!
        detail: JSON
      }

      type Query {
        tables: [Table!]
        table(id: ID!): Table

        recordAudits(recordId: ID!): [Audit]
      }
      `,
      resolvers: {
        Query: {
          table: async (_, args) => {
            const table = await this.queryBus.execute(new GetTableQuery({ tableId: args.id }))
            return table
          },
          tables: async () => {
            return this.queryBus.execute(new GetTablesQuery())
          },
          recordAudits: async (_, { recordId }) => {
            const { audits } = await this.queryBus.execute(new GetRecordAuditsQuery({ recordId }))
            return audits
          },
        },
        Table: {
          // @ts-ignore
          recordsCount: async (table) => this.repo.count(new TableIdVo(table.id)),
          // @ts-ignore
          viewData: () => ({}),
        },
        ViewData: {
          // @ts-ignore
          aggregate: async (_, { viewId }, __, info) => {
            return this.queryBus.execute(new GetAggregatesQuery({ tableId: info.variableValues.tableId, viewId }))
          },
        },
      },
      batching: true,
    })
  }
}

export const graphql = () => container.resolve(Graphql)
