import { yoga } from "@elysiajs/graphql-yoga"
import { QueryBus } from "@undb/cqrs"
import { container, inject, singleton } from "@undb/di"
import { GetTableQuery, GetTablesQuery } from "@undb/queries"

@singleton()
export class Graphql {
  constructor(
    @inject(QueryBus)
    public readonly queryBus: QueryBus,
  ) {}

  public get yoga() {
    return yoga({
      typeDefs: `
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
      }

      enum ViewType {
        grid
      }

      type View {
        id: ID!
        name: String!
        type: ViewType!
      }

      type Table {
        id: ID!
        name: String!
        schema: [Field!]!
        views: [View!]!

        recordsCount: Int!
      }

      type Query {
        tables: [Table]
        table(id: ID!): Table
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
        },
        Table: {
          // @ts-ignore
          recordsCount: (table) => 100,
        },
      },
      batching: true,
    })
  }
}

export const graphql = () => container.resolve(Graphql)
