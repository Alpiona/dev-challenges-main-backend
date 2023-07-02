import Hash from '@ioc:Adonis/Core/Hash'
import { BaseModel, beforeSave, column, ManyToMany, manyToMany } from '@ioc:Adonis/Lucid/Orm'
import { DateTime } from 'luxon'
import Game from './Game'

export default class User extends BaseModel {
  @column({ isPrimary: true })
  public id: string

  @column()
  public email: string

  @column()
  public username: string

  @column()
  public type: number

  @column({ serializeAs: null })
  public password: string

  @manyToMany(() => Game, {
    pivotTimestamps: {
      createdAt: 'created_at',
      updatedAt: false,
    },
  })
  public games: ManyToMany<typeof Game>

  @column()
  public rememberMeToken: string | null

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime

  @beforeSave()
  public static async hashPassword(sessionToken: User) {
    if (sessionToken.$dirty.password) {
      sessionToken.password = await Hash.make(sessionToken.password)
    }
  }
}
