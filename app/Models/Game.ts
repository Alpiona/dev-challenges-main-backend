import {
  BelongsTo,
  belongsTo,
  column,
  computed,
  HasMany,
  hasMany,
  ManyToMany,
  manyToMany,
} from '@ioc:Adonis/Lucid/Orm'
import { GameStatus } from 'App/Constants/GameStatus'
import { DateTime } from 'luxon'
import AppBaseModel from './AppBaseModel'
import GameBuild from './GameBuild'
import GameImage from './GameImage'
import Genre from './Genre'
import User from './User'

export default class Game extends AppBaseModel {
  public serializeExtras() {
    return {
      hasBought: this.$extras.bought || false,
    }
  }

  @column({ isPrimary: true })
  public id: string

  @column()
  public authorId: string

  @belongsTo(() => User, { foreignKey: 'authorId', serializeAs: null })
  public author: BelongsTo<typeof User>

  @computed()
  public get authorUsername() {
    return this.author && this.author.username
  }

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

  @hasMany(() => GameImage)
  public images: HasMany<typeof GameImage>

  @hasMany(() => GameBuild)
  public builds: HasMany<typeof GameBuild>

  @column()
  public title: string

  @column()
  public description: string

  @column()
  public projectUrl: string | null

  @column()
  public coverImage: string

  @computed()
  public get coverImageUrl() {
    return `http://localhost:3333/files/download?fileName=${this.coverImage}&type=GAME_COVER_IMAGE`
  }

  @column()
  public platformUrlPath: string

  @column()
  public tagline: string | null

  @column({ serialize: (value) => Number(value) })
  public price: number

  @column({
    serialize: (value) => Object.keys(GameStatus).find((key) => GameStatus[key] === value),
  })
  public status: number

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime
}
