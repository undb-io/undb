import { yoga } from "@elysiajs/graphql-yoga"
import { executionContext } from "@undb/context/server"
import { QueryBus } from "@undb/cqrs"
import { inject, singleton } from "@undb/di"
import {
  GetAggregatesQuery,
  GetBaseQuery,
  GetBasesQuery,
  GetMembersQuery,
  GetRecordAuditsQuery,
  GetShareQuery,
  GetTableByShareQuery,
  GetTableQuery,
  GetTablesByBaseIdQuery,
  GetTablesQuery,
} from "@undb/queries"
import { injectShareService, type IShareService } from "@undb/share"
import { TableIdVo, injectRecordQueryRepository, type IRecordQueryRepository } from "@undb/table"
import { injectUserQueryRepository, type IUserQueryRepository } from "@undb/user"

@singleton()
export class Graphql {
  constructor(
    @inject(QueryBus)
    public readonly queryBus: QueryBus,
    @injectRecordQueryRepository()
    public readonly repo: IRecordQueryRepository,
    @injectUserQueryRepository()
    public readonly userRepo: IUserQueryRepository,
    @injectShareService()
    public readonly shareService: IShareService,
  ) {}

  public route() {
    return yoga({
      typeDefs: `
      scalar JSON

      enum ShareTargetType {
        view
        form
      }

      type ShareTarget {
        id: ID!
        type: ShareTargetType!
      }

      type Share {
        id: ID!
        enabled: Boolean!
        target: ShareTarget!
      }

      enum WorkspaceRole {
        owner
        admin
        viewer
      }

      enum FieldType {
        string
        number
        rating
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

        shareId: ID
        share: Share
      }

      type ViewData {
        aggregate: JSON
      }

      type FormOption {
        backgroundColor: String
      }

      type Form {
        id: ID!
        name: String!
        description: String
        fields: JSON
        option: FormOption

        shareId: ID
        share: Share
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

        baseId: String!

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

      type User {
        id: ID!
        email: String!
        username: String!
      }

      type WorkspaceMember {
        role: WorkspaceRole!

        user: User!
      }

      type Base {
        id: ID!
        name: String!

        tables: [Table]!
      }

      type Query {
        member: WorkspaceMember
        members(q: String): [WorkspaceMember]!

        tables: [Table]!
        table(id: ID!): Table

        bases: [Base]
        base(id: ID!): Base!

        recordAudits(recordId: ID!): [Audit]

        share(id: ID!): Share
        tableByShare(shareId: ID!): Table
      }
      `,
      resolvers: {
        Query: {
          members: async (_, args) => {
            return this.queryBus.execute(new GetMembersQuery({ q: args?.q }))
          },
          member: () => {
            const member = executionContext.getStore()?.member
            if (!member?.role) {
              throw new Error("Unauthorized")
            }
            const user = executionContext.getStore()?.user
            return { role: member.role, userId: user?.userId }
          },
          table: async (_, args) => {
            const table = await this.queryBus.execute(new GetTableQuery({ tableId: args.id }))
            return table
          },
          tableByShare: async (_, args) => {
            const table = await this.queryBus.execute(new GetTableByShareQuery({ shareId: args.shareId }))
            return table
          },
          tables: async () => {
            return this.queryBus.execute(new GetTablesQuery())
          },
          bases: async () => {
            return this.queryBus.execute(new GetBasesQuery())
          },
          base: async (_, { id }) => {
            const base = await this.queryBus.execute(new GetBaseQuery({ baseId: id }))
            return base
          },
          recordAudits: async (_, { recordId }) => {
            const { audits } = await this.queryBus.execute(new GetRecordAuditsQuery({ recordId }))
            return audits
          },
          share: async (_, { id }) => {
            const share = await this.queryBus.execute(new GetShareQuery({ shareId: id }))
            return share
          },
        },
        Base: {
          // @ts-ignore
          tables: async (base) => {
            return this.queryBus.execute(new GetTablesByBaseIdQuery({ baseId: base.id }))
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
        WorkspaceMember: {
          // @ts-ignore
          user: async (member) => {
            return (await this.userRepo.findOneById(member.userId)).unwrap()
          },
        },
        View: {
          // @ts-ignore
          share: async (view) => {
            return (await this.shareService.getShareByTarget({ type: "view", id: view.id })).into(null)
          },
        },
        Form: {
          // @ts-ignore
          share: async (form) => {
            return (await this.shareService.getShareByTarget({ type: "form", id: form.id })).into(null)
          },
        },
      },
      batching: true,
    })
  }
}
