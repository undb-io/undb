import { yoga } from "@elysiajs/graphql-yoga"
import { useOpenTelemetry } from "@envelop/opentelemetry"
import * as otel from "@opentelemetry/api"
import { executionContext, getCurrentSpaceId } from "@undb/context/server"
import { QueryBus } from "@undb/cqrs"
import { inject, singleton } from "@undb/di"
import {
  GetAggregatesQuery,
  GetBaseQuery,
  GetBasesQuery,
  GetInivitationsQuery,
  GetMemberByIdQuery,
  GetMembersByIdsQuery,
  GetMembersQuery,
  GetRecordAuditsQuery,
  GetRollupForeignTablesQuery,
  GetShareQuery,
  GetSpaceByIdQuery,
  GetTableByShareQuery,
  GetTableForeignTablesQuery,
  GetTableQuery,
  GetTablesByBaseIdQuery,
  GetTablesQuery,
} from "@undb/queries"
import { injectShareService, type IShareService } from "@undb/share"
import {
  TableIdVo,
  injectObjectStorage,
  injectRecordQueryRepository,
  type IObjectStorage,
  type IRecordQueryRepository,
} from "@undb/table"
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
    @injectObjectStorage()
    public readonly objectStorage: IObjectStorage,
  ) {}

  public route() {
    return yoga({
      typeDefs: `
      scalar JSON
      scalar File

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

      enum SpaceRole {
        owner
        admin
        viewer
      }

      enum FieldType {
        string
        number
        rating
        email
        id
        createdAt
        createdBy
        updatedAt
        updatedBy
        autoIncrement
        select
        reference
        rollup
        attachment
        date
        json
        checkbox
        user
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

        base: Base!

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
        operator: User!
        tableId: ID!
        recordId: ID!
        op: String!
        detail: JSON
        meta: JSON
      }

      type User {
        id: ID!
        email: String!
        username: String!
      }

      type Space {
        id: ID!
        name: String!
      }

      type SpaceMember {
        role: SpaceRole!

        spaceId: String!

        user: User!
      }

      type Base {
        id: ID!
        name: String!

        tables: [Table]!
      }

      enum InvitationStatus {
        pending
        accepted
        rejected
      }

      type Invitation {
        id: ID!
        email: String!
        role: SpaceRole!
        status: InvitationStatus!
        invitedAt: String!
      }

      type Query {
        member: SpaceMember
        memberById(id: ID!): SpaceMember
        membersByIds(ids: [ID!]!): [SpaceMember!]!
        members(spaceId: String!, q: String): [SpaceMember]!

        space: Space

        invitations(status: InvitationStatus): [Invitation!]!

        tables: [Table]!
        table(id: ID!): Table
        tableForeignTables(tableId: ID!): [Table!]!
        rollupForeignTables(tableId: ID!, fieldId: ID!): [Table!]!

        bases: [Base]
        base(id: ID!): Base!

        recordAudits(recordId: ID!): [Audit]

        share(id: ID!): Share
        tableByShare(shareId: ID!): Table
      }

      `,
      plugins: [
        useOpenTelemetry(
          {
            resolvers: true, // Tracks resolvers calls, and tracks resolvers thrown errors
            variables: true, // Includes the operation variables values as part of the metadata collected
            result: false, // Includes execution result object as part of the metadata collected
            document: false, // Includes the operation document as part of the metadata collected
          },
          otel.trace.getTracerProvider(),
        ),
      ],

      resolvers: {
        Query: {
          space: async () => {
            const spaceId = getCurrentSpaceId()
            if (!spaceId) {
              return null
            }

            return this.queryBus.execute(new GetSpaceByIdQuery({ id: spaceId }))
          },
          members: async (_, args) => {
            return this.queryBus.execute(new GetMembersQuery({ spaceId: args.spaceId, q: args?.q }))
          },
          memberById: async (_, args) => {
            const member = await this.queryBus.execute(new GetMemberByIdQuery({ id: args.id }))
            return member
          },
          membersByIds: async (_, args) => {
            return this.queryBus.execute(new GetMembersByIdsQuery({ ids: args.ids as [string, ...string[]] }))
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
          tableForeignTables: async (_, args) => {
            return this.queryBus.execute(new GetTableForeignTablesQuery({ tableId: args.tableId }))
          },
          rollupForeignTables: async (_, args) => {
            return this.queryBus.execute(
              new GetRollupForeignTablesQuery({
                tableId: args.tableId,
                fieldId: args.fieldId,
              }),
            )
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
          invitations: async (_, args) => {
            return await this.queryBus.execute(new GetInivitationsQuery({ status: args?.status }))
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
          // @ts-ignore
          base: async (table) => {
            return this.queryBus.execute(new GetBaseQuery({ baseId: table.baseId }))
          },
        },
        ViewData: {
          // @ts-ignore
          aggregate: async (table, { viewId }, __, info) => {
            return this.queryBus.execute(new GetAggregatesQuery({ tableId: info.variableValues.tableId, viewId }))
          },
        },
        SpaceMember: {
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
        Audit: {
          // @ts-ignore
          operator: async (audit) => {
            return (await this.userRepo.findOneById(audit.operatorId)).unwrap()
          },
        },
      },
      batching: true,
    })
  }
}
