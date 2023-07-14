import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class extends BaseSchema {
  protected tableName = 'game_builds'

  public async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.uuid('id').primary().defaultTo(this.db.knexRawQuery('uuid_generate_v4()'))
      table.uuid('game_id').references('games.id').nullable()
      table.string('file_extension').notNullable()
      table.integer('operating_system_id').notNullable()
      table.string('version').notNullable()
      table.string('size').notNullable()

      table.timestamp('created_at', { useTz: true })

      table.index('game_id')
      table.index('operating_system_id')
    })
  }

  public async down() {
    this.schema.dropTable(this.tableName)
  }
}
