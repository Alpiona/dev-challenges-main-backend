import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class extends BaseSchema {
  protected tableName = 'game_user'

  public async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.uuid('game_id').references('games.id').notNullable()
      table.uuid('user_id').references('users.id').notNullable()

      table.timestamp('created_at', { useTz: true })

      table.unique(['game_id', 'user_id'])

      table.index('game_id')
      table.index('user_id')
    })
  }

  public async down() {
    this.schema.dropTable(this.tableName)
  }
}
