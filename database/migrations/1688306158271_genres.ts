import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class extends BaseSchema {
  protected tableName = 'genres'

  public async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id')
      table.string('name', 30).unique()
      table.timestamp('created_at', { useTz: true })

      table.index('name')
    })
  }

  public async down() {
    this.schema.dropTable(this.tableName)
  }
}
