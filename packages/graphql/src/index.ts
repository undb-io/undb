import { yoga } from "@elysiajs/graphql-yoga"
import { useOpenTelemetry } from "@envelop/opentelemetry"
import * as otel from "@opentelemetry/api"
import type { ISpaceMemberDTO } from "@undb/authz"
import { executionContext, getCurrentSpaceId, getCurrentUserId, mustGetCurrentSpaceId } from "@undb/context/server"
import { QueryBus } from "@undb/cqrs"
import { inject, singleton } from "@undb/di"
import type { Option } from "@undb/domain"
import {
  GetAggregatesQuery,
  GetBaseByShareQuery,
  GetBaseQuery,
  GetBasesQuery,
  GetInivitationsQuery,
  GetMemberByIdQuery,
  GetMembersByIdsQuery,
  GetMemberSpacesQuery,
  GetMembersQuery,
  GetRecordAuditsQuery,
  GetRollupForeignTablesQuery,
  GetShareQuery,
  GetSpaceByIdQuery,
  GetSpaceMemberQuery,
  GetTableByShareBaseQuery,
  GetTableByShareQuery,
  GetTableForeignTablesQuery,
  GetTableQuery,
  GetTablesByBaseIdQuery,
  GetTablesQuery,
  GetTemplateQuery,
} from "@undb/queries"
import { injectShareService, type IShareService } from "@undb/share"
import type { ISpaceDTO } from "@undb/space"
import {
  injectObjectStorage,
  injectRecordQueryRepository,
  TableIdVo,
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
        base
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
        longText
        number
        currency
        rating
        email
        button
        url
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
        duration
        percentage
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
        autoAddNewField: Boolean
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
        avatar: String
      }

      type Space {
        id: ID!
        name: String!
        isPersonal: Boolean!
        avatar: String

        member: SpaceMember
      }

      type SpaceMember {
        role: SpaceRole!

        spaceId: String!

        user: User!
      }

      type Base {
        id: ID!
        name: String!

        share: Share
        tables: [Table]!
      }

      type Template {
        baseId: ID!
        spaceId: ID!
        name: String!
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
        members(q: String): [SpaceMember]!

        space: Space
        spaces: [Space]!

        invitations(status: InvitationStatus): [Invitation!]!

        tables(baseId: ID): [Table]!
        table(id: ID!): Table
        tableForeignTables(tableId: ID!): [Table!]!
        rollupForeignTables(tableId: ID!, fieldId: ID!): [Table!]!

        bases: [Base]
        base(id: ID!): Base!

        recordAudits(recordId: ID!): [Audit]

        share(id: ID!): Share
        tableByShare(shareId: ID!): Table
        baseByShare(shareId: ID!): Base
        tableByShareBase(shareId: ID!, tableId: ID!): Table

        template(shareId: ID!): Template
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

            const space = (await this.queryBus.execute(new GetSpaceByIdQuery({ id: spaceId }))) as Option<ISpaceDTO>

            if (space.isNone()) {
              return null
            }
            return space.unwrap()
          },
          spaces: async () => {
            const userId = getCurrentUserId()
            if (!userId) {
              return []
            }
            return this.queryBus.execute(new GetMemberSpacesQuery({ userId }))
          },
          members: async (_, args) => {
            const spaceId = getCurrentSpaceId()
            if (!spaceId) {
              return []
            }
            return this.queryBus.execute(new GetMembersQuery({ spaceId, q: args?.q }))
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
              return null
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
          baseByShare: async (_, args) => {
            const base = await this.queryBus.execute(new GetBaseByShareQuery({ shareId: args.shareId }))
            return base
          },
          tableByShareBase: async (_, args) => {
            const table = await this.queryBus.execute(
              new GetTableByShareBaseQuery({ shareId: args.shareId, tableId: args.tableId }),
            )
            return table
          },
          tables: async (_, args) => {
            return this.queryBus.execute(new GetTablesQuery({ baseId: args?.baseId }))
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
          template: async (_, { shareId }) => {
            const template = await this.queryBus.execute(new GetTemplateQuery({ shareId }))
            return template
          },
        },
        Base: {
          // @ts-ignore
          tables: async (base) => {
            return this.queryBus.execute(new GetTablesByBaseIdQuery({ baseId: base.id }))
          },
          // @ts-ignore
          share: async (base) => {
            return (
              await this.shareService.getShareByTarget({ type: "base", id: base.id }, mustGetCurrentSpaceId())
            ).into(null)
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
            return (
              await this.shareService.getShareByTarget({ type: "view", id: view.id }, mustGetCurrentSpaceId())
            ).into(null)
          },
        },
        Form: {
          // @ts-ignore
          share: async (form) => {
            return (
              await this.shareService.getShareByTarget({ type: "form", id: form.id }, mustGetCurrentSpaceId())
            ).into(null)
          },
        },
        Audit: {
          // @ts-ignore
          operator: async (audit) => {
            return (await this.userRepo.findOneById(audit.operatorId)).unwrap()
          },
        },
        Space: {
          // @ts-ignore
          member: async (space) => {
            const userId = getCurrentUserId()
            if (!userId) {
              return null
            }
            const member = (await this.queryBus.execute(
              new GetSpaceMemberQuery({ spaceId: space.id, userId }),
            )) as Option<ISpaceMemberDTO[]>

            if (member.isNone()) {
              return null
            }
            return member.unwrap()
          },
        },
      },
      batching: true,
    })
  }
}
