import {
  BaseModel,
  BelongsTo,
  belongsTo,
  column,
  ManyToMany,
  manyToMany,
} from '@ioc:Adonis/Lucid/Orm'
import { DateTime } from 'luxon'
import Genre from './Genre'
import User from './User'

export default class Game extends BaseModel {
  @column({ isPrimary: true })
  public id: string

  @column()
  public authorId: string

  @belongsTo(() => User, { foreignKey: 'authorId' })
  public author: BelongsTo<typeof User>

  @manyToMany(() => Genre, {
    pivotTimestamps: {
      updatedAt: false,
      createdAt: 'created_at',
    },
  })
  public genres: ManyToMany<typeof Genre>

  @manyToMany(() => User, {
    pivotTimestamps: {
      updatedAt: false,
      createdAt: 'created_at',
    },
  })
  public users: ManyToMany<typeof User>

  @column()
  public title: string

  @column()
  public description: string

  @column()
  public projectUrl: string | null

  @column()
  public coverImage: string

  @column()
  public platformUrlPath: string

  @column()
  public tagline: string | null

  @column()
  public price: number

  @column()
  public status: number

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime
}
