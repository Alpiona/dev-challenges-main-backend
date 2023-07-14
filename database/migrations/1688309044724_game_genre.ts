import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class extends BaseSchema {
  protected tableName = 'game_genre'

  public async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id').primary()
      table.uuid('game_id').references('games.id').notNullable()
      table.integer('genre_id').references('genres.id').notNullable()

      table.timestamp('created_at', { useTz: true })

      table.unique(['game_id', 'genre_id'])
      table.index('game_id')
      table.index('genre_id')
    })
  }

  public async down() {
    this.schema.dropTable(this.tableName)
  }
}
