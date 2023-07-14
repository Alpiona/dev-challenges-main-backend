import { BelongsTo, belongsTo, column, computed } from '@ioc:Adonis/Lucid/Orm'
import { OperatingSystems } from 'App/Constants/OperatingSystems'
import { DateTime } from 'luxon'
import AppBaseModel from './AppBaseModel'
import Game from './Game'

export default class GameBuild extends AppBaseModel {
  @column({ isPrimary: true, serializeAs: null })
  public id: string

  @column({ serializeAs: null })
  public gameId: string | null

  @column({ serializeAs: null })
  public fileExtension: string

  @column({ serializeAs: null })
  public operatingSystemId: number

  @computed()
  public get operatingSystem() {
    return Object.keys(OperatingSystems).find(
      (key) => OperatingSystems[key] === this.operatingSystemId
    )
  }

  @computed()
  public get url() {
    return `http://localhost:3333/files/download?fileName=${this.id}.${this.fileExtension}&type=GAME_BUILD`
  }

  @column()
  public version: string

  @column()
  public size: string

  @belongsTo(() => Game)
  public games: BelongsTo<typeof Game>

  @column.dateTime({ autoCreate: true, serializeAs: null })
  public createdAt: DateTime
}
