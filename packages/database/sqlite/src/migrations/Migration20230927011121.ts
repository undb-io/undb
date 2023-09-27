import { Migration } from '@mikro-orm/migrations'

export class Migration20230927011121 extends Migration {
  async up(): Promise<void> {
    this.addSql(
      'create table `undb_base` (`id` text not null, `created_at` datetime not null, `updated_at` datetime not null, `deleted_at` datetime null, `name` text not null, primary key (`id`));',
    )
    this.addSql('create index `undb_base_deleted_at_index` on `undb_base` (`deleted_at`);')

    this.addSql(
      'create table `undb_outbox` (`uuid` text not null, `created_at` datetime not null, `updated_at` datetime not null, `deleted_at` datetime null, `name` text null, `operator_id` text null, `timestamp` datetime not null, `payload` json not null, `meta` json null, primary key (`uuid`));',
    )
    this.addSql('create index `undb_outbox_deleted_at_index` on `undb_outbox` (`deleted_at`);')

    this.addSql(
      'create table `undb_share` (`id` text not null, `created_at` datetime not null, `updated_at` datetime not null, `deleted_at` datetime null, `target_id` text null, `target_type` text null, `enabled` integer not null default false, primary key (`id`));',
    )
    this.addSql('create index `undb_share_deleted_at_index` on `undb_share` (`deleted_at`);')
    this.addSql('create index `undb_share_target_id_index` on `undb_share` (`target_id`);')
    this.addSql('create unique index `undb_share_target_id_unique` on `undb_share` (`target_id`);')

    this.addSql(
      'create table `undb_table` (`id` text not null, `created_at` datetime not null, `updated_at` datetime not null, `deleted_at` datetime null, `name` text not null, `emoji` text not null, `base_id` text null, `views_order` text null, constraint `undb_table_base_id_foreign` foreign key(`base_id`) references `undb_base`(`id`) on delete set null on update cascade, primary key (`id`));',
    )
    this.addSql('create index `undb_table_deleted_at_index` on `undb_table` (`deleted_at`);')
    this.addSql('create index `undb_table_base_id_index` on `undb_table` (`base_id`);')

    this.addSql(
      'create table `undb_rls` (`id` text not null, `created_at` datetime not null, `updated_at` datetime not null, `deleted_at` datetime null, `table_id` text null, `policy_action` text not null, `policy_filter` json not null, `subjects` json not null, constraint `undb_rls_table_id_foreign` foreign key(`table_id`) references `undb_table`(`id`) on delete cascade on update cascade, primary key (`id`));',
    )
    this.addSql('create index `undb_rls_deleted_at_index` on `undb_rls` (`deleted_at`);')
    this.addSql('create index `undb_rls_table_id_index` on `undb_rls` (`table_id`);')

    this.addSql(
      'create table `undb_form` (`id` text not null, `created_at` datetime not null, `updated_at` datetime not null, `deleted_at` datetime null, `name` text not null, `fields` json not null, `fields_order` text null, `table_id` text null, constraint `undb_form_table_id_foreign` foreign key(`table_id`) references `undb_table`(`id`) on delete cascade on update cascade, primary key (`id`));',
    )
    this.addSql('create index `undb_form_deleted_at_index` on `undb_form` (`deleted_at`);')
    this.addSql('create index `undb_form_table_id_index` on `undb_form` (`table_id`);')

    this.addSql(
      'create table `undb_field` (`id` text not null, `created_at` datetime not null, `updated_at` datetime not null, `deleted_at` datetime null, `table_id` text null, `name` text not null, `description` text null, `system` integer not null default false, `required` integer not null default false, `display` integer not null default false, `type` text not null, `format` text null, `time_format` text null, `foreign_table_id` text null, `symmetric_reference_field_id` text null, `is_owner` integer null default false, `parent_field_id` text null, `tree_field_id` text null, `max` integer null, `symbol` text null, `count_reference_field_id` text null, `lookup_reference_field_id` text null, `sum_reference_field_id` text null, `sum_aggregate_field_id` text null, `average_reference_field_id` text null, `average_aggregate_field_id` text null, `min_reference_field_id` text null, `min_aggregate_field_id` text null, `max_reference_field_id` text null, `max_aggregate_field_id` text null, `display_record_url` integer null default false, `data_field_id` text null, constraint `undb_field_table_id_foreign` foreign key(`table_id`) references `undb_table`(`id`) on delete cascade on update cascade, constraint `undb_field_foreign_table_id_foreign` foreign key(`foreign_table_id`) references `undb_table`(`id`) on delete set null on update cascade, constraint `undb_field_symmetric_reference_field_id_foreign` foreign key(`symmetric_reference_field_id`) references `undb_field`(`id`) on delete set null on update cascade, constraint `undb_field_count_reference_field_id_foreign` foreign key(`count_reference_field_id`) references `undb_field`(`id`) on delete set null on update cascade, constraint `undb_field_lookup_reference_field_id_foreign` foreign key(`lookup_reference_field_id`) references `undb_field`(`id`) on delete set null on update cascade, constraint `undb_field_sum_reference_field_id_foreign` foreign key(`sum_reference_field_id`) references `undb_field`(`id`) on delete set null on update cascade, constraint `undb_field_sum_aggregate_field_id_foreign` foreign key(`sum_aggregate_field_id`) references `undb_field`(`id`) on delete set null on update cascade, constraint `undb_field_average_reference_field_id_foreign` foreign key(`average_reference_field_id`) references `undb_field`(`id`) on delete set null on update cascade, constraint `undb_field_average_aggregate_field_id_foreign` foreign key(`average_aggregate_field_id`) references `undb_field`(`id`) on delete set null on update cascade, constraint `undb_field_min_reference_field_id_foreign` foreign key(`min_reference_field_id`) references `undb_field`(`id`) on delete set null on update cascade, constraint `undb_field_min_aggregate_field_id_foreign` foreign key(`min_aggregate_field_id`) references `undb_field`(`id`) on delete set null on update cascade, constraint `undb_field_max_reference_field_id_foreign` foreign key(`max_reference_field_id`) references `undb_field`(`id`) on delete set null on update cascade, constraint `undb_field_max_aggregate_field_id_foreign` foreign key(`max_aggregate_field_id`) references `undb_field`(`id`) on delete set null on update cascade, constraint `undb_field_data_field_id_foreign` foreign key(`data_field_id`) references `undb_field`(`id`) on delete set null on update cascade, primary key (`id`));',
    )
    this.addSql('create index `undb_field_deleted_at_index` on `undb_field` (`deleted_at`);')
    this.addSql('create index `undb_field_table_id_index` on `undb_field` (`table_id`);')
    this.addSql('create index `undb_field_type_index` on `undb_field` (`type`);')
    this.addSql('create index `undb_field_foreign_table_id_index` on `undb_field` (`foreign_table_id`);')
    this.addSql(
      'create unique index `undb_field_symmetric_reference_field_id_unique` on `undb_field` (`symmetric_reference_field_id`);',
    )
    this.addSql(
      'create index `undb_field_count_reference_field_id_index` on `undb_field` (`count_reference_field_id`);',
    )
    this.addSql(
      'create index `undb_field_lookup_reference_field_id_index` on `undb_field` (`lookup_reference_field_id`);',
    )
    this.addSql('create index `undb_field_sum_reference_field_id_index` on `undb_field` (`sum_reference_field_id`);')
    this.addSql('create index `undb_field_sum_aggregate_field_id_index` on `undb_field` (`sum_aggregate_field_id`);')
    this.addSql(
      'create index `undb_field_average_reference_field_id_index` on `undb_field` (`average_reference_field_id`);',
    )
    this.addSql(
      'create index `undb_field_average_aggregate_field_id_index` on `undb_field` (`average_aggregate_field_id`);',
    )
    this.addSql('create index `undb_field_min_reference_field_id_index` on `undb_field` (`min_reference_field_id`);')
    this.addSql('create index `undb_field_min_aggregate_field_id_index` on `undb_field` (`min_aggregate_field_id`);')
    this.addSql('create index `undb_field_max_reference_field_id_index` on `undb_field` (`max_reference_field_id`);')
    this.addSql('create index `undb_field_max_aggregate_field_id_index` on `undb_field` (`max_aggregate_field_id`);')
    this.addSql('create index `undb_field_data_field_id_index` on `undb_field` (`data_field_id`);')

    this.addSql(
      'create table `undb_option` (`key` text not null, `created_at` datetime not null, `updated_at` datetime not null, `deleted_at` datetime null, `field_id` text null, `name` text not null, `color_name` text not null, `color_shade` integer not null, `order` integer not null, constraint `undb_option_field_id_foreign` foreign key(`field_id`) references `undb_field`(`id`) on delete cascade on update cascade, primary key (`key`));',
    )
    this.addSql('create index `undb_option_deleted_at_index` on `undb_option` (`deleted_at`);')
    this.addSql('create index `undb_option_field_id_index` on `undb_option` (`field_id`);')
    this.addSql('create index `undb_option_name_index` on `undb_option` (`name`);')
    this.addSql('create index `undb_option_order_index` on `undb_option` (`order`);')

    this.addSql(
      'create table `undb_fls` (`id` text not null, `created_at` datetime not null, `updated_at` datetime not null, `deleted_at` datetime null, `table_id` text null, `field_id` text null, `policy_action` text not null, `policy_filter` json not null, `subjects` json not null, constraint `undb_fls_table_id_foreign` foreign key(`table_id`) references `undb_table`(`id`) on delete cascade on update cascade, constraint `undb_fls_field_id_foreign` foreign key(`field_id`) references `undb_field`(`id`) on delete cascade on update cascade, primary key (`id`));',
    )
    this.addSql('create index `undb_fls_deleted_at_index` on `undb_fls` (`deleted_at`);')
    this.addSql('create index `undb_fls_table_id_index` on `undb_fls` (`table_id`);')
    this.addSql('create index `undb_fls_field_id_index` on `undb_fls` (`field_id`);')

    this.addSql(
      'create table `undb_attachment` (`id` text not null, `record_id` text not null, `field_id` text not null, `created_at` datetime not null, `updated_at` datetime not null, `deleted_at` datetime null, `table_id` text not null, `mime_type` text not null, `name` text not null, `size` integer not null, `token` text not null, `url` text not null, `extension` text not null, constraint `undb_attachment_table_id_foreign` foreign key(`table_id`) references `undb_table`(`id`) on update cascade, primary key (`id`, `record_id`, `field_id`));',
    )
    this.addSql('create index `undb_attachment_deleted_at_index` on `undb_attachment` (`deleted_at`);')
    this.addSql('create index `undb_attachment_table_id_index` on `undb_attachment` (`table_id`);')
    this.addSql('create index `undb_attachment_mime_type_index` on `undb_attachment` (`mime_type`);')
    this.addSql('create index `undb_attachment_name_index` on `undb_attachment` (`name`);')
    this.addSql('create index `undb_attachment_size_index` on `undb_attachment` (`size`);')
    this.addSql('create index `undb_attachment_extension_index` on `undb_attachment` (`extension`);')

    this.addSql(
      'create table `undb_field_display_fields` (`field_1_id` text not null, `field_2_id` text not null, constraint `undb_field_display_fields_field_1_id_foreign` foreign key(`field_1_id`) references `undb_field`(`id`) on delete cascade on update cascade, constraint `undb_field_display_fields_field_2_id_foreign` foreign key(`field_2_id`) references `undb_field`(`id`) on delete cascade on update cascade, primary key (`field_1_id`, `field_2_id`));',
    )
    this.addSql(
      'create index `undb_field_display_fields_field_1_id_index` on `undb_field_display_fields` (`field_1_id`);',
    )
    this.addSql(
      'create index `undb_field_display_fields_field_2_id_index` on `undb_field_display_fields` (`field_2_id`);',
    )

    this.addSql(
      "create table `undb_user` (`id` text not null, `created_at` datetime not null, `updated_at` datetime not null, `deleted_at` datetime null, `avatar` text null, `username` text not null, `color` text not null default 'blue', `email` text not null, `password` text not null, primary key (`id`));",
    )
    this.addSql('create index `undb_user_deleted_at_index` on `undb_user` (`deleted_at`);')
    this.addSql('create index `undb_user_username_index` on `undb_user` (`username`);')
    this.addSql('create index `undb_user_email_index` on `undb_user` (`email`);')
    this.addSql('create unique index `undb_user_email_unique` on `undb_user` (`email`);')

    this.addSql(
      'create table `undb_member` (`id` text not null, `created_at` datetime not null, `updated_at` datetime not null, `deleted_at` datetime null, `role` text not null, `user_id` text not null, constraint `undb_member_user_id_foreign` foreign key(`user_id`) references `undb_user`(`id`) on update cascade, primary key (`id`));',
    )
    this.addSql('create index `undb_member_deleted_at_index` on `undb_member` (`deleted_at`);')
    this.addSql('create index `undb_member_user_id_index` on `undb_member` (`user_id`);')

    this.addSql(
      'create table `undb_invitation` (`id` text not null, `created_at` datetime not null, `updated_at` datetime not null, `deleted_at` datetime null, `email` text not null, `role` text not null, `expired_at` datetime not null, `status` text not null, `invited_by_id` text not null, `invited_at` datetime not null, `cancelled_by_id` text null, `cancelld_at` datetime null, `accepted_at` datetime null, constraint `undb_invitation_invited_by_id_foreign` foreign key(`invited_by_id`) references `undb_user`(`id`) on update cascade, constraint `undb_invitation_cancelled_by_id_foreign` foreign key(`cancelled_by_id`) references `undb_user`(`id`) on delete set null on update cascade, primary key (`id`));',
    )
    this.addSql('create index `undb_invitation_deleted_at_index` on `undb_invitation` (`deleted_at`);')
    this.addSql('create index `undb_invitation_email_index` on `undb_invitation` (`email`);')
    this.addSql('create unique index `undb_invitation_email_unique` on `undb_invitation` (`email`);')
    this.addSql('create index `undb_invitation_invited_by_id_index` on `undb_invitation` (`invited_by_id`);')
    this.addSql('create index `undb_invitation_cancelled_by_id_index` on `undb_invitation` (`cancelled_by_id`);')

    this.addSql(
      'create table `undb_audit` (`id` text not null, `created_at` datetime not null, `updated_at` datetime not null, `deleted_at` datetime null, `timestamp` datetime not null, `op` text not null, `target_id` text null, `target_type` text null, `detail` json null, `operator_id` text not null, `table_id` text null, constraint `undb_audit_operator_id_foreign` foreign key(`operator_id`) references `undb_user`(`id`) on update cascade, constraint `undb_audit_table_id_foreign` foreign key(`table_id`) references `undb_table`(`id`) on delete cascade on update cascade, primary key (`id`));',
    )
    this.addSql('create index `undb_audit_deleted_at_index` on `undb_audit` (`deleted_at`);')
    this.addSql('create index `undb_audit_timestamp_index` on `undb_audit` (`timestamp`);')
    this.addSql('create index `undb_audit_op_index` on `undb_audit` (`op`);')
    this.addSql('create index `undb_audit_target_id_index` on `undb_audit` (`target_id`);')
    this.addSql('create index `undb_audit_operator_id_index` on `undb_audit` (`operator_id`);')
    this.addSql('create index `undb_audit_table_id_index` on `undb_audit` (`table_id`);')

    this.addSql(
      'create table `undb_api_token` (`id` text not null, `created_at` datetime not null, `updated_at` datetime not null, `deleted_at` datetime null, `token` text not null, `user_id` text not null, constraint `undb_api_token_user_id_foreign` foreign key(`user_id`) references `undb_user`(`id`) on update cascade, primary key (`id`));',
    )
    this.addSql('create index `undb_api_token_deleted_at_index` on `undb_api_token` (`deleted_at`);')
    this.addSql('create unique index `undb_api_token_token_unique` on `undb_api_token` (`token`);')
    this.addSql('create index `undb_api_token_user_id_index` on `undb_api_token` (`user_id`);')

    this.addSql(
      "create table `undb_view` (`id` text not null, `created_at` datetime not null, `updated_at` datetime not null, `deleted_at` datetime null, `table_id` text null, `name` text not null, `show_system_fields` integer not null default false, `display_type` text not null, `sorts` json null, `kanban_field_id` text null, `gallery_field_id` text null, `gantt_field_id` text null, `calendar_field_id` text null, `tree_field_id` text null, `filter` json null, `field_options` json null, `fields_order` text null, `pinned_fields` json null, `row_height` text check (`row_height` in ('short', 'medium', 'tall')) null, constraint `undb_view_table_id_foreign` foreign key(`table_id`) references `undb_table`(`id`) on delete cascade on update cascade, primary key (`id`));",
    )
    this.addSql('create index `undb_view_deleted_at_index` on `undb_view` (`deleted_at`);')
    this.addSql('create index `undb_view_table_id_index` on `undb_view` (`table_id`);')

    this.addSql(
      'create table `undb_visualization` (`id` text not null, `created_at` datetime not null, `updated_at` datetime not null, `deleted_at` datetime null, `name` text not null, `type` text not null, `table_id` text null, `number_aggregate_function` text null, `field_id` text null, `chart_aggregate_function` text null, `chart_type` text null, constraint `undb_visualization_table_id_foreign` foreign key(`table_id`) references `undb_table`(`id`) on delete cascade on update cascade, primary key (`id`));',
    )
    this.addSql('create index `undb_visualization_deleted_at_index` on `undb_visualization` (`deleted_at`);')
    this.addSql('create index `undb_visualization_type_index` on `undb_visualization` (`type`);')
    this.addSql('create index `undb_visualization_table_id_index` on `undb_visualization` (`table_id`);')

    this.addSql(
      'create table `undb_webhook` (`id` text not null, `created_at` datetime not null, `updated_at` datetime not null, `deleted_at` datetime null, `url` text not null, `name` text not null, `method` text not null, `headers` json not null, `target_id` text null, `target_type` text null, `event` text null, `enabled` integer not null default false, `filter` json null, primary key (`id`));',
    )
    this.addSql('create index `undb_webhook_deleted_at_index` on `undb_webhook` (`deleted_at`);')
    this.addSql('create index `undb_webhook_url_index` on `undb_webhook` (`url`);')
    this.addSql('create index `undb_webhook_name_index` on `undb_webhook` (`name`);')
    this.addSql('create index `undb_webhook_method_index` on `undb_webhook` (`method`);')
    this.addSql('create index `undb_webhook_target_id_index` on `undb_webhook` (`target_id`);')
    this.addSql('create index `undb_webhook_event_index` on `undb_webhook` (`event`);')

    this.addSql(
      'create table `undb_widget` (`id` text not null, `created_at` datetime not null, `updated_at` datetime not null, `deleted_at` datetime null, `layout` json not null, `view_id` text not null, `visualization_id` text null, constraint `undb_widget_view_id_foreign` foreign key(`view_id`) references `undb_view`(`id`) on update cascade, constraint `undb_widget_visualization_id_foreign` foreign key(`visualization_id`) references `undb_visualization`(`id`) on delete set null on update cascade, primary key (`id`));',
    )
    this.addSql('create index `undb_widget_deleted_at_index` on `undb_widget` (`deleted_at`);')
    this.addSql('create index `undb_widget_view_id_index` on `undb_widget` (`view_id`);')
    this.addSql('create unique index `undb_widget_visualization_id_unique` on `undb_widget` (`visualization_id`);')
  }
}
