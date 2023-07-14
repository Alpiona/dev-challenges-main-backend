import { BelongsTo, belongsTo, column, computed } from '@ioc:Adonis/Lucid/Orm'
import { DateTime } from 'luxon'
import AppBaseModel from './AppBaseModel'
import Game from './Game'

export default class GameImage extends AppBaseModel {
  @column({ isPrimary: true, serializeAs: null })
  public id: string

  @column({ serializeAs: null })
  public gameId: string

  @column({ serializeAs: null })
  public fileExtension: string

  @computed()
  public get url() {
    return `http://localhost:3333/files/download?fileName=${this.id}.${this.fileExtension}&type=GAME_IMAGE`
  }

  @belongsTo(() => Game)
  public games: BelongsTo<typeof Game>

  @column.dateTime({ autoCreate: true, serializeAs: null })
  public createdAt: DateTime
}
