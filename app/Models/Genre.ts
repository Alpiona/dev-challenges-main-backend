import { column, ManyToMany, manyToMany } from '@ioc:Adonis/Lucid/Orm'
import { DateTime } from 'luxon'
import AppBaseModel from './AppBaseModel'
import Game from './Game'

export default class Genre extends AppBaseModel {
  @column({ isPrimary: true })
  public id: number

  @column()
  public name: string

  @manyToMany(() => Game, {
    pivotTimestamps: {
      createdAt: 'created_at',
      updatedAt: false,
    },
  })
  public games: ManyToMany<typeof Game>

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime
}
