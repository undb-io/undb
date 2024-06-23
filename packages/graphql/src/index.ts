import { yoga } from "@elysiajs/graphql-yoga"
import { executionContext } from "@undb/context/server"
import { QueryBus } from "@undb/cqrs"
import { inject, singleton } from "@undb/di"
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

      enum WorkspaceRole {
        owner
        admin
        viewer
      }

      enum FieldType {
        string
        number
        id
        createdAt
        createdBy
        updatedAt
        updatedBy
        autoIncrement
        select
        reference
        rollup
      }

      type Field {
        id: ID!
        name: String!
        type: FieldType!
        defaultValue: JSON
        display: Boolean
        constraint: JSON
        option: JSON
      }

      enum ViewType {
        grid
      }

      type ViewOption {
        showSystemFields: Boolean
      }

      type View {
        id: ID!
        name: String!
        option: ViewOption
        type: ViewType!
        isDefault: Boolean
        filter: JSON
        color: JSON
        sort: JSON
        aggregate: JSON
        fields: JSON
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
        id: ID!
        name: String!
        enabled: Boolean!
        subject: JSON
        allow: Boolean!
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

      type WorkspaceMember {
        role: WorkspaceRole!
      }

      type Query {
        member: WorkspaceMember

        tables: [Table!]
        table(id: ID!): Table

        recordAudits(recordId: ID!): [Audit]
      }
      `,
      resolvers: {
        Query: {
          member: () => {
            const member = executionContext.getStore()?.member
            if (!member?.role) {
              throw new Error("Unauthorized")
            }
            return { role: member.role }
          },
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
