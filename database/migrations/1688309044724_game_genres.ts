import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class extends BaseSchema {
  protected tableName = 'game_genre'

  public async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.uuid('game_id').references('games.id').primary().notNullable()
      table.integer('genre_id').references('genres.id').primary().notNullable()

      table.timestamp('created_at', { useTz: true })

      table.index('game_id')
      table.index('genre_id')
    })
  }

  public async down() {
    this.schema.dropTable(this.tableName)
  }
}
