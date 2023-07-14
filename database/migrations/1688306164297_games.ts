import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class extends BaseSchema {
  protected tableName = 'games'

  public async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.uuid('id').primary().defaultTo(this.db.knexRawQuery('uuid_generate_v4()'))
      table.uuid('author_id').references('users.id').notNullable()
      table.string('title', 200).notNullable().unique()
      table.string('platform_url_path', 200).notNullable().unique()
      table.text('description').notNullable()
      table.string('project_url').nullable()
      table.string('cover_image', 50).notNullable()
      table.string('tagline', 40).nullable()
      table.decimal('price', 10, 2).notNullable()
      table.decimal('discount', 10, 2).notNullable().defaultTo(0)
      table.integer('status').notNullable()
      table.timestamp('created_at', { useTz: true })
      table.timestamp('updated_at', { useTz: true })

      table.index('title')
      table.index('author_id')
    })
  }

  public async down() {
    this.schema.dropTable(this.tableName)
  }
}
